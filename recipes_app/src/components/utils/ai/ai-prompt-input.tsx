"use client";

import { type UUIDTypes, v4 as uuidv4 } from "uuid";
import {
	PromptInput,
	PromptInputAttachment,
	PromptInputAttachments,
	PromptInputBody,
	PromptInputFooter,
	type PromptInputMessage,
	PromptInputSubmit,
	PromptInputTextarea,
	PromptInputTools,
} from "@/components/ai-elements/prompt-input";
import { Suggestion, Suggestions } from "@/components/ai-elements/suggestion";
import {
	Tooltip,
	TooltipContent,
	TooltipTrigger,
} from "@/components/ui/tooltip";
import { useI18n } from "@/locales/client";
import { useChatContext } from "./_providers/chat-provider";
import type { MessageMetadata } from "./_types/types";
import {
	ToolBarInputActionMenu,
	ToolBarInputButton,
	ToolBarInputModelSelector,
} from "./ai-toolbar";

interface PromptInputToolbarSectionProps {
	disabledFile?: boolean;
	disabledwebSearch?: boolean;
	disabledModelSelect?: boolean;
}

interface AiPromptInputProps extends PromptInputToolbarSectionProps {
	className?: string;
}

interface PromptInputSuggestionSectionProps {
	onSuggestion: (text: string) => void;
}

export function PromptInputSuggestionSection({
	...props
}: PromptInputSuggestionSectionProps) {
	const { suggestions } = useChatContext();

	const handleSuggestionClick = (suggestion: string) => {
		props.onSuggestion(suggestion);
	};

	return suggestions.length > 0 ? (
		<Suggestions className="py-2">
			{suggestions.map((suggestion, i) => {
				return suggestion.description ? (
					<Tooltip key={`${suggestion.name}-${i}`}>
						<TooltipTrigger asChild>
							<Suggestion
								aria-label={suggestion.name}
								onClick={() => handleSuggestionClick(suggestion.prompt)}
								suggestion={suggestion.name}
							>
								{suggestion?.icon} {suggestion.name}
							</Suggestion>
						</TooltipTrigger>
						<TooltipContent>{suggestion.description}</TooltipContent>
					</Tooltip>
				) : (
					<Suggestion
						aria-label={suggestion.name}
						key={`${suggestion.name}-${i}`}
						onClick={() => handleSuggestionClick(suggestion.prompt)}
						suggestion={suggestion.name}
					>
						{suggestion?.icon} {suggestion.name}
					</Suggestion>
				);
			})}
		</Suggestions>
	) : null;
}

export function PromptInputBodySection() {
	const { input, setInput, placeholder } = useChatContext();
	return (
		<>
			<PromptInputAttachments className="w-full">
				{(attachment) => <PromptInputAttachment data={attachment} />}
			</PromptInputAttachments>
			<PromptInputBody>
				<PromptInputTextarea
					onChange={(e) => setInput(e.target.value)}
					value={input}
					placeholder={placeholder}
				/>
			</PromptInputBody>
		</>
	);
}

export function PromptInputToolbarSection({
	...props
}: PromptInputToolbarSectionProps) {
	const { status, input } = useChatContext();
	return (
		<PromptInputFooter>
			<PromptInputTools>
				{!props.disabledFile ? <ToolBarInputActionMenu /> : null}

				{!props.disabledwebSearch ? <ToolBarInputButton /> : null}

				{!props.disabledModelSelect ? <ToolBarInputModelSelector /> : null}
			</PromptInputTools>

			<PromptInputSubmit disabled={!input && !status} status={status} />
		</PromptInputFooter>
	);
}

export default function AiPromptInput({ ...props }: AiPromptInputProps) {
	const {
		stop,
		status,
		clearError,
		editingMessageId,
		messages,
		currentBranchId,
		sendMessage,
		model,
		webSearch,
		setInput,
		setCurrentBranchId,
		setEditingMessageId,
		chatId,
	} = useChatContext();
	const t = useI18n();

	const handleSubmit = (message: PromptInputMessage) => {
		const hasText = Boolean(message.text);
		const hasAttachments = Boolean(message.files?.length);

		if (!(hasText || hasAttachments)) {
			return;
		}

		let branchId: UUIDTypes;
		let parentMessageId: string | null;

		if (editingMessageId) {
			const editedMessage = messages.find((m) => m.id === editingMessageId);
			parentMessageId = editedMessage?.metadata?.parentMessageId ?? null;
			branchId = uuidv4();
		} else {
			const lastMessage = messages[messages.length - 1];
			parentMessageId = lastMessage?.id ?? null;
			branchId = currentBranchId;
		}
		sendMessage(
			{
				text: message.text || t("components.ai.input.DefaultAttachmentText"),
				files: message.files,
				metadata: {
					branchId: branchId,
					parentMessageId: parentMessageId,
					createdAt: Date.now(),
				} as MessageMetadata,
			},
			{
				body: {
					model: model,
					webSearch: webSearch,
					chatId: chatId,
				},
			},
		);

		setInput("");
		if (editingMessageId) {
			setCurrentBranchId(branchId);
		}
		setEditingMessageId(null);
	};

	return (
		<>
			<PromptInputSuggestionSection
				onSuggestion={(text) => {
					handleSubmit({ text, files: [] });
				}}
			/>
			<PromptInput
				onSubmit={
					status === "streaming"
						? stop
						: status === "error"
							? clearError
							: handleSubmit
				}
				className={`${props.className}`}
				globalDrop
				multiple
			>
				<PromptInputBodySection />
				<PromptInputToolbarSection {...props} />
			</PromptInput>
		</>
	);
}
