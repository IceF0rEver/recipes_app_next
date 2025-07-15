"use client";

import type { UserWithRole } from "better-auth/plugins";
import { startTransition, useActionState, useEffect } from "react";
import { toast } from "sonner";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { deleteUser, type UserState } from "./_serveractions/actions";

interface DeleteUsersProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (alertDialogOpen: boolean) => void;
	userData: UserWithRole | null;
}

const initialState: UserState = {
	success: undefined,
	error: undefined,
	message: undefined,
};

export default function DeleteUsers({
	alertDialogOpen,
	onAlertDialogOpen,
	userData,
}: DeleteUsersProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const [state, formAction, isPending] = useActionState(
		deleteUser,
		initialState,
	);

	const handleDelete = () => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id) {
				const formData = new FormData();
				formData.append("userId", userData.id);
				startTransition(() => {
					formAction(formData);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalIdError"));
		}
	};

	useEffect(() => {
		if (state.success === true) {
			toast.success(
				state.message || t("components.admin.users.toast.delete.success"),
			);
			onAlertDialogOpen(false);
		} else if (state.success === false && state.error) {
			toast.error(state.error || t("components.admin.users.toast.error"));
		}
	}, [state, t, onAlertDialogOpen]);

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
