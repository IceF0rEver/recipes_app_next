"use client";

import { CardsList } from "@/components/utils/card-list/card-list";
import GenericCarousel from "@/components/utils/carousel/generic-carousel";
import { useI18n } from "@/locales/client";
import RecipeCard from "./recipe-card";

export interface Recipe {
	id: number;
	title: string;
	description: string;
	image: string;
	cookTime: number;
	servings: number;
	difficulty: "Facile" | "Moyen" | "Difficile";
	isFavorite: boolean;
	tags: string[];
}

interface RecipePageProps {
	recipeList: Recipe[];
}

export default function RecipePage({ recipeList }: RecipePageProps) {
	const t = useI18n();
	return (
		<div>
			<GenericCarousel
				data={recipeList}
				itemComponent={(recipe) => <RecipeCard recipe={recipe} />}
				title={t("components.myRecipes.carousel.title")}
				className="md:px-12"
				options={{ align: "start" }}
			/>
			<CardsList
				data={recipeList}
				title={t("components.myRecipes.cardList.title")}
				card={(recipe) => <RecipeCard recipe={recipe} />}
				emptyMessage={t("components.myRecipes.cardList.noResult")}
				enablePagination
				enableToolBar
			/>
		</div>
	);
}
