import type { Metadata } from "next";
import { getI18n } from "@/locales/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();

	return {
		title: t("components.auth.forgetPassword.title"),
		description: t("components.auth.forgetPassword.description"),
		robots: {
			index: false,
			follow: true,
		},
	};
}
export default function Layout({ children }: { children: React.ReactNode }) {
	return <div>{children}</div>;
}
