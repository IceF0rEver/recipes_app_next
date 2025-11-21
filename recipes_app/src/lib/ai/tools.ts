import { randomUUID } from "node:crypto";
import { mistral } from "@ai-sdk/mistral";
import { generateObject, tool } from "ai";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import z from "zod";
import { getChatById } from "@/app/[locale]/dashboard/chat/[[...id]]/_components/_serveractions/actions";
import { Prisma } from "@/generated/prisma";
import { getCurrentLocale } from "@/locales/server";
import { auth } from "../auth/auth";
import { getUser } from "../auth/server";
import prisma from "../prisma";
import { recipeSchemas } from "../zod/recipe-schemas";

const { recipeBaseSchema } = recipeSchemas();

const outputSchema = z.object({
	success: z.boolean(),
	error: z
		.object({
			code: z.string(),
			status: z.number(),
		})
		.optional(),
});

const getCurrentChatId = tool({
	description: "Récupère d'id du chat actuel.",
	inputSchema: z.object({}),
	outputSchema: z.object({
		chatId: z.string().uuid(),
	}),
});

const getCurrentUserId = tool({
	description: "Récupère d'id de l'utilisateur connecté.",
	inputSchema: z.object({}),
	outputSchema: z.string().uuid(),
	execute: async () => {
		const userId = await getUser();
		if (userId) {
			return userId.id;
		}
	},
});

const createRecipeByMessages = tool({
	description:
		"Crée une recette sur de l'entièreté de messages du chat actuel.",
	inputSchema: z.object({
		message: z.string(),
	}),
	outputSchema: recipeBaseSchema,
	execute: async ({ message }) => {
		"use server";
		const locale = await getCurrentLocale();

		const { object } = await generateObject({
			model: mistral("mistral-small-latest"),
			schema: recipeBaseSchema,
			system:
				`You will reply in ${locale === "fr" ? "French" : "English"} only.` +
				"Convert the following recipe into a structured JSON object.",
			prompt: JSON.stringify(message),
		});

		return object;
	},
});

const setActiveChatInMyRecipes = tool({
	description:
		"Archive le chat actif et la recette associé dans mes recettes tout en réinitialisant son contenu.",
	inputSchema: z.object({
		userId: z
			.string()
			.uuid()
			.describe("Id from tool-getCurrentUserId, should be reused every time"),
		chatId: z
			.string()
			.uuid()
			.describe("Id from tool-getCurrentChatId, should be reused every time"),
		recipe: recipeBaseSchema.describe(
			"Recipe from tool-createRecipeByMessages",
		),
	}),
	outputSchema: outputSchema,
	execute: async ({ userId, chatId, recipe }) => {
		"use server";

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

		const { chat } = await getChatById(chatId);
		if (!chat) {
			return {
				success: false,
				error: { code: "NOT_FOUND", status: 404 },
			};
		}

		if (chat?.isActive) {
			const recipeId = randomUUID();

			const createRecipe = await prisma.recipe.create({
				data: {
					id: recipeId,
					userId: userId,
					title: recipe.title,
					description: recipe.description,
					serving: recipe.serving,
					image: "",
					preparationTime: recipe.preparationTime,
					cookingTime: recipe.cookingTime,
					ingredients: recipe.ingredients,
					instructions: recipe.instructions,
					difficulty: recipe.difficulty,
					tip: recipe.tip ?? null,
				},
			});

			const [createChat, resetChat] = await Promise.all([
				prisma.chat.create({
					data: {
						userId: userId,
						title: recipe.title,
						messages: JSON.parse(JSON.stringify(chat.messages, null, 2)),
						metadata: JSON.parse(JSON.stringify(recipe, null, 2)),
						recipeId: recipeId,
					},
				}),
				prisma.chat.update({
					data: {
						messages: Prisma.DbNull,
						metadata: Prisma.DbNull,
					},
					where: {
						id: chatId,
						userId: userId,
						isActive: true,
					},
				}),
			]);

			if (createChat && createRecipe && resetChat) {
				revalidatePath("[locale]/dashboard/chat/[[...id]]");
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
	},
});

const updateAnArchiveChat = tool({
	description:
		"Met à jour un chat archivé et la recette associé à celui-ci à partir de son id.",
	inputSchema: z.object({
		recipe: recipeBaseSchema.describe(
			"Recipe from tool-createRecipeByMessages",
		),
		userId: z
			.string()
			.uuid()
			.describe("Id from tool-getCurrentUserId, should be reused every time"),
		chatId: z
			.string()
			.uuid()
			.describe("Id from tool-getCurrentChatId, should be reused every time"),
	}),
	outputSchema: outputSchema,
	execute: async ({ userId, chatId, recipe }) => {
		"use server";
		const { chat } = await getChatById(chatId);
		if (!chat) {
			return {
				success: false,
				error: { code: "NOT_FOUND", status: 404 },
			};
		}

		if (!chat?.isActive) {
			const result = await prisma.recipe.update({
				data: {
					title: recipe.title,
					description: recipe.description,
					serving: recipe.serving,
					image: "",
					preparationTime: recipe.preparationTime,
					cookingTime: recipe.cookingTime,
					ingredients: recipe.ingredients,
					instructions: recipe.instructions,
					difficulty: recipe.difficulty,
					tip: recipe.tip ?? null,
				},
				where: {
					userId: userId,
					id: chat.recipeId ?? "",
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
	},
});

export const tools = {
	getCurrentUserId,
	getCurrentChatId,
	createRecipeByMessages,
	setActiveChatInMyRecipes,
	updateAnArchiveChat,
};
