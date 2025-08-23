import { mistral } from "@ai-sdk/mistral";
import {
	convertToModelMessages,
	createIdGenerator,
	streamText,
	type UIMessage,
} from "ai";
import { updateMessagesChatById } from "@/app/[locale]/dashboard/chat/[[...id]]/_components/_serveractions/actions";
import { getCurrentLocale, getI18n } from "@/locales/server";

export const maxDuration = 30;

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
			await updateMessagesChatById(id, content);
		},
	});
}
