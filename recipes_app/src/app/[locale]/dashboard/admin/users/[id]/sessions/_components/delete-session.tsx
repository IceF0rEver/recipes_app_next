"use client";

import type { SessionWithImpersonatedBy } from "better-auth/plugins";
import { startTransition, useActionState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { deleteSession } from "./_serveractions/actions";

interface DeleteSessionProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (alertDialogOpen: boolean) => void;
	sessionData: SessionWithImpersonatedBy | null;
}

export default function DeleteSession({
	alertDialogOpen,
	onAlertDialogOpen,
	sessionData,
}: DeleteSessionProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const [state, deleteSessionAction, isPending] = useActionState(
		deleteSession,
		{ success: false },
	);

	const handleDelete = useCallback(() => {
		if (sessionData?.token !== currentUser?.session.token) {
			if (sessionData?.token) {
				startTransition(() => {
					deleteSessionAction(sessionData.token);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalSessionError"));
		}
	}, [t, currentUser, sessionData, deleteSessionAction]);

	useToast(state, isPending, {
		successMessage: t("components.admin.users.toast.delete.success"),
		errorMessage: t("components.admin.users.toast.error"),
		onSuccess: () => {
			onAlertDialogOpen(false);
		},
	});

	return (
		<GenericAlertDialog
			alertDialogOpen={alertDialogOpen}
			onAlertDialogOpen={onAlertDialogOpen}
			title={t("components.admin.users.delete.title")}
			description={t("components.admin.users.delete.descrption")}
			onAction={handleDelete}
			isPending={isPending}
		/>
	);
}
