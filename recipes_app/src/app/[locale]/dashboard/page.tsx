"use server";

import { redirect } from "next/navigation";
import {
	getActiveChat,
	setActiveChat,
} from "./_components/_serveractions/actions";

export default async function Page() {
	const { chat, error } = await getActiveChat();
	if (chat === null) {
		const { id, status, error } = await setActiveChat();
		redirect(`/dashboard/chat/${id}`);
	} else {
		redirect(`/dashboard/chat/${chat?.id}`);
	}
}
