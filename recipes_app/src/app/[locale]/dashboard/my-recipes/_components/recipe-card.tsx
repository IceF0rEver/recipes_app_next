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
			return "bg-emerald-50 text-emerald-700 border-emerald-200 dark:bg-emerald-950 dark:text-emerald-300 dark:border-emerald-800";
		case "STANDARD":
			return "bg-amber-50 text-amber-700 border-amber-200 dark:bg-amber-950 dark:text-amber-300 dark:border-amber-800";
		case "DIFFICULT":
			return "bg-rose-50 text-rose-700 border-rose-200 dark:bg-rose-950 dark:text-rose-300 dark:border-rose-800";
		default:
			return "bg-slate-50 text-slate-700 border-slate-200 dark:bg-slate-950 dark:text-slate-300 dark:border-slate-800";
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
				className="relative group hover:shadow-lg transition-shadow duration-200 flex-shrink-0 w-80 gap-0"
				onClick={() => setDialogOpen(true)}
			>
				<Badge
					className={cn(
						"absolute top-3 left-3 z-20 px-3 py-1.5 text-xs font-semibold border shadow-sm",
						getDifficultyColor(recipe.difficulty),
					)}
				>
					{t(`components.myRecipes.difficulty.${recipe.difficulty}`)}
				</Badge>

				<Button
					type="button"
					variant="outline"
					className="absolute top-3 right-3 z-20 h-8 w-8 p-0  hover:text-red-600 backdrop-blur-sm shadow-sm"
					onClick={(e) => {
						e.stopPropagation();
						onDelete(recipe.id);
					}}
				>
					<TrashIcon className="h-4 w-4" />
				</Button>

				<CardHeader className="pb-4 pt-6 relative z-10">
					<div className="flex items-start gap-3">
						<div className="flex-1 min-w-0">
							<CardTitle className="text-xl font-bold line-clamp-2 leading-tight">
								{recipe.title}
							</CardTitle>
							<p className="text-sm  line-clamp-2 mt-1 leading-relaxed">
								{recipe.description}
							</p>
						</div>
					</div>
				</CardHeader>

				<CardContent className="relative z-10 pt-0">
					<div className="flex items-center justify-between mb-4 p-3 bg- rounded-xl backdrop-blur-sm border ">
						<div className="flex items-center gap-1.5 ">
							<Clock className="h-4 w-4 text-blue-500" />
							<span className="text-sm font-medium">
								{recipe.cookingTime}min
							</span>
						</div>
						<div className="flex items-center gap-1.5 ">
							<Users className="h-4 w-4 text-green-500" />
							<span className="text-sm font-medium">{recipe.serving}</span>
						</div>
					</div>

					<div className="flex gap-2 justify-end">
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
								variant="outline"
								size="sm"
								className="bg-white/80 hover:bg-blue-50 hover:border-blue-200 hover:text-blue-700 backdrop-blur-sm border-white/20 shadow-sm transition-all duration-200"
								onClick={(e) => e.stopPropagation()}
							>
								<Download className="h-4 w-4 mr-1.5" />
								PDF
							</Button>
						</PDFDownloadLink>

						<Button
							type="button"
							variant="outline"
							size="sm"
							className={cn(
								" hover:bg-red-50 hover:border-red-200 backdrop-blur-sm border-white/20 shadow-sm transition-all duration-200",
								recipe.isFavorite && "bg-red-50 border-red-200 text-red-700",
							)}
							onClick={(e) => {
								e.stopPropagation();
								onToggleFavorite(recipe.id, recipe.isFavorite);
							}}
						>
							<Heart
								className={cn(
									"h-4 w-4 mr-1.5 text-red-500 transition-all duration-200",
									recipe.isFavorite ? "fill-current" : "hover:fill-current",
								)}
							/>
							{recipe.isFavorite ? t("button.liked") : t("button.like")}
						</Button>
					</div>
				</CardContent>
			</Card>
		</>
	);
}
