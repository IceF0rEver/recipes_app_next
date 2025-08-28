"use client";

import { PDFDownloadLink } from "@react-pdf/renderer";
import { Clock, Download, Heart, TrashIcon, Users } from "lucide-react";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Chat, Recipe } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import RecipePdf from "./_pdf/recipe-pdf";
import RecipeDialog from "./recipe-dialog";

interface RecipeCardProps {
	recipe: Recipe & {
		chat: Chat | null;
	};
	onToggleFavorite: (
		id: Recipe["id"],
		isFavorite: Recipe["isFavorite"],
	) => void;
	onDelete: (id: Recipe["id"]) => void;
}

const getDifficultyColor = (difficulty: Recipe["difficulty"]) => {
	switch (difficulty) {
		case "EASY":
			return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
		case "STANDARD":
			return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
		case "DIFFICULT":
			return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
		default:
			return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
	}
};

export default function RecipeCard({
	recipe,
	onToggleFavorite,
	onDelete,
}: RecipeCardProps) {
	const t = useI18n();
	const [dialogOpen, setDialogOpen] = useState<boolean>(false);

	return (
		<>
			<RecipeDialog
				recipe={recipe}
				dialogOpen={dialogOpen}
				onDialogOpen={setDialogOpen}
			/>
			<Card
				className="relative group hover:shadow-lg transition-shadow duration-200 flex-shrink-0 w-80"
				onClick={() => setDialogOpen(true)}
			>
				<Button
					type="button"
					variant="ghost"
					className="absolute top-0 right-0 rounded-br-none rounded-tl-none rounded-tr-lg rounded-bl-lg"
					onClick={() => onDelete(recipe.id)}
				>
					<TrashIcon className="size-4" />
				</Button>
				<CardHeader className="pb-3">
					<CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{recipe.description}
					</p>
				</CardHeader>
				<CardContent className="relative">
					<div className="absolute bottom-2 right-2 flex gap-2 z-10">
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
								className="bg-white/80 hover:bg-white cursor-pointer"
								onClick={(e) => e.stopPropagation()}
							>
								<Download className="h-4 w-4 text-gray-600" />
							</Button>
						</PDFDownloadLink>
						<Button
							type="button"
							variant="default"
							size="icon"
							className="bg-white/80 hover:bg-white cursor-pointer"
							onClick={(e) => {
								e.stopPropagation();
								onToggleFavorite(recipe.id, recipe.isFavorite);
							}}
						>
							<Heart
								className={cn(
									"h-4 w-4 text-red-500",
									recipe.isFavorite ? "fill-current" : "hover:fill-current",
								)}
							/>
						</Button>
					</div>
					<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
						<div className="flex items-center gap-1">
							<Clock className="h-4 w-4" />
							<span>{recipe.cookingTime}min</span>
						</div>
						<div className="flex items-center gap-1">
							<Users className="h-4 w-4" />
							<span>{recipe.serving}</span>
						</div>
					</div>
					<div className="flex items-center justify-between">
						<Badge className={getDifficultyColor(recipe.difficulty)}>
							{t(`components.myRecipes.difficulty.${recipe.difficulty}`)}
						</Badge>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
