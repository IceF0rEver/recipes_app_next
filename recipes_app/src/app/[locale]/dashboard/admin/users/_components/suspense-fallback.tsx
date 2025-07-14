"use client";

import { Loader2 } from "lucide-react";
import { useI18n } from "@/locales/client";

export default function SuspenseFallback() {
	const t = useI18n();
	return (
		<section className="w-full">
			<article className="mx-auto py-4 flex h-12 w-12 items-center justify-center rounded-full bg-secondary/10">
				<Loader2 className="h-6 w-6 animate-spin text-primary" />
			</article>
			<article className="text-center py-4">
				<h2 className="text-2xl font-bold">
					{t("components.admin.users.suspense.fallback.title")}
				</h2>
				<h3 className="text-sm opacity-60">
					{t("components.admin.users.suspense.fallback.description")}
				</h3>
			</article>
		</section>
	);
}
