"use client";

import { useI18n } from "@/locales/client";
import { Button } from "../ui/button";
import { useState } from "react";
import {
	AlertDialog,
	AlertDialogContent,
	AlertDialogTrigger,
	AlertDialogCancel,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogDescription,
} from "@/components/ui/alert-dialog";
import UpdatePassword from "./update-password";
import SettingsArticle from "./settings-article";

export default function SettingsArticlePassword() {
	const t = useI18n();
	const [open, setOpen] = useState<boolean>(false);

	return (
		<SettingsArticle
			className={"flex flex-col gap-2"}
			label={t("components.settings.form.changePassword.label")}
			description={t("components.settings.form.changePassword.description")}
		>
			<AlertDialog open={open} onOpenChange={setOpen}>
				<AlertDialogTrigger asChild>
					<Button type="button" variant={"link"} className="min-w-1/4">
						<p>{t("button.updatePassword")}</p>
					</Button>
				</AlertDialogTrigger>
				<AlertDialogContent>
					<AlertDialogHeader>
						<AlertDialogTitle>{t("components.settings.form.changePassword.confirmTitle")}</AlertDialogTitle>
						<AlertDialogDescription>
							{t("components.settings.form.changePassword.confirmDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<UpdatePassword onOpenChange={setOpen} />
					<AlertDialogFooter>
						<AlertDialogCancel className="w-full">{t("button.cancel")}</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SettingsArticle>
	);
}
