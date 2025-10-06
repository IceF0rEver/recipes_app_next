import { z } from "zod";
import type { useI18n } from "@/locales/client";
import { recipeSchemas } from "./recipe-schemas";

const { recipeBaseSchema } = recipeSchemas();

export const chatSchemas = (_t?: ReturnType<typeof useI18n>) => {
	const chatBaseSchema = z.object({
		title: z.string().nullable().optional(),
		messages: z.string().nullable().optional(),
		metadata: recipeBaseSchema,
	});

	const chatTableSchema = chatBaseSchema.extend({
		id: z.string().uuid(),
		userId: z.string().uuid(),
		isActive: z.boolean().default(false),
		recipeId: z.string().uuid().nullable().optional(),
	});

	return {
		chatTableSchema,
		chatBaseSchema,
	};
};
