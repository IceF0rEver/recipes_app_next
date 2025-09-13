"use client";

import { use } from "react";
import type { LogsTableProps } from "@/app/[locale]/dashboard/admin/logs/_components/_types/logs-types";
import { DataTable } from "@/components/utils/table/data-table";
import { dataTableColumnList } from "@/components/utils/table/data-table-columns-list";
import type { Log } from "@/generated/prisma";

export default function LogsTable({
	datasTable,
	columnsItems,
}: LogsTableProps) {
	const logsList = use(datasTable);

	const columns = dataTableColumnList<Log>(columnsItems, []);

	return <DataTable columns={columns} data={logsList.logs} />;
}
