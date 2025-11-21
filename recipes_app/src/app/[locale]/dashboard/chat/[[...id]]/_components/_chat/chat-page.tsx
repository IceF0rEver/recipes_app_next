"use client";

import { use } from "react";
import { ChatProvider } from "@/components/utils/ai/_providers/chat-provider";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";
import AiChat from "@/components/utils/ai/ai-chat";
import type { Chat } from "@/generated/prisma";

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
interface ChatAiProps {
	models: Model[];
	suggestions: Suggestion[];
	chat: Promise<{
		chat?: Chat | null;
		error?: {
			message?: string;
			status?: number;
		};
	}>;
	placeholder?: string;
}
export default function ChatAi({ ...props }: ChatAiProps) {
	const currentChat = use(props.chat);
	const currentMessages: MyUIMessage[] = currentChat.chat?.messages
		? (JSON.parse(JSON.stringify(currentChat.chat.messages, null, 2)) as MyUIMessage[])
		: [];
	return (
		<ChatProvider
			models={props.models}
			suggestions={props.suggestions}
			initialMessages={currentMessages}
			placeholder={props.placeholder}
			chatId={currentChat.chat?.id ?? ""}
		>
			<AiChat disabledFile disabledModelSelect disabledwebSearch />
		</ChatProvider>
	);
}
