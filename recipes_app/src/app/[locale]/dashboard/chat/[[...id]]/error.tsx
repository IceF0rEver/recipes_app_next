"use client";

import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/locales/client";

// biome-ignore lint/suspicious/noShadowRestrictedNames: error name
export default function Error() {
	const t = useI18n();
	return (
		<section className="w-full">
			<article className="mx-auto py-4 flex h-12 w-12 items-center justify-center rounded-full bg-destructive/10">
				<AlertTriangle className="h-6 w-6 text-destructive" />
			</article>
			<article className="text-center py-4">
				<h2 className="text-2xl font-bold">
					{t("components.admin.users.error.fallback.title")}
				</h2>
				<h3 className="text-sm opacity-60">
					{t("components.admin.users.error.fallback.description")}
				</h3>
			</article>
			<article className="text-center">
				<Button
					onClick={() => window.location.reload()}
					variant="default"
					className="gap-2"
				>
					<RefreshCw className="h-4 w-4" />
					{t("components.admin.users.error.fallback.reload")}
				</Button>
			</article>
		</section>
	);
}
