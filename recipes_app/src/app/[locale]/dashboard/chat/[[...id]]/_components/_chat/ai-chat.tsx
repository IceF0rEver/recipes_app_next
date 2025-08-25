"use client";

import { useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChefHat, Clock, Sparkles, Users } from "lucide-react";
import { use, useCallback, useEffect, useMemo } from "react";
import { toast } from "sonner";
import type { Chat } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import AiConversation from "./ai-conversation";
import AiInput from "./ai-input";
import AiQuickPrompts from "./ai-quick-prompts";

interface AiChatProps {
	id: string | undefined;
	chat: Promise<{
		chat?: Chat | null;
		error?: {
			message?: string;
			status?: number;
		};
	}>;
}

export default function AiChat({ id, chat }: AiChatProps) {
	const t = useI18n();
	const currentChat = use(chat);
	const { messages, sendMessage, status, stop, error } = useChat({
		id: id,
		messages: JSON.parse(currentChat.chat?.messages as string) ?? [],
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});

	const handleSubmit = useCallback(
		(text: string) => {
			sendMessage({ text: text });
		},
		[sendMessage],
	);

	const handleStop = useCallback(() => {
		stop();
	}, [stop]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: i18n
	useEffect(() => {
		if (error !== undefined) {
			toast.error(t("errors.unexpectedError"));
		}
	}, [error]);

	const quickPrompts = useMemo(
		() => [
			{
				icon: ChefHat,
				title: t("quickPrompts.newRecipe.title"),
				description: t("quickPrompts.newRecipe.description"),
				prompt: t("quickPrompts.newRecipe.prompt"),
			},
			{
				icon: Clock,
				title: t("quickPrompts.quickRecipe.title"),
				description: t("quickPrompts.quickRecipe.description"),
				prompt: t("quickPrompts.quickRecipe.prompt"),
			},
			{
				icon: Users,
				title: t("quickPrompts.familyRecipe.title"),
				description: t("quickPrompts.familyRecipe.description"),
				prompt: t("quickPrompts.familyRecipe.prompt"),
			},
			{
				icon: Sparkles,
				title: t("quickPrompts.catchRecipe.title"),
				description: t("quickPrompts.catchRecipe.description"),
				prompt: t("quickPrompts.catchRecipe.prompt"),
			},
		],
		[t],
	);

	return (
		<div
			className={cn(messages.length > 1 && "h-[90vh]", "flex justify-center")}
		>
			<div className="grid md:w-2/3 p-2 ">
				{messages.length <= 1 && (
					<AiQuickPrompts prompts={quickPrompts} onSubmit={handleSubmit} />
				)}
				<AiConversation messages={messages} />
				<AiInput
					onSubmit={handleSubmit}
					onStop={handleStop}
					chatId={id ?? ""}
					status={status}
					placeholder={t("aiChat.aiInput.placehoder")}
					className={cn(
						messages.length > 1 && "sticky bottom-0 md:pb-5 bg-background",
					)}
				/>
			</div>
		</div>
	);
}
