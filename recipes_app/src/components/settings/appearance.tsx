"use client";

import { useI18n } from "@/locales/client";
import DarkMode from "../utils/dark-mode";
import SelectLang from "../utils/select-lang";
import SettingsArticle from "./settings-article";
import SettingsItemsHeader from "./settings-items-header";

export default function Appearance() {
	const t = useI18n();

	const items = [
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
	];
	return (
		<article className="max-w-3xl">
			<SettingsItemsHeader
				title={t("components.settings.items.appearance.title")}
				description={t("components.settings.items.appearance.description")}
			/>
			<section className="flex flex-col w-full gap-9">
				{items?.map((item) => (
					<SettingsArticle
						key={item.label}
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
