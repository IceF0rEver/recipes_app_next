import { mistral } from "@ai-sdk/mistral";
import { streamObject } from "ai";
import { getActiveChat } from "@/app/[locale]/dashboard/chat/[[...id]]/_components/_serveractions/actions";
import { recipeSchema } from "@/lib/zod/recipe-schemas";
import { getCurrentLocale } from "@/locales/server";

export const maxDuration = 30;

export async function POST(req: Request) {
	const {
		chatId,
	}: {
		chatId: string;
	} = await req.json();

	const { chat } = await getActiveChat();
	const locale = await getCurrentLocale();

	const messages = JSON.parse(chat?.messages as string) ?? [];

	const lastAssistantMessage = [...messages]
		.reverse()
		.find(
			(m) =>
				m.role === "assistant" &&
				m.parts?.some(
					(p: { text: string; type: string }) =>
						p.type === "text" &&
						(p.text.startsWith("**Intitulé**") ||
							p.text.startsWith("**Title**")),
				),
		);

	const lastRecipeText =
		lastAssistantMessage?.parts?.find(
			(p: { text: string; type: string }) => p.type === "text",
		)?.text ?? "";

	const result = streamObject({
		model: mistral("ministral-3b-latest"),
		schema: recipeSchema,
		output: "array",
		system:
			`You will reply in ${locale === "fr" ? "French" : "English"} only.` +
			`Strictly follow the schema below (respect key names, use camelCase, no extra fields, no spaces in keys):` +
			`{
				title: string, // catchy recipe title
				description: string, // appetizing description in 2-3 sentences
				preparationTime: string, // format 'X' only
				cookingTime: string, // format 'X' only
				serving: string, // number of servings (e.g., "4")
				difficulty: "EASY" | "STANDARD" | "DIFFICULT",
				ingredients: [{ "quantity": string, "unit": string, "name": string }],
				instructions: [{ "step": number, "instruction": string }],
				tip?: string // optional practical tip
				}`,
		prompt: `Convert the following recipe into a structured JSON object:\n${lastRecipeText}`,
	});
	return result.toTextStreamResponse();
}
