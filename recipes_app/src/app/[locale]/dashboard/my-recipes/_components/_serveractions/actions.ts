"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import type { Chat, Recipe } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { recipeSchemas } from "@/lib/zod/recipe-schemas";

type RecipeWithChat = Recipe & {
	chat: Chat | null;
};

export async function getRecipesListWithChat(): Promise<{
	recipesWithChat: RecipeWithChat[];
}> {
	try {
		const user = await getUser();

		const recipeSchema = recipeSchemas().recipeTableSchema.pick({
			userId: true,
		});
		const validatedData = recipeSchema.safeParse({ userId: user?.id });

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { userId } = validatedData.data;
		const recipesWithChat = await prisma.recipe.findMany({
			where: {
				userId: userId,
			},
			include: {
				chat: true,
			},
		});

		return { recipesWithChat: recipesWithChat ?? [] };
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

interface RecipeState {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
	message?: string;
}

export async function setFavoriteRecipe(
	_prevState: RecipeState,
	formData: FormData,
): Promise<RecipeState> {
	try {
		const user = await getUser();

		const recipeSchema = recipeSchemas().recipeTableSchema.pick({
			userId: true,
			id: true,
			isFavorite: true,
		});
		const parsedData = JSON.parse(formData.get("favoriteRecipeData") as string);
		const validatedData = recipeSchema.safeParse({
			...parsedData,
			userId: user?.id,
		});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { id, isFavorite, userId } = validatedData.data;
		const result = await prisma.recipe.update({
			data: {
				isFavorite: isFavorite,
			},
			where: {
				id: id,
				userId: userId,
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
	formData: FormData,
): Promise<RecipeState> {
	try {
		const user = await getUser();

		const recipeSchema = recipeSchemas().recipeTableSchema.pick({
			userId: true,
			id: true,
		});
		const parsedData = JSON.parse(formData.get("deleteRecipeData") as string);
		const validatedData = recipeSchema.safeParse({
			...parsedData,
			userId: user?.id,
		});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { userId, id } = validatedData.data;
		const result = await prisma.recipe.delete({
			where: {
				id: id,
				userId: userId,
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
