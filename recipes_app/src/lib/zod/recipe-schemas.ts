import { z } from "zod";

export const recipeSchemas = () => {
	const recipeBaseSchema = z.object({
		title: z.string(),
		description: z.string(),
		preparationTime: z.string(),
		cookingTime: z.string(),
		serving: z.string(),
		difficulty: z.enum(["EASY", "STANDARD", "DIFFICULT"]),
		ingredients: z.array(
			z.object({
				quantity: z.string(),
				unit: z.string(),
				name: z.string(),
			}),
		),
		instructions: z.array(
			z.object({
				step: z.number(),
				instruction: z.string(),
			}),
		),
		tip: z.string().optional(),
	});

	const recipeTableSchema = recipeBaseSchema.extend({
		id: z.string().uuid(),
		userId: z.string().uuid(),
		chat: z.string().uuid().nullable().optional(),
		image: z.string(),
		isFavorite: z.boolean().default(false),
	});

	return {
		recipeBaseSchema,
		recipeTableSchema,
	};
};
