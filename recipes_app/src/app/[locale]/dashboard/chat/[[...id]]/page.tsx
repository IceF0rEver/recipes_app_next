import { ChefHat, Clock, Sparkles, Users } from "lucide-react";
import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getI18n } from "@/locales/server";
import ChatAi from "./_components/_chat/chat-page";
import { getActiveChat, getChatById, setActiveChat } from "./_components/_serveractions/actions";
// biome-ignore lint/suspicious/noShadowRestrictedNames: Error name
import Error from "./error";
import Loading from "./loading";

interface PageProps {
	params: Promise<{ id?: string }>;
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
				<ChatAi models={models} suggestions={suggestions} chat={chat} placeholder={placeholder} />
			</Suspense>
		</ErrorBoundary>
	);
}
