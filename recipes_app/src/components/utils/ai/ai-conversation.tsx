"use client";

import { AlertCircle, RefreshCcwIcon } from "lucide-react";
import { useCallback, useEffect } from "react";
import {
	Conversation,
	ConversationContent,
	ConversationScrollButton,
} from "@/components/ai-elements/conversation";
import {
	Message,
	MessageAction,
	MessageActions,
	MessageContent,
} from "@/components/ai-elements/message";
import { usePromptInputController } from "@/components/ai-elements/prompt-input";
import { Button } from "@/components/ui/button";
import { Kbd } from "@/components/ui/kbd";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import { useChatContext } from "./_providers/chat-provider";
import type { MyUIMessage } from "./_types/types";
import { AiMessage } from "./ai-message";

interface AiConversationProps {
	disabledAvatar?: boolean;
	className?: string;
}

interface AiConversationErrorProps {
	message: MyUIMessage;
}

export function AiConversationError({ ...props }: AiConversationErrorProps) {
	const { clearError, regenerate, error, messages } = useChatContext();

	const handleRetry = useCallback(() => {
		clearError();
		regenerate({
			messageId: props.message.id,
		});
	}, [regenerate, clearError, props.message.id]);

	return (
		props.message.id === messages.at(-1)?.id && (
			<div className="grid gap-2">
				<Message from="system" className="p-0">
					<MessageContent variant={"error"}>
						<span className="flex gap-2 items-center">
							<AlertCircle />
							{error?.message}
						</span>
					</MessageContent>
				</Message>
				<MessageActions>
					<MessageAction onClick={handleRetry}>
						<RefreshCcwIcon />
					</MessageAction>
				</MessageActions>
			</div>
		)
	);
}

export function AiConversationEditButton() {
	const t = useI18n();
	const promptInputController = usePromptInputController();
	const { setEditingMessageId } = useChatContext();

	useEffect(() => {
		const handleKeyDown = (event: KeyboardEvent) => {
			if (event.key === "Escape") {
				setEditingMessageId(null);
				promptInputController.attachments.clear();
				promptInputController.textInput.clear();
			}
		};
		window.addEventListener("keydown", handleKeyDown);
		return () => {
			window.removeEventListener("keydown", handleKeyDown);
		};
	}, [setEditingMessageId, promptInputController]);

	return (
		<Button
			className="absolute bottom-1 left-[50%] translate-x-[-50%] rounded-md"
			onClick={() => {
				setEditingMessageId(null);
				promptInputController.attachments.clear();
				promptInputController.textInput.clear();
			}}
			type="button"
			variant="outline"
		>
			{t("button.cancelEdit")}
			<Kbd>Esc</Kbd>
		</Button>
	);
}

export default function AiConversation({ ...props }: AiConversationProps) {
	const { messages, error, editingMessageId, currentBranchId } =
		useChatContext();

	const getMessagesForCurrentBranch = useCallback(() => {
		const lastMessageInCurrentBranch = messages.findLast(
			(message) => message.metadata?.branchId === currentBranchId,
		);

		let currentMessageId = lastMessageInCurrentBranch?.id ?? null;

		const messageByIdMap = new Map(
			messages.map((message) => [message.id, message]),
		);
		const messagesInBranch: MyUIMessage[] = [];

		while (currentMessageId) {
			const currentMessage = messageByIdMap.get(currentMessageId);
			if (!currentMessage) break;

			messagesInBranch.push(currentMessage);
			currentMessageId = currentMessage.metadata?.parentMessageId ?? null;
		}

		return messagesInBranch.reverse();
	}, [currentBranchId, messages]);

	return (
		<Conversation className={cn("h-full", `${props.className}`)}>
			<ConversationContent>
				{getMessagesForCurrentBranch().map((message, i) => {
					return (
						<div key={`${message.id}-${i}`} className="py-0.5">
							{message.parts && <AiMessage {...props} message={message} />}
							{error ? <AiConversationError message={message} /> : null}
						</div>
					);
				})}
			</ConversationContent>
			{editingMessageId ? (
				<AiConversationEditButton />
			) : (
				<ConversationScrollButton />
			)}
		</Conversation>
	);
}
