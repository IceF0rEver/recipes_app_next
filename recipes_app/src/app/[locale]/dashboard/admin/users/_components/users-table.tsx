"use client";

import { type ComponentType, use, useCallback, useState } from "react";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
import type { Auth } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";
import type { TableProps } from "@/types/auth-types";
import DeleteUsers from "./delete-users";
// import ManageUsers from "./manage-users";
import RoleUsers from "./role-users";

type ActionType = "edit" | "delete" | "link" | "select";

export default function UsersTable({ datasTable, columnsItems }: TableProps) {
	const t = useI18n();
	// const [openSheet, setOpenSheet] = useState<boolean>(false);
	// const [sheetType, setSheetType] = useState<"edit" | "add">("add");
	const [openAlertDialogDelete, setAlertOpenDialogDelete] =
		useState<boolean>(false);
	const [openAlertDialogRole, setAlertOpenDialogRole] =
		useState<boolean>(false);
	const [selectedUser, setSelectedUser] = useState<Auth | null>(null);
	const [selectedKey, setSelectedKey] = useState<{
		key: string;
		label: string;
		icon?: ComponentType<{ className?: string }>;
	} | null>(null);

	const usersList = use(datasTable);
	const users =
		usersList.users.map((user) => ({
			...user,
			role: user.role as "user" | "admin" | "premium",
			banExpires: user.banExpires
				? new Date(user.banExpires).toLocaleString()
				: "",
			createdAt: new Date(user.createdAt).toLocaleString(),
			updatedAt: new Date(user.updatedAt).toLocaleString(),
		})) ?? [];

	const actionsItems = [
		{
			key: "edit",
			label: t("button.edit"),
			type: "edit" as ActionType,
			onAction: useCallback((data: Auth) => {
				// setOpenSheet(true);
				// setSheetType("edit");
				setSelectedUser(data);
			}, []),
		},
		{
			key: "session",
			label: t("components.table.session"),
			url: "/session",
			type: "link" as ActionType,
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
			onAction: useCallback(
				(
					data: Auth,
					role?: {
						key: string;
						label: string;
						icon?: ComponentType<{ className?: string }>;
					},
				) => {
					setAlertOpenDialogRole(true);
					setSelectedUser(data);
					if (role) {
						setSelectedKey(role);
					}
				},
				[],
			),
		},
		{
			key: "delete",
			label: t("button.delete"),
			type: "delete" as ActionType,
			separator: true,
			onAction: useCallback((data: Auth) => {
				setAlertOpenDialogDelete(true);
				setSelectedUser(data);
			}, []),
		},
	];

	const columns = dataTableColumnList<Auth>(columnsItems, actionsItems);

	return (
		<div>
			<DataTable columns={columns} data={users} />
			{/* <ManageUsers sheetOpen={openSheet} onSheetOpen={setOpenSheet} type={sheetType} userData={selectedUser} /> */}
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
