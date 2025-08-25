"use client";

import { startTransition, use, useActionState, useOptimistic } from "react";
import { CardsList } from "@/components/utils/card-list/card-list";
import GenericCarousel from "@/components/utils/carousel/generic-carousel";
import type { Recipe } from "@/generated/prisma";
import { useI18n } from "@/locales/client";
import { setFavorite } from "./_serveractions/actions";
import RecipeCard from "./recipe-card";

interface RecipePageProps {
	recipeList: Promise<{ recipes: Recipe[] | [] }>;
}

export default function RecipePage({ recipeList }: RecipePageProps) {
	const t = useI18n();
	const { recipes } = use(recipeList);

	const [_favoriteState, toggleFavoriteAction] = useActionState(setFavorite, {
		success: false,
	});

	const [optimisticFavorites, setOptimisticFavorites] = useOptimistic(
		recipes.reduce(
			(acc, recipe) => {
				acc[recipe.id] = recipe.isFavorite;
				return acc;
			},
			{} as Record<string, boolean>,
		),
		(state, id: string) => ({
			...state,
			[id]: !state[id],
		}),
	);

	const toggleFavorite = (chatId: Recipe["id"]) => {
		startTransition(() => {
			setOptimisticFavorites(chatId);
			toggleFavoriteAction({
				chatId,
				isFavorite: !optimisticFavorites[chatId],
			});
		});
	};

	return (
		<>
			<GenericCarousel
				data={recipes.filter((recipe) => optimisticFavorites[recipe.id])}
				itemComponent={(recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={{ ...recipe, isFavorite: optimisticFavorites[recipe.id] }}
						onToggleFavorite={() => toggleFavorite(recipe.id)}
					/>
				)}
				title={t("components.myRecipes.carousel.title")}
				className="md:px-12"
				options={{ align: "start" }}
			/>
			<CardsList
				data={recipes}
				title={t("components.myRecipes.cardList.title")}
				card={(recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={{ ...recipe, isFavorite: optimisticFavorites[recipe.id] }}
						onToggleFavorite={() => toggleFavorite(recipe.id)}
					/>
				)}
				emptyMessage={t("components.myRecipes.cardList.noResult")}
				enablePagination
				enableToolBar
			/>
		</>
	);
}
