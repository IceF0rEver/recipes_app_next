"use client";

import { dataTableColumnList } from "../../table/data-table-columns-list";
import { DataTable } from "@/components/table/data-table";
import type { Auth } from "@/lib/zod/auth-schemas";
import type { TableProps } from "@/types/auth-types";
import { use } from "react";

export default function UsersTable({ datasTable, columnsItems }: TableProps) {
	const columns = dataTableColumnList<Auth>(columnsItems);
	const usersList = use(datasTable);

	const users =
		usersList.users.map((user) => ({
			...user,
			role: user.role as "user" | "admin" | "premium",
			banExpires: user.banExpires ? user.banExpires.toISOString() : "",
			createdAt: user.createdAt.toISOString(),
			updatedAt: user.updatedAt.toISOString(),
		})) ?? [];

	return <DataTable columns={columns} data={users} />;
}
