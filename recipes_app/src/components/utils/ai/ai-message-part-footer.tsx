"use client";

import type { TextUIPart } from "ai";
import { CopyIcon, EditIcon, RefreshCcwIcon, TrashIcon } from "lucide-react";
import { useCallback } from "react";
import {
	MessageAction,
	MessageActions,
	MessageBranchNext,
	MessageBranchPage,
	MessageBranchPrevious,
	MessageBranchSelector,
} from "@/components/ai-elements/message";
import { usePromptInputController } from "@/components/ai-elements/prompt-input";
import { cn } from "@/lib/utils";
import { useChatContext } from "./_providers/chat-provider";
import type { MyUIMessage } from "./_types/types";

interface AiMessageFooterPartActionProps {
	message: MyUIMessage;
}

function base64URLtoFile(dataURL: string, filename: string): File {
	const [header, base64] = dataURL.split(",");
	const mime = header.match(/:(.*?);/)?.[1] || "";
	const binary = atob(base64);
	const array = new Uint8Array(binary.length);

	for (let i = 0; i < binary.length; i++) {
		array[i] = binary.charCodeAt(i);
	}

	return new File([array], filename, { type: mime });
}

export function AiMessageFooterPartAction({
	...props
}: AiMessageFooterPartActionProps) {
	const {
		regenerate,
		setEditingMessageId,
		setMessages,
		messages,
		setCurrentBranchId,
		status,
	} = useChatContext();
	const promptInputController = usePromptInputController();

	const handleRetry = useCallback(() => {
		regenerate({
			messageId: props.message.id,
		});
	}, [regenerate, props.message.id]);

	const handleCopy = useCallback((content: MyUIMessage) => {
		const textPart = content.parts
			.filter((part) => part.type === "text")
			.map((part) => (part as TextUIPart).text)
			.join(" ");

		navigator.clipboard.writeText(textPart);
	}, []);

	const handleEdit = useCallback(
		(content: MyUIMessage) => {
			promptInputController.attachments.clear();
			const textParts = content.parts
				.filter(
					(part): part is { type: "text"; text: string } =>
						part.type === "text",
				)
				.map((part) => part.text)
				.join("\n");

			const fileParts = content.parts.filter(
				(
					part,
				): part is {
					type: "file";
					url: string;
					mediaType: string;
					filename: string;
				} => part.type === "file",
			);

			const fileObjects = fileParts.map((part) =>
				base64URLtoFile(part.url, part.filename),
			);

			promptInputController.textInput.setInput(textParts);
			promptInputController.attachments.add(fileObjects);
			setEditingMessageId(content.id);
		},
		[promptInputController, setEditingMessageId],
	);

	const handleDelete = useCallback(
		(content: MyUIMessage) => {
			const idsToDelete: MyUIMessage["id"][] = [];

			const collectDescendants = (messageId: string) => {
				if (!idsToDelete.includes(messageId)) {
					idsToDelete.push(messageId);
				}
				const children = messages.filter(
					(msg) => msg.metadata?.parentMessageId === messageId,
				);
				children.forEach((child) => {
					collectDescendants(child.id);
				});
			};

			collectDescendants(content.id);

			const updatedMessages = messages.filter(
				(msg) => !idsToDelete.includes(msg.id),
			);

			const allMessagesByBranch = [
				...updatedMessages.filter(
					(msg) =>
						content.metadata?.parentMessageId ===
							msg.metadata?.parentMessageId &&
						content.metadata?.branchId !== msg.metadata?.branchId,
				),
			]
				.sort(
					(a, b) => (a.metadata?.createdAt ?? 0) - (b.metadata?.createdAt ?? 0),
				)
				.slice(-1);

			if (
				allMessagesByBranch.length > 0 &&
				allMessagesByBranch[0].metadata?.branchId
			) {
				setCurrentBranchId(allMessagesByBranch[0].metadata?.branchId);
			} else if (allMessagesByBranch.length === 0 && messages.length === 4) {
				if (messages[0].metadata?.branchId) {
					setCurrentBranchId(messages[0].metadata?.branchId);
				}
			}

			setMessages(updatedMessages);
		},
		[messages, setCurrentBranchId, setMessages],
	);

	const actions = [
		{
			icon: <RefreshCcwIcon />,
			label: "Retry",
			onClick: handleRetry,
			visibleTo: ["assistant"],
		},
		{
			icon: <CopyIcon />,
			label: "Copy",
			onClick: () => handleCopy(props.message),
			visibleTo: ["user"],
		},
		{
			icon: <EditIcon />,
			label: "Edit",
			onClick: () => handleEdit(props.message),
			visibleTo: ["user"],
		},
		{
			icon: <TrashIcon />,
			label: "Delete",
			onClick: () => handleDelete(props.message),
			visibleTo: ["user"],
		},
	];

	const visibleActions = actions.filter((action) =>
		action.visibleTo.includes(props.message.role),
	);

	return (
		<MessageActions
			className={cn(
				props.message.role !== "user" ? "justify-start" : "justify-end",
				"opacity-0 group-hover:opacity-100 transition-opacity",
			)}
		>
			<div className="flex gap-0.5">
				<MessageBranchSelector from={props.message.role}>
					<MessageBranchPrevious />
					<MessageBranchPage />
					<MessageBranchNext />
				</MessageBranchSelector>
				{visibleActions.map((action) => (
					<MessageAction
						key={action.label}
						onClick={action.onClick}
						label={action.label}
						aria-label={action.label}
						title={action.label}
						disabled={status !== "ready" && status !== "error"}
					>
						{action.icon}
					</MessageAction>
				))}
			</div>
		</MessageActions>
	);
}
