"use client";

import { useMemo } from "react";
import DarkMode from "@/components/utils/dark-mode";
import SelectLang from "@/components/utils/select-lang";
import { useI18n } from "@/locales/client";
import SettingsArticle from "../_utils/settings-article";
import SettingsItemsHeader from "../_utils/settings-items-header";

export default function Appearance() {
	const t = useI18n();

	const items = useMemo(
		() => [
			{
				label: t("components.settings.form.language.label"),
				description: t("components.settings.form.language.description"),
				component: <SelectLang />,
			},
			{
				label: t("components.settings.form.darkMode.label"),
				description: t("components.settings.form.darkMode.description"),
				component: <DarkMode />,
			},
		],
		[t],
	);
	return (
		<article className="max-w-3xl">
			<SettingsItemsHeader
				title={t("components.settings.items.appearance.title")}
				description={t("components.settings.items.appearance.description")}
			/>
			<section className="flex flex-col w-full gap-9">
				{items?.map((item, index) => (
					<SettingsArticle
						// biome-ignore lint/suspicious/noArrayIndexKey: index for key
						key={index}
						className={"flex flex-col gap-2"}
						label={item.label}
						description={item.description}
					>
						{item.component}
					</SettingsArticle>
				))}
			</section>
		</article>
	);
}
