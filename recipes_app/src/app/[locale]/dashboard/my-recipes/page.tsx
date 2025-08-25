"use server";

import { getRecipesList } from "./_components/_serveractions/actions";
import RecipePage from "./_components/recipe-page";

export default async function Page() {
	const recipes = getRecipesList();
	return <RecipePage recipeList={recipes} />;
}
