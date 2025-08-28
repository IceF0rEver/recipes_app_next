"use client";

import {
	startTransition,
	use,
	useActionState,
	useCallback,
	useOptimistic,
} from "react";
import { CardsList } from "@/components/utils/card-list/card-list";
import GenericCarousel from "@/components/utils/carousel/generic-carousel";
import type { Chat, Recipe } from "@/generated/prisma";
import { useI18n } from "@/locales/client";
import { deleteRecipeById, setFavoriteRecipe } from "./_serveractions/actions";
import RecipeCard from "./recipe-card";

type RecipeWithChat = Recipe & {
	chat: Chat | null;
};
interface RecipePageProps {
	recipeList: Promise<{ recipesWithChat: RecipeWithChat[] | [] }>;
}

export default function RecipePage({ recipeList }: RecipePageProps) {
	const t = useI18n();
	const { recipesWithChat } = use(recipeList);

	const [_favoriteState, toggleFavoriteAction] = useActionState(
		setFavoriteRecipe,
		{ success: false },
	);

	const [_deleteState, deleteRecipeAction] = useActionState(deleteRecipeById, {
		success: false,
	});

	const [optimisticFavorites, setOptimisticFavorites] = useOptimistic(
		recipesWithChat.reduce(
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

	const [optimisticRecipes, setOptimisticRecipes] = useOptimistic(
		recipesWithChat,
		(state, id: string) => state.filter((r) => r.id !== id),
	);

	const toggleFavorite = useCallback(
		(recipeId: Recipe["id"]) => {
			startTransition(() => {
				setOptimisticFavorites(recipeId);
				toggleFavoriteAction({
					recipeId,
					isFavorite: !optimisticFavorites[recipeId],
				});
			});
		},
		[optimisticFavorites, setOptimisticFavorites, toggleFavoriteAction],
	);

	const handleDelete = useCallback(
		(recipeId: Recipe["id"]) => {
			startTransition(() => {
				setOptimisticRecipes(recipeId);
				deleteRecipeAction(recipeId);
			});
		},
		[setOptimisticRecipes, deleteRecipeAction],
	);

	return (
		<>
			<GenericCarousel
				data={optimisticRecipes.filter(
					(recipesWithChat) => optimisticFavorites[recipesWithChat.id],
				)}
				itemComponent={(recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={{ ...recipe, isFavorite: optimisticFavorites[recipe.id] }}
						onToggleFavorite={() => toggleFavorite(recipe.id)}
						onDelete={() => handleDelete(recipe.id)}
					/>
				)}
				title={t("components.myRecipes.carousel.title")}
				className="md:px-12"
				options={{ align: "start" }}
			/>
			<CardsList
				data={optimisticRecipes}
				title={t("components.myRecipes.cardList.title")}
				card={(recipe) => (
					<RecipeCard
						key={recipe.id}
						recipe={{ ...recipe, isFavorite: optimisticFavorites[recipe.id] }}
						onToggleFavorite={() => toggleFavorite(recipe.id)}
						onDelete={() => handleDelete(recipe.id)}
					/>
				)}
				emptyMessage={t("components.myRecipes.cardList.noResult")}
				enablePagination
				enableToolBar
			/>
		</>
	);
}
