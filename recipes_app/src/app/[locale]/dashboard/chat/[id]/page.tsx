"use server";

import type { Chat } from "@/generated/prisma";
import { getChatById } from "../../_components/_serveractions/actions";
import AiChat from "./_components/_chat/ai-chat";

export default async function Page(props: {
	params: Promise<{ id: Chat["id"] }>;
}) {
	const { id } = await props.params;
	const { chat, error } = await getChatById(id);

	let initialMessages = [];

	if (typeof chat?.messages === "string") {
		try {
			initialMessages = JSON.parse(chat.messages);
		} catch (e) {
			console.error("Échec du parsing des messages :", e);
		}
	}

	return <AiChat id={id} initialMessages={initialMessages} />;
}
