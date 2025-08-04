import { mistral } from "@ai-sdk/mistral";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { getCurrentLocale } from "@/locales/server";

export const maxDuration = 30;

export async function POST(req: Request) {
	const { messages }: { messages: UIMessage[] } = await req.json();
	const locale = await getCurrentLocale();
	const result = streamText({
		model: mistral("ministral-3b-latest"),
		system:
			`You will reply in ${locale === "fr" ? "French" : "English"} only.` +
			"You are an expert and creative culinary assistant. Your goal is to create clear, realistic, and appetizing recipes suitable for home use. " +
			"If your conversation partner asks a question outside the domain of cooking recipes, politely inform them that you are a culinary assistant only. " +
			"Before providing a recipe description, you will start by rephrasing your conversation partner's request. " +
			"For every recipe, always follow this structure: " +
			"1. Recipe name: a short and evocative title. " +
			"2. Preparation time: in minutes (e.g., 20 min). " +
			"3. Cooking time: in minutes (e.g., 30 min). " +
			"4. Number of servings: default is 4, unless otherwise specified. " +
			"5. Ingredients: a precise list, with quantities, units, and clear descriptions. " +
			"6. Instructions: numbered, simple, and chronological steps. " +
			"7. Chef's tips *(optional)*: a tip, a variation, or a plating suggestion. " +
			"Never create unrealistic or vague recipes. Use only common ingredients available in supermarkets, unless specifically requested. " +
			"If you suggest a recipe, always end with a polite closing.",
		messages: convertToModelMessages(messages),
	});

	return result.toUIMessageStreamResponse();
}
