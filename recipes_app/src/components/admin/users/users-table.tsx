"use client";

import { use, useCallback, useState } from "react";
import GenericAlertDialog from "@/components/utils/alert-dialog/generic-alert-dialog";
import GenericSheet from "@/components/utils/sheet/generic-sheet";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
import type { Auth } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";
import type { TableProps } from "@/types/auth-types";

export default function UsersTable({ datasTable, columnsItems }: TableProps) {
	const t = useI18n();
	const [openSheet, setOpenSheet] = useState<boolean>(false);
	const [openAlertDialog, setAlertOpenDialog] = useState<boolean>(false);
	const [sheetType, setSheetType] = useState<"edit" | "add">("add");

	const usersList = use(datasTable);
	const links = [{ key: "session", label: t("components.table.session"), url: "/session" }];
	const users =
		usersList.users.map((user) => ({
			...user,
			role: user.role as "user" | "admin" | "premium",
			banExpires: user.banExpires ? new Date(user.banExpires).toLocaleString() : "",
			createdAt: new Date(user.createdAt).toLocaleString(),
			updatedAt: new Date(user.updatedAt).toLocaleString(),
		})) ?? [];

	const onEdit = useCallback((_value: unknown) => {
		setSheetType("edit");
		setOpenSheet(true);
	}, []);

	const onDelete = useCallback((_value: unknown) => {
		setAlertOpenDialog(true);
	}, []);

	const columns = dataTableColumnList<Auth>(columnsItems, onEdit, onDelete, links);
	return (
		<div>
			<DataTable columns={columns} data={users} />
			<GenericSheet
				sheetOpen={openSheet}
				onSheetOpen={setOpenSheet}
				type={sheetType}
				title={t("components.admin.users.name")}
				description={t("components.admin.users.name")}
			>
				<div>test</div>
			</GenericSheet>
			<GenericAlertDialog
				alertDialogOpen={openAlertDialog}
				onAlertDialogOpen={setAlertOpenDialog}
				label={t("components.admin.users.name")}
			/>
		</div>
	);
}
