"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Download, Pen } from "lucide-react";
import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Chat, Recipe } from "@/generated/prisma";
import { useI18n } from "@/locales/client";
import RecipePdf from "./_pdf/recipe-pdf";

interface RecipeDialogProps {
	recipe: Recipe & {
		chat: Chat | null;
	};
	dialogOpen: boolean;
	onDialogOpen: (dialogOpen: boolean) => void;
}

type Ingredient = {
	name: string;
	unit: string;
	quantity: string;
};

type Instruction = {
	step: number;
	instruction: string;
};

export default function RecipeDialog({
	recipe,
	dialogOpen,
	onDialogOpen,
}: RecipeDialogProps) {
	const t = useI18n();
	const router = useRouter();
	const ingredients: Ingredient[] = Array.isArray(recipe.ingredients)
		? (recipe.ingredients as Ingredient[])
		: [];

	const instructions: Instruction[] = Array.isArray(recipe.instructions)
		? (recipe.instructions as Instruction[])
		: [];

	return (
		<Dialog open={dialogOpen} onOpenChange={onDialogOpen}>
			<DialogContent className="max-w-2xl overflow-y-auto max-h-[90vh]">
				<DialogHeader>
					<DialogTitle className="text-2xl font-bold">
						{recipe.title}
					</DialogTitle>
					<DialogDescription>{recipe.description}</DialogDescription>
				</DialogHeader>

				<div className="mt-4 space-y-4">
					<div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
						<p>
							<strong>{t("components.myrecipes.serving")}</strong>
							{recipe.serving}
						</p>
						<p>
							<strong>{t("components.myrecipes.preparationTime")}</strong>
							{recipe.preparationTime}min
						</p>
						<p>
							<strong>{t("components.myrecipes.cookingTime")}</strong>
							{recipe.cookingTime}min
						</p>
						<p>
							<strong>{t("components.myRecipes.difficulty.label")}</strong>
							{t(`components.myRecipes.difficulty.${recipe.difficulty}`)}
						</p>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">
							{t("components.myRecipes.ingredients")}
						</h3>
						<ul className="list-disc list-inside space-y-1">
							{ingredients.length > 0 ? (
								ingredients.map((item, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: index for key
									<li className="text-sm" key={index}>
										{item.quantity
											? `${item.quantity} ${item.unit} ${item.name}`
											: item.name}
									</li>
								))
							) : (
								<p>{t("components.myRecipes.nullableIngredients")}</p>
							)}
						</ul>
					</div>

					<div>
						<h3 className="text-lg font-semibold mb-2">
							{t("components.myRecipes.instructions")}
						</h3>
						<ol className="list-decimal list-inside space-y-1">
							{instructions.length > 0 ? (
								instructions.map((step, index) => (
									// biome-ignore lint/suspicious/noArrayIndexKey: index for key
									<li className="text-sm" key={index}>
										{step.instruction ?? JSON.stringify(step)}
									</li>
								))
							) : (
								<p>{t("components.myRecipes.nullableInstructions")}</p>
							)}
						</ol>
					</div>

					{recipe.tip && (
						<>
							<h3 className="text-lg font-semibold mb-2">
								{t("components.myRecipes.tip")}
							</h3>
							<p className="text-sm">{recipe.tip}</p>
						</>
					)}
					<div className="flex gap-2">
						<PDFDownloadLink
							document={
								<RecipePdf
									recipe={recipe}
									labels={{
										serving: t("components.myrecipes.serving"),
										preparationTime: t("components.myrecipes.preparationTime"),
										cookingTime: t("components.myrecipes.cookingTime"),
										difficulty: t("components.myRecipes.difficulty.label"),
										difficultyValues: {
											EASY: t("components.myRecipes.difficulty.EASY"),
											STANDARD: t("components.myRecipes.difficulty.STANDARD"),
											DIFFICULT: t("components.myRecipes.difficulty.DIFFICULT"),
										},
										ingredients: t("components.myRecipes.ingredients"),
										noIngredients: t(
											"components.myRecipes.nullableIngredients",
										),
										instructions: t("components.myRecipes.instructions"),
										noInstructions: t(
											"components.myRecipes.nullableInstructions",
										),
										tip: t("components.myRecipes.tip"),
									}}
								/>
							}
							fileName={`${recipe.title}.pdf`}
						>
							<Button
								type="button"
								variant="default"
								size="icon"
								className=" cursor-pointer"
								onClick={(e) => e.stopPropagation()}
							>
								<Download className="size-4" />
							</Button>
						</PDFDownloadLink>
						<Button
							type="button"
							variant={"outline"}
							onClick={() => router.push(`/dashboard/chat/${recipe.chat?.id}`)}
						>
							<Pen className="size-4" />
						</Button>
					</div>
				</div>
			</DialogContent>
		</Dialog>
	);
}
