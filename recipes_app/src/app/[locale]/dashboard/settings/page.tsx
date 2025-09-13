"use server";
import { ErrorBoundary } from "react-error-boundary";
import { getUserWithSubscription } from "@/lib/auth/server";
import SettingsPage from "./_components/_parts/settings-page";
// biome-ignore lint/suspicious/noShadowRestrictedNames: error name
import Error from "./error";

export default async function Page() {
	const userWithSubscription = getUserWithSubscription();

	return (
		<ErrorBoundary fallback={<Error />}>
			<SettingsPage userWithSubscription={userWithSubscription} />
		</ErrorBoundary>
	);
}
