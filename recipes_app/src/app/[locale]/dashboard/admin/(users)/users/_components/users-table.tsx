"use client";

import type { UserWithRole } from "better-auth/plugins";
import { type ComponentType, use, useCallback, useMemo, useState } from "react";
import type { UsersTableProps } from "@/app/[locale]/dashboard/admin/(users)/users/_components/_types/users-types";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
import { useI18n } from "@/locales/client";
import BanUsers from "./ban-users";
import DeleteUsers from "./delete-users";
import RoleUsers from "./role-users";

type ActionType = "sheet" | "delete" | "link" | "select";

interface Role {
	key: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
}

interface UserWithRoleAndStripe extends UserWithRole {
	stripeCustomerId?: string | null;
}

export default function UsersTable({
	datasTable,
	columnsItems,
}: UsersTableProps) {
	const t = useI18n();
	const [openSheet, setOpenSheet] = useState<boolean>(false);
	const [openAlertDialogDelete, setAlertOpenDialogDelete] =
		useState<boolean>(false);
	const [openAlertDialogRole, setAlertOpenDialogRole] =
		useState<boolean>(false);
	const [selectedUser, setSelectedUser] =
		useState<UserWithRoleAndStripe | null>(null);
	const [selectedKey, setSelectedKey] = useState<Role | null>(null);

	const usersList = use(datasTable);

	const onBanAction = useCallback((data: UserWithRoleAndStripe) => {
		setOpenSheet(true);
		setSelectedUser(data);
	}, []);

	const onRoleAction = useCallback(
		(data: UserWithRoleAndStripe, role?: Role) => {
			setAlertOpenDialogRole(true);
			setSelectedUser(data);
			if (role) {
				setSelectedKey(role);
			}
		},
		[],
	);

	const onDeleteAction = useCallback((data: UserWithRoleAndStripe) => {
		setAlertOpenDialogDelete(true);
		setSelectedUser(data);
	}, []);

	const actionsItems = useMemo(
		() => [
			{
				key: "session",
				label: t("components.table.session"),
				url: "/sessions",
				type: "link" as ActionType,
			},
			{
				key: "ban",
				label: t("button.ban"),
				type: "sheet" as ActionType,
				onAction: onBanAction,
				separator: true,
			},
			{
				key: "role",
				label: t("components.table.role"),
				type: "select" as ActionType,
				subItems: [
					{ key: "admin", label: t("components.table.roles.admin") },
					{ key: "user", label: t("components.table.roles.user") },
				],
				onAction: onRoleAction,
			},
			{
				key: "delete",
				label: t("button.delete"),
				type: "delete" as ActionType,
				separator: true,
				onAction: onDeleteAction,
			},
		],
		[t, onBanAction, onDeleteAction, onRoleAction],
	);

	const columns = dataTableColumnList<UserWithRoleAndStripe>(
		columnsItems,
		actionsItems,
	);

	return (
		<>
			<DataTable columns={columns} data={usersList.users} />
			<BanUsers
				sheetOpen={openSheet}
				onSheetOpen={setOpenSheet}
				userData={selectedUser}
			/>
			<DeleteUsers
				alertDialogOpen={openAlertDialogDelete}
				onAlertDialogOpen={setAlertOpenDialogDelete}
				userData={selectedUser}
			/>
			<RoleUsers
				alertDialogOpen={openAlertDialogRole}
				onAlertDialogOpen={setAlertOpenDialogRole}
				userData={selectedUser}
				selectedKey={selectedKey}
			/>
		</>
	);
}
