import type { Metadata } from "next";
import { getI18n } from "@/locales/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();

	return {
		title: `${t("metaData.defaultTitle")} - ${t("components.chat.title")}`,
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
	return <>{children}</>;
}
