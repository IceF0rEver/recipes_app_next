"use client";

import { BotMessageSquare, Logs, ReceiptText, Users } from "lucide-react";
import { usePathname } from "next/navigation";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
	SidebarGroup,
	SidebarHeader,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	SidebarMenuSub,
	SidebarMenuSubButton,
	SidebarMenuSubItem,
} from "@/components/ui/sidebar";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { NavUser } from "./nav-user";

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
				visibleTo: ["user", "admin", "premium"],
			},
			{
				title: t("components.appSideBar.myRecipes"),
				url: "my-recipes",
				icon: <ReceiptText />,
				visibleTo: ["user", "admin", "premium"],
			},
			{
				title: t("components.appSideBar.admin"),
				url: "#",
				items: [
					{
						title: t("components.appSideBar.users"),
						url: "/admin/users",
						icon: <Users />,
					},
					{
						title: t("components.appSideBar.logs"),
						url: "/admin/logs",
						icon: <Logs />,
					},
				],
				visibleTo: ["admin"],
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
					{dataSideBar.navMain.map((item) =>
						item.visibleTo.includes(session?.user.role ?? "") ? (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									isActive={
										!item.items &&
										(pathname.split("/").at(-1) ===
											item.url?.split("/").at(-1) ||
											(item.url === "#" &&
												pathname.split("/").at(-1) === "dashboard"))
									}
								>
									<a href={`/dashboard/${item.url}`}>
										{item.icon}
										{item.title}
									</a>
								</SidebarMenuButton>
								{item.items?.length ? (
									<SidebarMenuSub>
										{item.items.map((item) => (
											<SidebarMenuSubItem key={item.title}>
												<SidebarMenuSubButton
													asChild
													isActive={
														pathname.split("/").at(-1) ===
														item.url?.split("/").at(-1)
													}
												>
													<a href={`/dashboard/${item.url}`}>
														{item.icon}
														{item.title}
													</a>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								) : null}
							</SidebarMenuItem>
						) : null,
					)}
				</SidebarMenu>
				<SidebarGroup />
			</SidebarContent>
			<SidebarFooter>
				{isPending ? <NavUserSkeleton /> : <NavUser user={dataUser} />}
			</SidebarFooter>
		</Sidebar>
	);
}
