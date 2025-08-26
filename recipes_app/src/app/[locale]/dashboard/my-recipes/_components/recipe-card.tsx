"use client";

import { Clock, Download, Heart, Users } from "lucide-react";
import Image from "next/image";
import { useState } from "react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe } from "@/generated/prisma";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";
import RecipeDialog from "./recipe-dialog";

interface RecipeCardProps {
	recipe: Recipe;
	onToggleFavorite: (
		id: Recipe["id"],
		isFavorite: Recipe["isFavorite"],
	) => void;
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
			<Card className="group hover:shadow-lg transition-shadow duration-200 flex-shrink-0 w-80 py-0 pb-6">
				<div className="relative">
					<Image
						width={300}
						height={200}
						src={"/images/placeholder.svg"}
						alt={recipe.title ?? "title"}
						className="w-full h-48 object-cover rounded-t-lg"
						onClick={() => setDialogOpen(true)}
					/>
					<div className="absolute top-2 right-2 flex gap-2">
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="bg-white/80 hover:bg-white"
							disabled={true}
							// onClick={() => downloadRecipe(recipe)}
						>
							<Download className="h-4 w-4 text-gray-600" />
						</Button>
						<Button
							type="button"
							variant="ghost"
							size="icon"
							className="bg-white/80 hover:bg-white cursor-pointer"
							onClick={() => onToggleFavorite(recipe.id, recipe.isFavorite)}
						>
							<Heart
								className={cn(
									"h-4 w-4 text-red-500",
									recipe.isFavorite ? "fill-current" : "hover:fill-current",
								)}
							/>
						</Button>
					</div>
				</div>
				<CardHeader className="pb-3" onClick={() => setDialogOpen(true)}>
					<CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
					<p className="text-sm text-muted-foreground line-clamp-2">
						{recipe.description}
					</p>
				</CardHeader>
				<CardContent className="pt-0" onClick={() => setDialogOpen(true)}>
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
