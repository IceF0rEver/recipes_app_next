import { getCurrentLocale, getI18n } from "@/locales/server";
import "./[locale]/globals.css";
import type { Metadata } from "next";
import { setStaticParamsLocale } from "next-international/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();

	return {
		title: t("metaData.notFound.title"),
		description: t("metaData.notFound.description"),
	};
}

export default async function GlobalNotFound() {
	const locale = await getCurrentLocale();
	setStaticParamsLocale(locale);
	const t = await getI18n();

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className="bg-background text-foreground">
				<div className="min-h-screen flex items-center justify-center p-4">
					<div className="text-center space-y-8 max-w-md">
						<div className="space-y-4">
							<h1 className="text-8xl font-bold text-primary">404</h1>
							<div className="w-24 h-1 bg-primary mx-auto rounded-full" />
						</div>

						<div className="space-y-3">
							<h2 className="text-2xl font-semibold text-foreground">
								{t("components.notFound.title")}
							</h2>
							<p className="text-muted-foreground leading-relaxed">
								{t("components.notFound.description")}
							</p>
						</div>
					</div>
				</div>
			</body>
		</html>
	);
}
