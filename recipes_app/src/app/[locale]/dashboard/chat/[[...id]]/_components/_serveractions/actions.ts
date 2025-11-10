"use server";

import { randomUUID } from "node:crypto";
import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { type Chat, Prisma } from "@/generated/prisma";
import { auth } from "@/lib/auth/auth";
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
		const result = await prisma.chat.update({
			data: {
				messages: null,
				metadata: Prisma.DbNull,
			},
			where: {
				id: id,
				userId: userId,
				isActive: true,
			},
		});
		revalidatePath("[locale]/dashboard/chat/[[...id]]");
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

export async function archiveActiveChat(
	_prevState: ChatState,
	chatId: Chat["id"],
): Promise<ChatState> {
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
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}

		const { userId, id } = validatedData.data;
		const [subscriptions, recipesUserCount] = await Promise.all([
			auth.api.listActiveSubscriptions({
				query: {
					referenceId: userId,
				},
				headers: await headers(),
			}),
			prisma.recipe.count({
				where: {
					userId: userId,
				},
			}),
		]);
		const recipesLimit =
			subscriptions.find((sub) => sub.status === "active")?.limits?.recipes ||
			3;

		if (recipesUserCount >= recipesLimit) {
			return {
				success: false,
				error: {
					code:
						recipesLimit > 3 ? "LIMIT_REACHED_PREMIUM" : "LIMIT_REACHED_BASIC",
					status: 403,
				},
			};
		}

		const { chat } = await getChatById(id);
		if (!chat) {
			return {
				success: false,
				error: { code: "NOT_FOUND", status: 404 },
			};
		}

		if (chat?.isActive && chat?.metadata) {
			const chatMetadataSchema = chatSchemas().chatTableSchema.pick({
				metadata: true,
			});

			const { metadata } = chatMetadataSchema.parse({
				metadata: chat.metadata,
			});
			const recipeId = randomUUID();

			const createRecipe = await prisma.recipe.create({
				data: {
					id: recipeId,
					userId: userId,
					title: metadata.title,
					description: metadata.description,
					serving: metadata.serving,
					image: "",
					preparationTime: metadata.preparationTime,
					cookingTime: metadata.cookingTime,
					ingredients: metadata.ingredients,
					instructions: metadata.instructions,
					difficulty: metadata.difficulty,
					tip: metadata.tip ?? null,
				},
			});

			const [createChat, resetChat] = await Promise.all([
				prisma.chat.create({
					data: {
						userId: userId,
						title: metadata.title,
						messages: chat.messages,
						metadata: chat.metadata,
						recipeId: recipeId,
					},
				}),
				prisma.chat.update({
					data: {
						messages: null,
						metadata: Prisma.DbNull,
					},
					where: {
						id: id,
						userId: userId,
						isActive: true,
					},
				}),
			]);
			revalidatePath("[locale]/dashboard/chat/[[...id]]");
			if (createChat && createRecipe && resetChat) {
				return {
					success: true,
				};
			}
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

export async function updateArchiveChat(
	_prevState: ChatState,
	chatId: Chat["id"],
): Promise<ChatState> {
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
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}

		const { userId, id } = validatedData.data;

		const { chat } = await getChatById(id);
		if (!chat) {
			return {
				success: false,
				error: { code: "NOT_FOUND", status: 404 },
			};
		}

		if (!chat?.isActive && chat?.metadata) {
			const chatMetadataSchema = chatSchemas().chatTableSchema.pick({
				metadata: true,
				recipeId: true,
			});

			const { metadata, recipeId } = chatMetadataSchema.parse({
				metadata: chat.metadata,
				recipeId: chat.recipeId,
			});

			const result = await prisma.recipe.update({
				data: {
					title: metadata.title,
					description: metadata.description,
					serving: metadata.serving,
					image: "",
					preparationTime: metadata.preparationTime,
					cookingTime: metadata.cookingTime,
					ingredients: metadata.ingredients,
					instructions: metadata.instructions,
					difficulty: metadata.difficulty,
					tip: metadata.tip ?? null,
				},
				where: {
					userId: userId,
					id: recipeId ?? "",
				},
			});

			if (result) {
				revalidatePath("[locale]/dashboard/chat/[[...id]]", "page");
				revalidatePath("[locale]/dashboard/my-recipes", "page");
				return {
					success: true,
				};
			}
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
