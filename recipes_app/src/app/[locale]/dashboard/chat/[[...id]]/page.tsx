import { ChefHat, Clock, Sparkles, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense, use } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { ChatProvider } from "@/components/utils/ai/_providers/chat-provider";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";
import AiChat from "@/components/utils/ai/ai-chat";
import type { Chat } from "@/generated/prisma";
import { getI18n } from "@/locales/server";
import {
	getActiveChat,
	getChatById,
	setActiveChat,
} from "./_components/_serveractions/actions";
// biome-ignore lint/suspicious/noShadowRestrictedNames: Error name
import Error from "./error";
import Loading from "./loading";

interface PageProps {
	params: Promise<{ id?: string }>;
}

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

export function ChatAi({ ...props }: ChatAiProps) {
	"use client";
	const currentChat = use(props.chat);
	const currentMessages: MyUIMessage[] = currentChat.chat?.messages
		? (JSON.parse(
				JSON.stringify(currentChat.chat.messages, null, 2),
			) as MyUIMessage[])
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

export default async function Page({ params }: PageProps) {
	"use server";
	const { id } = await params;
	const t = await getI18n();

	if (!id || id.length === 0) {
		const { chat } = await getActiveChat();
		if (chat === null) {
			const { id: newId } = await setActiveChat();
			redirect(`/dashboard/chat/${newId}`);
		} else {
			redirect(`/dashboard/chat/${chat?.id}`);
		}
	}

	const chatId = id[0];
	const chat = getChatById(chatId);

	const models = [
		{
			id: "magistral-small-2506",
			name: "Magistral",
			chef: "Mistral",
			chefSlug: "mistral",
			providers: ["mistral"],
		},
	];

	const suggestions = [
		{
			icon: <ChefHat />,
			name: t("quickPrompts.newRecipe.title"),
			description: t("quickPrompts.newRecipe.description"),
			prompt: t("quickPrompts.newRecipe.prompt"),
		},
		{
			icon: <Clock />,
			name: t("quickPrompts.quickRecipe.title"),
			description: t("quickPrompts.quickRecipe.description"),
			prompt: t("quickPrompts.quickRecipe.prompt"),
		},
		{
			icon: <Users />,
			name: t("quickPrompts.familyRecipe.title"),
			description: t("quickPrompts.familyRecipe.description"),
			prompt: t("quickPrompts.familyRecipe.prompt"),
		},
		{
			icon: <Sparkles />,
			name: t("quickPrompts.catchRecipe.title"),
			description: t("quickPrompts.catchRecipe.description"),
			prompt: t("quickPrompts.catchRecipe.prompt"),
		},
	];

	const placeholder = t("aiChat.aiInput.placehoder");

	return (
		<ErrorBoundary fallback={<Error />}>
			<Suspense fallback={<Loading />}>
				<ChatAi
					models={models}
					suggestions={suggestions}
					chat={chat}
					placeholder={placeholder}
				/>
			</Suspense>
		</ErrorBoundary>
	);
}
