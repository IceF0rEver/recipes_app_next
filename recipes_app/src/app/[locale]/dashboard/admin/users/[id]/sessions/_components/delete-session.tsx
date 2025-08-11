"use client";

import type { SessionWithImpersonatedBy } from "better-auth/plugins";
import { startTransition, useActionState, useCallback, useEffect } from "react";
import { toast } from "sonner";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { deleteSession, type SessionState } from "./_serveractions/actions";

interface DeleteSessionProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (alertDialogOpen: boolean) => void;
	sessionData: SessionWithImpersonatedBy | null;
}

const initialState: SessionState = {
	success: undefined,
	error: undefined,
	message: undefined,
};

export default function DeleteSession({
	alertDialogOpen,
	onAlertDialogOpen,
	sessionData,
}: DeleteSessionProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const [state, formAction, isPending] = useActionState(
		deleteSession,
		initialState,
	);

	const handleDelete = useCallback(() => {
		if (sessionData?.token !== currentUser?.session.token) {
			if (sessionData?.token) {
				const formData = new FormData();
				formData.append("token", sessionData.token);
				startTransition(() => {
					formAction(formData);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalSessionError"));
		}
	}, [t, currentUser, sessionData, formAction]);

	useEffect(() => {
		if (state.success) {
			toast.success(
				state.message || t("components.admin.users.toast.delete.success"),
			);
			onAlertDialogOpen(false);
		} else if (!state.success && state.error) {
			console.error(`${state.error.status} - ${state.error.code}`);
			toast.error(t("components.admin.users.toast.error"));
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
