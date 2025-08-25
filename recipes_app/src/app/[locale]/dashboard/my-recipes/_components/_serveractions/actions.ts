"use server";

import { revalidatePath } from "next/cache";
import z from "zod";
import type { Recipe } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";

export async function getRecipesList(): Promise<{
	recipes: Recipe[];
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

		const recipes = await prisma.recipe.findMany({
			where: {
				userId: currentUser?.id,
			},
		});
		return { recipes: recipes ?? [] };
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

export async function setFavorite(
	_prevState: RecipeState,
	{
		chatId,
		isFavorite,
	}: { chatId: Recipe["id"]; isFavorite: Recipe["isFavorite"] },
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
				chatId: chatId,
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
				id: chatId,
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
