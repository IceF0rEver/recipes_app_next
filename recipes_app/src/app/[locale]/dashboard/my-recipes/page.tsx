"use server";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getRecipesListWithChat } from "./_components/_serveractions/actions";
import RecipePage from "./_components/recipe-page";
// biome-ignore lint/suspicious/noShadowRestrictedNames: error name
import Error from "./error";
import Loading from "./loading";

export default async function Page() {
	const recipesWithChat = getRecipesListWithChat();
	return (
		<ErrorBoundary fallback={<Error />}>
			<Suspense fallback={<Loading />}>
				<RecipePage recipeList={recipesWithChat} />
			</Suspense>
		</ErrorBoundary>
	);
}
