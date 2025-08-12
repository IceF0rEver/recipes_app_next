import type { Metadata } from "next";
import { AppSidebar } from "@/app/[locale]/dashboard/_components/_sidebar/app-sidebar";
import { SidebarInset, SidebarProvider, SidebarTrigger } from "@/components/ui/sidebar";
import { getI18n } from "@/locales/server";

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();

	return {
		title: t("components.dashboard.title"),
		description: t("components.dashboard.description"),
		robots: {
			index: true,
			follow: true,
		},
	};
}
export default function Layout({ children }: { children: React.ReactNode }) {
	return (
		<SidebarProvider>
			<AppSidebar />
			<SidebarInset>
				<header className="flex h-16 shrink-0 items-center gap-2">
					<div className="flex items-center gap-2 px-4">
						<SidebarTrigger className="-ml-1" />
					</div>
				</header>
				<main>{children}</main>
			</SidebarInset>
		</SidebarProvider>
	);
}
