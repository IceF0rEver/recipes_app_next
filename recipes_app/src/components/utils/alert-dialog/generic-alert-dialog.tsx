"use client";
import {
	AlertDialog,
	AlertDialogAction,
	AlertDialogCancel,
	AlertDialogContent,
	AlertDialogDescription,
	AlertDialogFooter,
	AlertDialogHeader,
	AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { useI18n } from "@/locales/client";

interface GenericAlertDialogProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (dialogOpen: boolean) => void;
	label?: string;
}
export default function GenericAlertDialog({
	alertDialogOpen,
	onAlertDialogOpen,
	label = "",
}: GenericAlertDialogProps) {
	const t = useI18n();
	return (
		<AlertDialog open={alertDialogOpen} onOpenChange={onAlertDialogOpen}>
			<AlertDialogContent>
				<AlertDialogHeader>
					<AlertDialogTitle>{t("components.utils.alertDialog.title") + label}</AlertDialogTitle>
					<AlertDialogDescription>
						{
							// @ts-ignore
							t("components.utils.alertDialog.description", { title: label })
						}
					</AlertDialogDescription>
				</AlertDialogHeader>
				<AlertDialogFooter>
					<AlertDialogCancel>{t("button.cancel")}</AlertDialogCancel>
					<AlertDialogAction>{t("button.delete")}</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
