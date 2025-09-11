"use client";

import { useState } from "react";
import {
	AlertDialog,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
	AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Button } from "@/components/ui/button";
import { useI18n } from "@/locales/client";
import SettingsArticle from "./settings-article";
import UpdatePassword from "./update-password";

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
						<AlertDialogTitle>
							{t("components.settings.form.changePassword.confirmTitle")}
						</AlertDialogTitle>
						<AlertDialogDescription>
							{t("components.settings.form.changePassword.confirmDescription")}
						</AlertDialogDescription>
					</AlertDialogHeader>
					<UpdatePassword onOpenChange={setOpen} />
					<AlertDialogFooter>
						<AlertDialogCancel className="w-full">
							{t("button.cancel")}
						</AlertDialogCancel>
					</AlertDialogFooter>
				</AlertDialogContent>
			</AlertDialog>
		</SettingsArticle>
	);
}
