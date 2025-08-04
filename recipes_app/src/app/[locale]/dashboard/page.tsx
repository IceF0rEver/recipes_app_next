"use client";

import { useChat } from "@ai-sdk/react";
import { ChefHat, Clock, Sparkles, Users } from "lucide-react";
import { useState } from "react";
import AiConversation from "./_components/_chat/ai-conversation";
import AiInput from "./_components/_chat/ai-input";
import AiQuickPrompts from "./_components/_chat/ai-quick-prompts";

type Status = "submitted" | "streaming" | "ready" | "error";

const quickPrompts = [
	{
		icon: ChefHat,
		title: "Nouvelle recette",
		description: "Créer une recette personnalisée",
		prompt:
			"Aide-moi à créer une nouvelle recette avec les ingrédients que j'ai",
	},
	{
		icon: Clock,
		title: "Recette rapide",
		description: "Plat en moins de 30 min",
		prompt: "Propose-moi une recette rapide à préparer en moins de 30 minutes",
	},
	{
		icon: Users,
		title: "Repas de famille",
		description: "Pour 6-8 personnes",
		prompt:
			"Suggère-moi un menu complet pour un repas de famille de 8 personnes",
	},
	{
		icon: Sparkles,
		title: "Surprise-moi",
		description: "Recette aléatoire",
		prompt: "Surprise-moi avec une recette originale et délicieuse",
	},
];

export default function Page() {
	const { messages, sendMessage } = useChat();
	const [status, setStatus] = useState<Status>("ready");

	const handleSubmit = (text: string) => {
		setStatus("submitted");
		setStatus("streaming");
		sendMessage({ text: text });
		setStatus("ready");
	};

	return (
		<div className="mx-auto md:max-w-2/3 p-2">
			{messages.length <= 1 && (
				<AiQuickPrompts prompts={quickPrompts} onSubmit={handleSubmit} />
			)}
			<AiConversation messages={messages} />
			<AiInput onSubmit={handleSubmit} status={status} />
		</div>
	);
}
