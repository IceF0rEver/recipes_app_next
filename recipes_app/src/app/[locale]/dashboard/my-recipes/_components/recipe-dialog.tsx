"use client";

import { useRouter } from "next/navigation";
import { Button } from "@/components/ui/button";
import {
	Dialog,
	DialogContent,
	DialogDescription,
	DialogHeader,
	DialogTitle,
} from "@/components/ui/dialog";
import type { Recipe } from "@/generated/prisma";
import { useI18n } from "@/locales/client";

interface RecipeDialogProps {
	recipe: Recipe;
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
						<div>
							<h3 className="text-lg font-semibold mb-2">
								{t("components.myRecipes.tip")}
							</h3>
							<p className="text-sm">{recipe.tip}</p>
						</div>
					)}
					<Button
						type="button"
						onClick={() => router.push(`/dashboard/chat/${recipe.chatId}`)}
					>
						{t("button.update")}
					</Button>
				</div>
			</DialogContent>
		</Dialog>
	);
}
