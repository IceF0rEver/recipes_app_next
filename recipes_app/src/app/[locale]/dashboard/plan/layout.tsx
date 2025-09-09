import type { Metadata } from "next";
import { getI18n } from "@/locales/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();

	return {
		title: `${t("metaData.defaultTitle")} - ${t("components.myRecipes.title")}`,
		description: t("components.myRecipes.description"),
		robots: {
			index: true,
			follow: true,
		},
	};
}
export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	const t = await getI18n();
	return (
		<div className="container mx-auto px-4 py-16">
			<div className="text-center mb-16">
				<h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">
					{t("components.plan.layout.title")}
				</h1>
				<p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
					{t("components.plan.layout.description")}
				</p>
			</div>
			{children}
		</div>
	);
}
