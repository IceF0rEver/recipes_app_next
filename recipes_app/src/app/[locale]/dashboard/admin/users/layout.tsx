import LayoutHeader from "@/components/dashboard/layout/layout-header";
import { getI18n } from "@/locales/server";
import type { Metadata } from "next";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();

	return {
		title: `${t("metaData.defaultTitle")} - ${t("components.admin.users.title")}`,
		description: t("components.admin.users.description"),
		robots: {
			index: true,
			follow: true,
		},
	};
}
export default async function Layout({ children }: { children: React.ReactNode }) {
	const t = await getI18n();
	return (
		<section className="p-6">
			<LayoutHeader
				title={t("components.admin.users.title")}
				description={t("components.admin.users.description")}
			/>
			{children}
		</section>
	);
}
