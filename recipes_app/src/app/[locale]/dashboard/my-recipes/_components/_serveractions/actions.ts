"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import type { Chat, Recipe } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

type RecipeWithChat = Recipe & {
	chat: Chat | null;
};

export async function getRecipesListWithChat(): Promise<{
	recipesWithChat: RecipeWithChat[];
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

		const recipesWithChat = await prisma.recipe.findMany({
			where: {
				userId: currentUser?.id,
			},
			include: {
				chat: true,
			},
		});
		return { recipesWithChat: recipesWithChat ?? [] };
	} catch (error) {
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

interface RecipeState {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
	message?: string;
}

export async function setFavoriteRecipe(
	_prevState: RecipeState,
	{
		recipeId,
		isFavorite,
	}: { recipeId: Recipe["id"]; isFavorite: Recipe["isFavorite"] },
): Promise<RecipeState> {
	try {
		const currentUser = await getUser();

		const validatedData = z
			.object({
				userId: z.string().min(1),
				chatId: z.string().min(1),
				isFavorite: z.boolean(),
			})
			.safeParse({
				userId: currentUser?.id,
				chatId: recipeId,
				isFavorite: isFavorite,
			});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const result = await prisma.recipe.update({
			data: {
				isFavorite: isFavorite,
			},
			where: {
				id: recipeId,
				userId: currentUser?.id,
			},
		});

		if (result) {
			revalidatePath("[locale]/dashboard/my-recipes", "page");
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
		if (error instanceof z.ZodError) {
			throw new Error("400 - BAD_REQUEST");
		}
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

export async function deleteRecipeById(
	_prevState: RecipeState,
	recipeId: Recipe["id"],
): Promise<RecipeState> {
	try {
		const currentUser = await getUser();

		const validatedData = z
			.object({
				userId: z.string().min(1),
				chatId: z.string().min(1),
			})
			.safeParse({
				userId: currentUser?.id,
				chatId: recipeId,
			});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const result = await prisma.recipe.delete({
			where: {
				id: recipeId,
				userId: currentUser?.id,
			},
		});

		if (result) {
			revalidatePath("[locale]/dashboard/my-recipes", "page");
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
		if (error instanceof z.ZodError) {
			throw new Error("400 - BAD_REQUEST");
		}
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}
