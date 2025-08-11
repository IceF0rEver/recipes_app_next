import { redirect } from "next/navigation";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import AiChat from "./_components/_chat/ai-chat";
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

export default async function Page({ params }: PageProps) {
	const { id } = await params;

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

	return (
		<ErrorBoundary fallback={<Error />}>
			<Suspense fallback={<Loading />}>
				<AiChat id={chatId} chat={chat} />
			</Suspense>
		</ErrorBoundary>
	);
}
