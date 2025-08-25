"use server";

import { generateId } from "ai";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { type Chat, Prisma } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

export async function getActiveChat(): Promise<{
	chat?: Chat | null;
}> {
	try {
		const currentUser = await getUser();

		const validatedData = z
			.object({
				userId: z.string().min(1),
			})
			.safeParse({
				userId: currentUser?.id,
			});
		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const activeChat = await prisma.chat.findFirst({
			where: {
				isActive: true,
				userId: currentUser?.id,
			},
		});

		return { chat: activeChat ?? null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("400 - BAD_REQUEST");
		}
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

export async function setActiveChat(): Promise<{
	id?: string;
}> {
	try {
		const currentUser = await getUser();

		const validatedData = z
			.object({
				userId: z.string().min(1),
			})
			.safeParse({
				userId: currentUser?.id,
			});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		if (currentUser?.id) {
			const id = generateId();
			const activeChat = await prisma.chat.create({
				data: {
					id: id,
					userId: currentUser.id,
					isActive: true,
				},
			});

			if (!activeChat) {
				throw new Error("500 - INTERNAL_SERVER_ERROR");
			}

			return { id: id };
		}

		throw new Error("400 - BAD_REQUEST");
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("400 - BAD_REQUEST");
		}
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

export async function getChatById(chatId: Chat["id"]): Promise<{
	chat?: Chat | null;
}> {
	try {
		const currentUser = await getUser();

		const validatedData = z
			.object({
				chatId: z.string().min(1),
				userId: z.string().min(1),
			})
			.safeParse({
				chatId: chatId,
				userId: currentUser?.id,
			});
		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const activeChat = await prisma.chat.findFirst({
			where: {
				id: chatId,
				userId: currentUser?.id,
			},
		});

		return { chat: activeChat ?? null };
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("400 - BAD_REQUEST");
		}
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

export interface ChatState {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
	message?: string;
}

export async function resetActiveChat(
	_prevState: ChatState,
	chatId: Chat["id"],
): Promise<ChatState> {
	try {
		const currentUser = await getUser();

		const validatedData = z
			.object({
				chatId: z.string().min(1),
				userId: z.string().min(1),
			})
			.safeParse({
				chatId: chatId,
				userId: currentUser?.id,
			});

		if (!validatedData.success) {
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}
		const { userId } = validatedData.data;

		const result = await prisma.chat.update({
			data: {
				messages: null,
				metadata: Prisma.DbNull,
			},
			where: {
				id: chatId,
				userId: userId,
				isActive: true,
			},
		});
		revalidatePath("[locale]/dashboard/chat/[[...id]]", "page");
		if (result) {
			return {
				success: true,
			};
		}

		return {
			success: false,
			error: {
				code: "UNEXPECTED_ERROR",
				status: 500,
			},
		};
	} catch (error) {
		console.warn(error);

		if (error instanceof APIError) {
			return {
				success: false,
				error: {
					code: "API_ERROR",
					status: 502,
				},
			};
		}
		return {
			success: false,
			error: {
				code: "UNEXPECTED_ERROR",
				status: 500,
			},
		};
	}
}
