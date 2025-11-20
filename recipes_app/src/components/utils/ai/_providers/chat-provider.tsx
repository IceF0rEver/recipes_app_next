"use client";

import { useChat } from "@ai-sdk/react";
import {
	DefaultChatTransport,
	lastAssistantMessageIsCompleteWithToolCalls,
} from "ai";
import { createContext, useContext, useState } from "react";
import { v4 as uuidv4 } from "uuid";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";

interface Model {
	id: string;
	name: string;
	chef: string;
	chefSlug: string;
	providers: string[];
}

interface Suggestion {
	name: string;
	prompt: string;
	description?: string;
	icon?: React.ReactNode;
}

interface ChatProviderProps {
	children: React.ReactNode;
	models: Model[];
	suggestions?: Suggestion[];
	initialMessages?: MyUIMessage[];
	placeholder?: string;
	chatId?: string;
}

interface ChatContextValue {
	messages: MyUIMessage[];
	sendMessage: ReturnType<typeof useChat<MyUIMessage>>["sendMessage"];
	regenerate: ReturnType<typeof useChat<MyUIMessage>>["regenerate"];
	status: ReturnType<typeof useChat<MyUIMessage>>["status"];
	stop: ReturnType<typeof useChat<MyUIMessage>>["stop"];
	clearError: ReturnType<typeof useChat<MyUIMessage>>["clearError"];
	error: ReturnType<typeof useChat<MyUIMessage>>["error"];
	setMessages: ReturnType<typeof useChat<MyUIMessage>>["setMessages"];
	addToolResult: ReturnType<typeof useChat<MyUIMessage>>["addToolResult"];
	resumeStream: ReturnType<typeof useChat<MyUIMessage>>["resumeStream"];

	input: string;
	setInput: (val: string) => void;

	model: string;
	setModel: (val: string) => void;

	models: Model[];
	setModels: (val: Model[]) => void;

	placeholder: string;
	setPlaceholder: (val: string) => void;

	webSearch: boolean;
	setWebSearch: (val: boolean) => void;

	editingMessageId: string | null;
	setEditingMessageId: (val: string | null) => void;

	currentBranchId: string;
	setCurrentBranchId: (val: string) => void;

	chatId: string;
	setChatId: (val: string) => void;

	suggestions: Suggestion[];
	setSuggestions: (val: Suggestion[]) => void;
}

const ChatContext = createContext<ChatContextValue | undefined>(undefined);

export const ChatProvider = ({ ...props }: ChatProviderProps) => {
	const [input, setInput] = useState<string>("");
	const [suggestions, setSuggestions] = useState<Suggestion[]>(
		props.suggestions ?? [],
	);
	const [initialMessages, _setInitialMessages] = useState<MyUIMessage[]>(
		props.initialMessages ?? [],
	);
	const [models, setModels] = useState<Model[]>(props.models);
	const [model, setModel] = useState<string>(props.models[0]?.id);
	const [webSearch, setWebSearch] = useState<boolean>(false);
	const [placeholder, setPlaceholder] = useState<string>(
		props.placeholder ?? "",
	);
	const [chatId, setChatId] = useState<string>(props.chatId ?? "");
	const [editingMessageId, setEditingMessageId] = useState<string | null>(null);
	const [currentBranchId, setCurrentBranchId] = useState<string>(
		initialMessages[initialMessages.length - 1]?.metadata?.branchId ??
			(() => uuidv4()),
	);

	const {
		messages,
		sendMessage,
		regenerate,
		status,
		stop,
		clearError,
		error,
		setMessages,
		addToolResult,
		resumeStream,
	} = useChat<MyUIMessage>({
		generateId: () => uuidv4(),
		sendAutomaticallyWhen: lastAssistantMessageIsCompleteWithToolCalls,
		messages: initialMessages,
		transport: new DefaultChatTransport({
			api: "/api/chat",
			body: {
				model: model,
			},
		}),
		async onToolCall({ toolCall }) {
			if (toolCall.dynamic) {
				return;
			}
			switch (toolCall.toolName) {
				case "getCurrentChatId": {
					addToolResult({
						tool: "getCurrentChatId",
						toolCallId: toolCall.toolCallId,
						output: {
							chatId: chatId,
						},
					});
					break;
				}
				default:
					break;
			}
		},
	});

	return (
		<ChatContext.Provider
			value={{
				messages,
				sendMessage,
				regenerate,
				stop,
				clearError,
				status,
				error,
				setMessages,
				addToolResult,
				resumeStream,
				input,
				setInput,
				model,
				setModel,
				models,
				setModels,
				webSearch,
				setWebSearch,
				editingMessageId,
				setEditingMessageId,
				currentBranchId,
				setCurrentBranchId,
				suggestions,
				setSuggestions,
				placeholder,
				setPlaceholder,
				chatId,
				setChatId,
			}}
		>
			{props.children}
		</ChatContext.Provider>
	);
};

export const useChatContext = () => {
	const context = useContext(ChatContext);
	if (!context) {
		throw new Error("useChatContext must be used within a ChatProvider");
	}
	return context;
};
