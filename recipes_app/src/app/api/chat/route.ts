import { mistral } from "@ai-sdk/mistral";
import {
	convertToModelMessages,
	createIdGenerator,
	generateObject,
	streamText,
	type UIMessage,
} from "ai";
import z from "zod";
import type { Chat, Prisma } from "@/generated/prisma";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { recipeSchema } from "@/lib/zod/recipe-schemas";
import { getCurrentLocale, getI18n } from "@/locales/server";

export const maxDuration = 30;

async function updateChatById(
	chatId: Chat["id"],
	messages: Chat["messages"],
	metadata: Chat["metadata"],
): Promise<{
	status?: number;
}> {
	"use server";
	try {
		const currentUser = await getUser();
		const validatedData = z
			.object({
				chatId: z.string().min(1),
				messages: z.string(),
				userId: z.string().min(1),
				metadata: recipeSchema,
			})
			.safeParse({
				chatId: chatId,
				messages: messages,
				userId: currentUser?.id,
				metadata: metadata,
			});
		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		await prisma.chat.update({
			data: {
				messages: messages,
				metadata: metadata as Prisma.InputJsonValue,
			},
			where: {
				id: chatId,
				userId: currentUser?.id,
			},
		});

		return { status: 200 };
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

export async function POST(req: Request) {
	"use server";
	const { messages, id }: { messages: UIMessage[]; id: string } =
		await req.json();

	const locale = await getCurrentLocale();
	const t = await getI18n();

	const result = streamText({
		model: mistral("ministral-3b-latest"),
		system:
			`You will reply in ${locale === "fr" ? "French" : "English"} only.` +
			"You are an expert and creative culinary assistant specializing in creating cooking recipes. You respond only to questions related to cooking, recipes, culinary techniques, and food advice. " +
			"If the user asks a question that is not related to cooking, politely inform them that you can only assist with culinary questions and suggest they ask a cooking-related question instead. " +
			"Before providing a recipe, always rephrase the user's request to confirm your understanding, then propose the recipe. " +
			"**Mandatory structure for each recipe:** " +
			`1. **${t("components.recipe.title")}**: A catchy and descriptive name. ` +
			`2. **${t("components.recipe.description")}**: A brief, appetizing description (2-3 sentences). ` +
			`3. **${t("components.recipe.preparationTime")}**: Always in the format "X min" (never "X minutes" or other variations). ` +
			`4. **${t("components.recipe.cookingTime")}**: Always in the format "X min". ` +
			`5. **${t("components.recipe.serving")}**: Exact number of people served. ` +
			`6. **${t("components.recipe.difficulty")}**: Easy, Standard, or Difficult only. ` +
			`7. **${t("components.recipe.ingredientsList")}**: Format as "quantity + unit + ingredient name" (e.g., "200g flour", "2 tablespoons olive oil"). Always use metric units (grams, ml, etc.) and be precise with quantities. ` +
			`8. **${t("components.recipe.instructions")}**: Detailed instructions suitable for beginners but concise, clearly numbered. ` +
			`9. **${t("components.recipe.tips")}**: At least one practical tip to successfully prepare the recipe. ` +
			"**Important constraints:**" +
			"- Use only ingredients easily found in supermarkets. " +
			"- Provide realistic and achievable recipes, never vague or fanciful. " +
			"- If common allergens are used (nuts, dairy, gluten), mention them clearly. " +
			"- Be precise with quantities and cooking times. " +
			"- Adapt the complexity level according to the user's request. " +
			"Always end with an encouraging sentence and offer your help for other culinary questions. ",
		messages: convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse({
		originalMessages: messages,
		generateMessageId: createIdGenerator({
			prefix: "msg",
			size: 16,
		}),
		onFinish: async ({ messages }) => {
			const content = JSON.stringify(messages, null, 2);
			const { object } = await generateObject({
				model: mistral("ministral-3b-latest"),
				schema: recipeSchema,
				system:
					`You will reply in ${locale === "fr" ? "French" : "English"} only.` +
					"Strictly follow the schema below (respect key names, use camelCase, no extra fields, no spaces in keys)" +
					`{
					title: string, // catchy recipe title
					description: string, // appetizing description in 2-3 sentences
					preparationTime: string, // format 'X' only
					cookingTime: string, // format 'X' only
					serving: string, // number of servings (e.g., "4")
					difficulty: "EASY" | "STANDARD" | "DIFFICULT",
					ingredients: [{ "quantity": string (e.g., "400" | ""), "unit": string (e.g., "g" | "ml" | ""), "name": string (e.g., "pasta" | "") }],
					instructions: [{ "step": number, "instruction": string }],
					tip?: string // optional practical tip
					}`,
				prompt: `Convert the following recipe into a structured JSON object:\n${content}`,
			});
			await updateChatById(id, content, object);
		},
	});
}
