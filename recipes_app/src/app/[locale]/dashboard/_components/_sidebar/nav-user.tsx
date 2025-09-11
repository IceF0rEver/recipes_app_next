"use client";

import { ChevronsUpDown, LogOut, Settings2 } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { memo, useCallback } from "react";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuGroup,
	DropdownMenuItem,
	DropdownMenuLabel,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
	useSidebar,
} from "@/components/ui/sidebar";
import { authClient } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";

interface NavUserProps {
	user: {
		name: string;
		email: string;
		avatar: string;
		role: string;
	};
}

export const NavUser = memo(function NavUser({ user }: NavUserProps) {
	const t = useI18n();
	const { isMobile } = useSidebar();
	const router = useRouter();

	const handleSignOut = useCallback(async () => {
		await authClient.signOut();
		router.push("/");
	}, [router]);

	return (
		<SidebarMenu>
			<SidebarMenuItem>
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<SidebarMenuButton variant={"outline"} size="lg">
							<Avatar className="h-8 w-8 rounded-lg">
								<AvatarImage
									src={user.avatar || "/placeholder.svg"}
									alt={user.name}
								/>
								<AvatarFallback className="rounded-lg bg-primary">
									{user.name.charAt(0).toUpperCase()}
								</AvatarFallback>
							</Avatar>
							<div className="grid flex-1 text-left text-sm leading-tight">
								<span className="truncate font-semibold">{user.name}</span>
								<span className="truncate text-xs">{user.email}</span>
							</div>
							<ChevronsUpDown className="ml-auto size-4" />
						</SidebarMenuButton>
					</DropdownMenuTrigger>
					<DropdownMenuContent
						className="w-(--radix-dropdown-menu-trigger-width) min-w-56 rounded-lg"
						side={isMobile ? "bottom" : "right"}
						align="end"
						sideOffset={4}
					>
						<DropdownMenuLabel className="p-0 font-normal">
							<div className="flex items-center gap-2 px-1 py-1.5 text-left text-sm">
								<Avatar className="h-8 w-8 rounded-lg">
									<AvatarImage
										src={user.avatar || "/placeholder.svg"}
										alt={user.name}
									/>
									<AvatarFallback className="rounded-lg">
										{user.name.charAt(0).toUpperCase()}
									</AvatarFallback>
								</Avatar>
								<div className="grid flex-1 text-left text-sm leading-tight">
									<span className="truncate font-semibold">{user.name}</span>
									<span className="truncate text-xs">{user.email}</span>
								</div>
							</div>
						</DropdownMenuLabel>
						<DropdownMenuSeparator />
						<DropdownMenuGroup>
							<Link href={"/dashboard/settings"}>
								<DropdownMenuItem variant="default">
									<Settings2 />
									{t("button.settings")}
								</DropdownMenuItem>
							</Link>
						</DropdownMenuGroup>
						<DropdownMenuSeparator />
						<DropdownMenuItem variant="default" onClick={handleSignOut}>
							<LogOut />
							{t("button.logOut")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</SidebarMenuItem>
		</SidebarMenu>
	);
});
