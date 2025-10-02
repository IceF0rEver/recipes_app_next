"use client";

import type { UserWithRole } from "better-auth/plugins";
import { startTransition, useActionState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { deleteUser } from "./_serveractions/actions";

interface DeleteUsersProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (alertDialogOpen: boolean) => void;
	userData: UserWithRole | null;
}

export default function DeleteUsers({
	alertDialogOpen,
	onAlertDialogOpen,
	userData,
}: DeleteUsersProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const [state, deleteUserAction, isPending] = useActionState(deleteUser, {
		success: false,
	});

	const handleDelete = useCallback(() => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id) {
				startTransition(() => {
					deleteUserAction(userData.id);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalIdError"));
		}
	}, [currentUser, deleteUserAction, t, userData]);

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
