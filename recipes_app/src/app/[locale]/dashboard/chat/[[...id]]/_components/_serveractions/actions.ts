"use server";

import { generateId } from "ai";
import { z } from "zod";
import type { Chat, Prisma } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

export async function getActiveChat(): Promise<{
	chat?: Chat | null;
	error?: { message?: string; status?: number };
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
			return {
				error: { message: "Utilisateur non authentifié.", status: 401 },
			};
		}

		const activeChat = await prisma.chat.findFirst({
			where: {
				isActive: true,
				userId: currentUser?.id,
			},
		});

		return { chat: activeChat ?? null };
	} catch {
		return {
			error: { message: "Erreur interne du serveur.", status: 500 },
		};
	}
}

export async function setActiveChat(): Promise<{
	id?: string;
	status?: number;
	error?: { message?: string; status?: number };
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
			return {
				error: { message: "Utilisateur non authentifié.", status: 401 },
			};
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
				return {
					error: { message: "Impossible de créer le chat actif.", status: 500 },
				};
			}

			return { id: id, status: 201 };
		}

		return {
			error: { message: "Utilisateur non authentifié.", status: 401 },
		};
	} catch {
		return {
			error: { message: "Erreur interne du serveur.", status: 500 },
		};
	}
}

export async function getChatById(chatId: Chat["id"]): Promise<{
	chat?: Chat | null;
	error?: { message?: string; status?: number };
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
			return {
				error: { message: "Utilisateur non authentifié.", status: 401 },
			};
		}

		const activeChat = await prisma.chat.findFirst({
			where: {
				id: chatId,
				userId: currentUser?.id,
			},
		});

		return { chat: activeChat ?? null };
	} catch {
		return {
			error: { message: "Erreur interne du serveur.", status: 500 },
		};
	}
}

export async function updateMessagesChatById(
	chatId: Chat["id"],
	messages: Chat["messages"],
): Promise<{
	status?: number;
	error?: { message?: string; status?: number };
}> {
	try {
		const currentUser = await getUser();
		const validatedData = z
			.object({
				chatId: z.string().min(1),
				messages: z.any(),
				userId: z.string().min(1),
			})
			.safeParse({
				chatId: chatId,
				messages: messages,
				userId: currentUser?.id,
			});
		if (!validatedData.success) {
			return {
				error: { message: "Utilisateur non authentifié.", status: 401 },
			};
		}

		await prisma.chat.update({
			data: {
				messages: messages as Prisma.InputJsonValue,
			},
			where: {
				id: chatId,
				userId: currentUser?.id,
			},
		});

		return { status: 200 };
	} catch {
		return {
			error: { message: "Erreur interne du serveur.", status: 500 },
		};
	}
}
