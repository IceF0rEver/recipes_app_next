"use client";
import { useRouter, useSearchParams } from "next/navigation";
import { useMemo, useState } from "react";
import Account from "@/app/[locale]/dashboard/settings/_components/_parts/account";
import Appearance from "@/app/[locale]/dashboard/settings/_components/_parts/appearance";
import {
	SidebarContent,
	SidebarGroup,
	SidebarGroupContent,
	SidebarMenu,
	SidebarMenuButton,
	SidebarMenuItem,
} from "@/components/ui/sidebar";
import { useI18n } from "@/locales/client";
import Plan from "./_components/_parts/plan";

export default function Page() {
	const t = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();

	const items = useMemo(
		() => [
			{
				title: t("components.items.appearance.title"),
				key: "appearance",
				component: <Appearance />,
			},
			{
				title: t("components.items.account.title"),
				key: "account",
				component: <Account />,
			},
			{
				title: t("components.items.plan.title"),
				key: "plan",
				component: <Plan />,
			},
		],
		[t],
	);

	const [settingItemSelected, setSettingItemSelected] = useState<string>(
		searchParams.get("selected") ?? items[0].key,
	);

	return (
		<section className="md:grid md:grid-cols-5 md:p-6">
			<aside className="md:col-span-1">
				<SidebarContent>
					<SidebarGroup>
						<SidebarGroupContent>
							<SidebarMenu className="flex-row md:flex-col">
								{items?.map((item) => (
									<SidebarMenuItem key={item.key}>
										<SidebarMenuButton
											asChild
											variant={"default"}
											isActive={settingItemSelected === item.key}
											onClick={() => {
												setSettingItemSelected(item.key);
												const params = new URLSearchParams(searchParams);
												params.set("selected", item.key);
												router.replace(`?${params.toString()}`, {
													scroll: false,
												});
											}}
										>
											<span>{item.title}</span>
										</SidebarMenuButton>
									</SidebarMenuItem>
								))}
							</SidebarMenu>
						</SidebarGroupContent>
					</SidebarGroup>
				</SidebarContent>
			</aside>
			<section className="md:col-span-4 px-6">
				{items?.map((item) => (
					<div key={item.key}>
						{settingItemSelected === item.key && item.component}
					</div>
				))}
			</section>
		</section>
	);
}
