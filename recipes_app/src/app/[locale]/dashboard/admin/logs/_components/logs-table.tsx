"use client";

import { use } from "react";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
import type { Log } from "@/generated/prisma";
import type { LogsTableProps } from "@/types/logs-types";

export default function LogsTable({
	datasTable,
	columnsItems,
}: LogsTableProps) {
	const logsList = use(datasTable);

	const columns = dataTableColumnList<Log>(columnsItems, []);

	return <DataTable columns={columns} data={logsList.logs} />;
}
