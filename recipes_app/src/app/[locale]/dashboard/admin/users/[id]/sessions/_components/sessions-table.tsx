"use client";

import type { Session } from "better-auth";
import { use, useCallback, useMemo, useState } from "react";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
import { useI18n } from "@/locales/client";
import type { SessionsTableProps } from "@/types/sessions-types";
import DeleteSession from "./delete-session";

type ActionType = "sheet" | "delete" | "link" | "select";

export default function SessionsTable({
	datasTable,
	columnsItems,
}: SessionsTableProps) {
	const t = useI18n();
	const [selectedSession, setSelectedSession] = useState<Session | null>(null);
	const [openAlertDialogDelete, setAlertOpenDialogDelete] =
		useState<boolean>(false);

	const sessionsList = use(datasTable);

	const onDeleteAction = useCallback((data: Session) => {
		setAlertOpenDialogDelete(true);
		setSelectedSession(data);
	}, []);

	const actionsItems = useMemo(
		() => [
			{
				key: "delete",
				label: t("button.delete"),
				type: "delete" as ActionType,
				onAction: onDeleteAction,
			},
		],
		[t, onDeleteAction],
	);

	const columns = dataTableColumnList<Session>(columnsItems, actionsItems);

	return (
		<>
			<DeleteSession
				alertDialogOpen={openAlertDialogDelete}
				onAlertDialogOpen={setAlertOpenDialogDelete}
				sessionData={selectedSession}
			/>
			<DataTable columns={columns} data={sessionsList.sessions} />
		</>
	);
}
