"use client";

import type { UserWithRole } from "better-auth/plugins";
import {
	type ComponentType,
	startTransition,
	useActionState,
	useCallback,
	useEffect,
} from "react";
import { toast } from "sonner";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { type UserState, updateRoleUser } from "./_serveractions/actions";

interface Role {
	key: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
}

interface RoleUsersProps {
	alertDialogOpen: boolean;
	onAlertDialogOpen: (alertDialogOpen: boolean) => void;
	userData: UserWithRole | null;
	selectedKey: Role | null;
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
	const [state, formAction, isPending] = useActionState(
		updateRoleUser,
		initialState,
	);

	const handleSetRole = useCallback(() => {
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
	}, [currentUser, formAction, t, selectedKey, userData]);

	useEffect(() => {
		if (state.success === true) {
			toast.success(
				state.message || t("components.admin.users.toast.role.success"),
			);
			onAlertDialogOpen(false);
		} else if (state.success === false && state.error) {
			console.error(`${state.error.status} - ${state.error.code}`);
			toast.error(t("components.admin.users.toast.error"));
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
