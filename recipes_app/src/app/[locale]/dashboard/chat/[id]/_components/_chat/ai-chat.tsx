"use client";

import { type UIMessage, useChat } from "@ai-sdk/react";
import { DefaultChatTransport } from "ai";
import { ChefHat, Clock, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import AiConversation from "./ai-conversation";
import AiInput from "./ai-input";
import AiQuickPrompts from "./ai-quick-prompts";

type Status = "submitted" | "streaming" | "ready" | "error";
interface AiChatProps {
	id?: string | undefined;
	initialMessages?: UIMessage[] | undefined;
}
export default function AiChat({ id, initialMessages }: AiChatProps) {
	const { messages, sendMessage } = useChat({
		id: id,
		messages: initialMessages,
		transport: new DefaultChatTransport({
			api: "/api/chat",
		}),
	});
	const [status, setStatus] = useState<Status>("ready");
	const t = useI18n();
	const handleSubmit = (text: string) => {
		setStatus("submitted");
		setStatus("streaming");
		sendMessage({ text: text });
		setStatus("ready");
	};

	const quickPrompts = [
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
	];

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
