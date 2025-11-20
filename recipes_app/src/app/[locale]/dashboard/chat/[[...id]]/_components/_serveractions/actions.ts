"use server";

import { randomUUID } from "node:crypto";
import { z } from "zod";
import type { Chat } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { chatSchemas } from "@/lib/zod/chat-schemas";

export async function getActiveChat(): Promise<{
	chat?: Chat | null;
}> {
	try {
		const user = await getUser();

		const chatSchema = chatSchemas().chatTableSchema.pick({
			userId: true,
		});
		const validatedData = chatSchema.safeParse({ userId: user?.id });

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { userId } = validatedData.data;
		const activeChat = await prisma.chat.findFirst({
			where: {
				isActive: true,
				userId: userId,
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
		const user = await getUser();

		const chatSchema = chatSchemas().chatTableSchema.pick({
			userId: true,
		});
		const validatedData = chatSchema.safeParse({ userId: user?.id });

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { userId } = validatedData.data;
		if (userId) {
			const id = randomUUID();
			const activeChat = await prisma.chat.create({
				data: {
					id: id,
					userId: userId,
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
		const user = await getUser();

		const chatSchema = chatSchemas().chatTableSchema.pick({
			userId: true,
			id: true,
		});
		const validatedData = chatSchema.safeParse({
			userId: user?.id,
			id: chatId,
		});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { userId, id } = validatedData.data;
		const activeChat = await prisma.chat.findFirst({
			where: {
				id: id,
				userId: userId,
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
