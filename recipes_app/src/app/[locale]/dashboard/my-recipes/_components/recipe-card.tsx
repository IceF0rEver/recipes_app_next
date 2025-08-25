import { Clock, Download, Heart, Users } from "lucide-react";
import Image from "next/image";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import type { Recipe } from "../page";

type difficulty = "Facile" | "Moyen" | "Difficile";

interface RecipeCardProps {
	recipe: Recipe;
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
	const getDifficultyColor = (difficulty: difficulty) => {
		switch (difficulty) {
			case "Facile":
				return "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300";
			case "Moyen":
				return "bg-yellow-100 text-yellow-800 dark:bg-yellow-900 dark:text-yellow-300";
			case "Difficile":
				return "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300";
			default:
				return "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300";
		}
	};
	return (
		<Card className="group hover:shadow-lg transition-shadow duration-200 flex-shrink-0 w-80 py-0 pb-6">
			<div className="relative">
				<Image
					width={300}
					height={200}
					src={recipe.image ?? "/images/placeholder.svg"}
					alt={recipe.title ?? ""}
					className="w-full h-48 object-cover rounded-t-lg"
				/>
				<div className="absolute top-2 right-2 flex gap-2">
					<Button
						variant="ghost"
						size="icon"
						className="bg-white/80 hover:bg-white"
						disabled={true}
						// onClick={() => downloadRecipe(recipe)}
					>
						<Download className="h-4 w-4 text-gray-600" />
					</Button>
					<Button
						variant="ghost"
						size="icon"
						className="bg-white/80 hover:bg-white"
						// onClick={() => toggleFavorite(recipe.id)}
					>
						<Heart className="h-4 w-4 text-red-500 fill-current" />
					</Button>
				</div>
			</div>
			<CardHeader className="pb-3">
				<CardTitle className="text-lg line-clamp-1">{recipe.title}</CardTitle>
				<p className="text-sm text-muted-foreground line-clamp-2">
					{recipe.description}
				</p>
			</CardHeader>
			<CardContent className="pt-0">
				<div className="flex items-center gap-4 text-sm text-muted-foreground mb-3">
					<div className="flex items-center gap-1">
						<Clock className="h-4 w-4" />
						<span>{recipe.cookTime}min</span>
					</div>
					<div className="flex items-center gap-1">
						<Users className="h-4 w-4" />
						<span>{recipe.servings}</span>
					</div>
				</div>
				<div className="flex items-center justify-between">
					<Badge className={getDifficultyColor(recipe.difficulty)}>
						{recipe.difficulty}
					</Badge>
					<div className="flex gap-1">
						{recipe.tags.slice(0, 2).map((tag) => (
							<Badge key={tag} variant="secondary" className="text-xs">
								{tag}
							</Badge>
						))}
					</div>
				</div>
			</CardContent>
		</Card>
	);
}
