"use client";

import type { UserWithRole } from "better-auth/plugins";
import { type ComponentType, use, useCallback, useState } from "react";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
// import type { Auth } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";
import type { UsersTableProps } from "@/types/users-types";
import BanUsers from "./ban-users";
import DeleteUsers from "./delete-users";
import RoleUsers from "./role-users";

type ActionType = "sheet" | "delete" | "link" | "select";
type RoleType = "user" | "admin" | "premium";

interface Role {
	key: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
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
	const [selectedUser, setSelectedUser] = useState<UserWithRole | null>(null);
	const [selectedKey, setSelectedKey] = useState<Role | null>(null);

	const usersList = use(datasTable);
	const actionsItems = [
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
			onAction: useCallback((data: UserWithRole) => {
				setOpenSheet(true);
				setSelectedUser(data);
			}, []),
			separator: true,
		},
		{
			key: "role",
			label: t("components.table.role"),
			type: "select" as ActionType,
			subItems: [
				{ key: "admin", label: t("components.table.roles.admin") },
				{ key: "user", label: t("components.table.roles.user") },
				{ key: "premium", label: t("components.table.roles.premium") },
			],
			onAction: useCallback((data: UserWithRole, role?: Role) => {
				setAlertOpenDialogRole(true);
				setSelectedUser(data);
				if (role) {
					setSelectedKey(role);
				}
			}, []),
		},
		{
			key: "delete",
			label: t("button.delete"),
			type: "delete" as ActionType,
			separator: true,
			onAction: useCallback((data: UserWithRole) => {
				setAlertOpenDialogDelete(true);
				setSelectedUser(data);
			}, []),
		},
	];

	const columns = dataTableColumnList<UserWithRole>(columnsItems, actionsItems);

	return (
		<div>
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
		</div>
	);
}
