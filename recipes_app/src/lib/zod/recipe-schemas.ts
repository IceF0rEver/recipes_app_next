import { z } from "zod";

export const recipeSchema = z.object({
	title: z.string().describe("title: string, // catchy recipe title"),
	description: z
		.string()
		.describe(
			"description: string, // appetizing description in 2-3 sentences",
		),
	preparationTime: z
		.string()
		.describe("preparationTime: string, // format 'X' only"),
	cookingTime: z.string().describe("cookingTime: string, // format 'X' only"),
	serving: z
		.string()
		.describe('serving: string, // number of servings (e.g., "4")'),
	difficulty: z
		.enum(["EASY", "STANDARD", "DIFFICULT"])
		.describe('difficulty: "EASY" | "STANDARD" | "DIFFICULT"'),
	ingredients: z
		.array(
			z.object({
				quantity: z.string().describe('"quantity": string,'),
				unit: z.string().describe('"unit": string,'),
				name: z.string().describe('"name": string,'),
			}),
		)
		.describe(
			'ingredients: [{ "quantity": string, "unit": string, "name": string }],',
		),
	instructions: z
		.array(
			z.object({
				step: z.number().describe('"step": number,'),
				instruction: z.string().describe('"instruction": string,'),
			}),
		)
		.describe('instructions: [{ "step": number, "instruction": string }],'),
	tip: z.string().optional().describe("tip?: string // optional practical tip"),
});
