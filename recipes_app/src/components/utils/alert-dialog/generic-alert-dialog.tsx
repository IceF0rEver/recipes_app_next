"use client";
import { Loader2 } from "lucide-react";
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
	onAction: () => void;
	isPending: boolean;
}
export default function GenericAlertDialog({
	alertDialogOpen,
	onAlertDialogOpen,
	label = "",
	onAction,
	isPending = false,
}: GenericAlertDialogProps) {
	const t = useI18n();

	const handleAction = () => {
		if (onAction) {
			onAction();
		}
	};

	return (
		<AlertDialog open={alertDialogOpen}>
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
					<AlertDialogCancel disabled={isPending} onClick={() => onAlertDialogOpen(false)}>
						{t("button.cancel")}
					</AlertDialogCancel>
					<AlertDialogAction onClick={handleAction} disabled={isPending}>
						{isPending ? (
							<span className="flex justify-center md:min-w-[75px]">
								<Loader2 size={16} className="animate-spin" />
							</span>
						) : (
							<span>{t("button.delete")}</span>
						)}
					</AlertDialogAction>
				</AlertDialogFooter>
			</AlertDialogContent>
		</AlertDialog>
	);
}
