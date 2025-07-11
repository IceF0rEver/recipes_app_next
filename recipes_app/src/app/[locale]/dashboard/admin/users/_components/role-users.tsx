"use client";

import {
	type ComponentType,
	startTransition,
	useActionState,
	useEffect,
} from "react";
import { toast } from "sonner";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import { useSession } from "@/lib/auth/auth-client";
import type { Auth } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";
import { roleUser, type UserState } from "./_serveractions/actions";

interface RoleUsersProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (alertDialogOpen: boolean) => void;
	userData: Auth | null;
	selectedKey: {
		key: string;
		label: string;
		icon?: ComponentType<{ className?: string }>;
	} | null;
}

const initialState: UserState = {
	success: undefined,
	error: undefined,
	message: undefined,
};

export default function RoleUsers({
	alertDialogOpen,
	onAlertDialogOpen,
	userData,
	selectedKey,
}: RoleUsersProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const [state, formAction, isPending] = useActionState(roleUser, initialState);

	const handleSetRole = () => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id && selectedKey?.key) {
				const formData = new FormData();
				formData.append("userId", userData.id);
				formData.append("role", selectedKey?.key);
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
				state.message || t("components.admin.users.toast.role.success"),
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
			title={`${t("components.admin.users.role.title")} ${selectedKey?.label} `}
			description={t("components.admin.users.role.description")}
			onAction={handleSetRole}
			isPending={isPending}
		/>
	);
}
