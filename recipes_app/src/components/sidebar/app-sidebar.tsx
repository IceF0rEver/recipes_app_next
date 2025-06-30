"use client";

import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuItem,
	SidebarMenuSubButton,
} from "@/components/ui/sidebar";
import { NavUser } from "./nav-user";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { usePathname } from "next/navigation";
import { BotMessageSquare, ReceiptText } from "lucide-react";

const NavUserSkeleton = () => {
	return (
		<div className="flex flex-row gap-1 w-full h-12 rounded-lg bg-muted-foreground p-2">
			<span className="w-10 aspect-square rounded-lg bg-popover-foreground"></span>
			<div className="grid gap-1 w-full p-1">
				<span className="rounded-full w-3/5 bg-popover-foreground"></span>
				<span className="rounded-full w-4/5 bg-popover-foreground"></span>
			</div>
		</div>
	);
};

export function AppSidebar() {
	const { data: session, isPending } = useSession();
	const t = useI18n();
	const pathname = usePathname();

	const dataSideBar = {
		navMain: [
			{
				title: t("components.appSideBar.chatBot"),
				url: "#",
				icon: <BotMessageSquare />,
			},
			{
				title: t("components.appSideBar.myRecipes"),
				url: "my-recipes",
				icon: <ReceiptText />,
			},
		],
	};

	const dataUser = {
		name: session?.user.name || "",
		email: session?.user.email || "",
		avatar: session?.user.image || "./",
	};

	return (
		<Sidebar variant="inset">
			<SidebarHeader className="p-0">
				<div className="w-full flex flex-row justify-center items-center gap-2 bg-sidebar-accent py-8 rounded-lg">
					<h1 className="text-2xl font-bold whitespace-nowrap">
						<span className="text-primary">Recipes </span>
						<span className="text-secondary">Master</span>
					</h1>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarGroup />
				<SidebarMenu>
					{dataSideBar.navMain.map((item) => (
						<SidebarMenuItem key={item.title}>
							<SidebarMenuSubButton
								asChild
								isActive={
									item.url ===
										pathname.split("/")[
											pathname.split("/").findIndex((i) => i === "dashboard") + 1
										] ||
									(item.url === "#" && pathname.split("/").at(-1) === "dashboard")
								}
							>
								<a href={`/dashboard/${item.url}`}>
									{item.icon}
									{item.title}
								</a>
							</SidebarMenuSubButton>
						</SidebarMenuItem>
					))}
				</SidebarMenu>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter>{isPending ? <NavUserSkeleton /> : <NavUser user={dataUser} />}</SidebarFooter>
		</Sidebar>
	);
}
