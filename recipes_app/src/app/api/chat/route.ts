import { randomUUID } from "node:crypto";
import { mistral } from "@ai-sdk/mistral";
import {
	convertToModelMessages,
	extractReasoningMiddleware,
	// generateObject,
	streamText,
	wrapLanguageModel,
} from "ai";
import z from "zod";
import type { MyUIMessage } from "@/components/utils/ai/_types/types";
import type { Chat } from "@/generated/prisma";
import { tools } from "@/lib/ai/tools";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { chatSchemas } from "@/lib/zod/chat-schemas";
import { getCurrentLocale, getI18n } from "@/locales/server";

export const maxDuration = 30;

async function updateChatById(
	chatId: Chat["id"],
	messages: Chat["messages"],
): Promise<{
	status?: number;
}> {
	"use server";
	try {
		const user = await getUser();

		const { chatTableSchema } = chatSchemas();
		const chatSchema = chatTableSchema.pick({
			id: true,
			userId: true,
			messages: true,
		});
		const validatedData = chatSchema.safeParse({
			id: chatId,
			messages: messages,
			userId: user?.id,
		});

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}

		const { id, userId, messages: validatedMessages } = validatedData.data;
		if (validatedMessages) {
			await prisma.chat.update({
				data: {
					messages: JSON.parse(validatedMessages) ?? [],
				},
				where: {
					id: id,
					userId: userId,
				},
			});
		}
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
	const {
		messages,
		model,
		chatId,
	}: {
		messages: MyUIMessage[];
		model: string;
		webSearch?: boolean;
		chatId?: string;
	} = await req.json();

	const locale = await getCurrentLocale();
	const t = await getI18n();
	const startTime = performance.now();

	const result = streamText({
		model: wrapLanguageModel({
			model: mistral(model),
			middleware: extractReasoningMiddleware({
				tagName: "think",
			}),
		}),
		messages: convertToModelMessages(messages),
		tools,
		toolChoice: "auto",
		system:
			`You will reply in ${locale === "fr" ? "French" : "English"} only.` +
			"You are an expert and creative culinary assistant specializing in creating cooking recipes. You respond only to questions related to cooking, recipes, culinary techniques, and food advice. " +
			"If the user asks a question that is not related to cooking, politely inform them that you can only assist with culinary questions and suggest they ask a cooking-related question instead. " +
			"Before providing a recipe, always rephrase the user's request to confirm your understanding, then propose the recipe. " +
			"*Mandatory structure for each recipe:* " +
			`*${t("components.recipe.title")}*: A catchy and descriptive name. ` +
			`*${t("components.recipe.description")}*: A brief, appetizing description (2-3 sentences). ` +
			`*${t("components.recipe.preparationTime")}*: Always in the format "X min" (never "X minutes" or other variations). ` +
			`*${t("components.recipe.cookingTime")}*: Always in the format "X min". ` +
			`*${t("components.recipe.serving")}*: Exact number of people served. ` +
			`*${t("components.recipe.difficulty")}*: Easy, Standard, or Difficult only. ` +
			`*${t("components.recipe.ingredientsList")}*: Format as "quantity + unit + ingredient name" (e.g., "200g flour", "2 tablespoons olive oil"). Always use metric units (grams, ml, etc.) and be precise with quantities. ` +
			`*${t("components.recipe.instructions")}*: Detailed instructions suitable for beginners but concise, clearly numbered. ` +
			`*${t("components.recipe.tips")}*: At least one practical tip to successfully prepare the recipe. ` +
			"*Important constraints:*" +
			"Use only ingredients easily found in supermarkets. " +
			"Provide realistic and achievable recipes, never vague or fanciful. " +
			"If common allergens are used (nuts, dairy, gluten), mention them clearly. " +
			"Be precise with quantities and cooking times. " +
			"Adapt the complexity level according to the user's request. " +
			"Always end with an encouraging sentence and offer your help for other culinary questions. " +
			"You have access to tools. " +
			"Use tool-createRecipeByMessages from create a recipe" +
			"Use them in priority when appropriate to provide accurate information. " +
			"If you use a tool, generate a concise sentence summarizing the data returned by the tool.",
	});

	return result.toUIMessageStreamResponse({
		generateMessageId: () => randomUUID(),
		sendSources: true,
		sendReasoning: true,
		originalMessages: messages,
		messageMetadata: ({ part }) => {
			switch (part.type) {
				case "start": {
					const lastUserMessage = [...messages]
						.reverse()
						.find((m) => m.role === "user");
					const branchId = lastUserMessage?.metadata?.branchId ?? randomUUID();
					const parentMessageId = lastUserMessage?.id ?? null;
					const createdAt = Date.now();

					return {
						branchId,
						parentMessageId,
						createdAt,
					};
				}
				case "reasoning-end": {
					const reasoningDuration = Math.ceil(
						(performance.now() - startTime) / 1000,
					);
					return { reasoningDuration };
				}
			}
		},
		onFinish: async ({ messages }) => {
			await updateChatById(chatId ?? "", JSON.stringify(messages, null, 2));
		},
	});
}
