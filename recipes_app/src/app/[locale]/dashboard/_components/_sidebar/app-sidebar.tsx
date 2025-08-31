"use client";

import { BotMessageSquare, Logs, ReceiptText, Users } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { useMemo } from "react";
import {
	Sidebar,
	SidebarContent,
	SidebarFooter,
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
			<span className="w-10 aspect-square rounded-lg bg-popover-foreground" />
			<div className="grid gap-1 w-full p-1">
				<span className="rounded-full w-3/5 bg-popover-foreground" />
				<span className="rounded-full w-4/5 bg-popover-foreground" />
			</div>
		</div>
	);
};

export function AppSidebar() {
	const { data: session, isPending } = useSession();
	const t = useI18n();
	const pathname = usePathname();

	const dataSideBar = useMemo(
		() => ({
			navMain: [
				{
					title: t("components.appSideBar.chatBot"),
					url: "chat",
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
							url: "admin/users",
							icon: <Users />,
						},
						{
							title: t("components.appSideBar.logs"),
							url: "admin/logs",
							icon: <Logs />,
						},
					],
					visibleTo: ["admin"],
				},
			],
		}),
		[t],
	);

	const dataUser = useMemo(
		() => ({
			name: session?.user.name || "",
			email: session?.user.email || "",
			avatar: session?.user.image || "./",
		}),
		[session?.user.name, session?.user.email, session?.user.image],
	);

	return (
		<Sidebar variant="inset" className="p-1">
			<SidebarHeader>
				<div className="flex justify-center items-center bg-sidebar-accent rounded-lg w-full">
					<Image
						width={600}
						height={400}
						src="/images/logo-recipes-master.webp"
						alt="Recipes Master"
						className="p-2"
					/>
				</div>
			</SidebarHeader>
			<SidebarContent>
				<SidebarMenu className="p-1">
					{dataSideBar.navMain.map((item) =>
						item.visibleTo.includes(session?.user.role ?? "") ? (
							<SidebarMenuItem key={item.title}>
								<SidebarMenuButton
									asChild
									isActive={!item.items && pathname.includes(item.url)}
									className="transition-shadow data-[active=true]:shadow data-[active=true]:hover:shadow-2xl"
								>
									<Link href={`/dashboard/${item.url}`}>
										{item.icon}
										{item.title}
									</Link>
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
													className="transition-shadow data-[active=true]:shadow data-[active=true]:hover:shadow-2xl"
												>
													<Link href={`/dashboard/${item.url}`}>
														{item.icon}
														{item.title}
													</Link>
												</SidebarMenuSubButton>
											</SidebarMenuSubItem>
										))}
									</SidebarMenuSub>
								) : null}
							</SidebarMenuItem>
						) : null,
					)}
				</SidebarMenu>
			</SidebarContent>
			<SidebarFooter>
				{isPending ? <NavUserSkeleton /> : <NavUser user={dataUser} />}
			</SidebarFooter>
		</Sidebar>
	);
}
