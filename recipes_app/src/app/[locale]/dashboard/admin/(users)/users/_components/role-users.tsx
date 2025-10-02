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
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import { updateRoleUser } from "./_serveractions/actions";

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

export default function RoleUsers({
	alertDialogOpen,
	onAlertDialogOpen,
	userData,
	selectedKey,
}: RoleUsersProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const [state, updateRoleAction, isPending] = useActionState(updateRoleUser, {
		success: false,
	});

	const handleSetRole = useCallback(() => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id && selectedKey?.key) {
				startTransition(() => {
					updateRoleAction({ userId: userData.id, role: selectedKey?.key });
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalIdError"));
		}
	}, [currentUser, updateRoleAction, t, selectedKey, userData]);

	useToast(state, isPending, {
		successMessage: t("components.admin.users.toast.role.success"),
		errorMessage: t("components.admin.users.toast.error"),
		onSuccess: () => {
			onAlertDialogOpen(false);
		},
	});

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
