"use server";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import type { Chat } from "@/generated/prisma";
import { getChatById } from "../../_components/_serveractions/actions";
import AiChat from "./_components/_chat/ai-chat";
// biome-ignore lint/suspicious/noShadowRestrictedNames: Error name
import Error from "./error";
import Loading from "./loading";

export default async function Page(props: {
	params: Promise<{ id: Chat["id"] }>;
}) {
	const { id } = await props.params;
	const chat = getChatById(id);

	return (
		<ErrorBoundary fallback={<Error />}>
			<Suspense fallback={<Loading />}>
				<AiChat id={id} chat={chat} />
			</Suspense>
		</ErrorBoundary>
	);
}
