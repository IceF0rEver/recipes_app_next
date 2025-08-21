"use client";

import {
	type ColumnDef,
	flexRender,
	getCoreRowModel,
	getFacetedRowModel,
	getFacetedUniqueValues,
	getFilteredRowModel,
	getPaginationRowModel,
	getSortedRowModel,
	useReactTable,
	type VisibilityState,
} from "@tanstack/react-table";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import * as React from "react";
import { useTableSearchParams } from "tanstack-table-search-params";
import {
	Table,
	TableBody,
	TableCell,
	TableHead,
	TableHeader,
	TableRow,
} from "@/components/ui/table";
import { useI18n } from "@/locales/client";
import { DataTablePagination } from "./data-table-pagination";
import { DataTableToolbar } from "./data-table-toolbar";

interface DataTableProps<TData, TValue> {
	columns: ColumnDef<TData, TValue>[];
	data: TData[];
}

export function DataTable<TData, TValue>({
	columns,
	data,
}: DataTableProps<TData, TValue>) {
	const t = useI18n();
	const router = useRouter();

	const initialColumnVisibility = React.useMemo(() => {
		const visibility: VisibilityState = {};
		columns.forEach((col) => {
			if (col.id === "select") {
				visibility[col.id] = true;
			} else if ("accessorKey" in col && col.accessorKey) {
				const vis = col.meta?.initialStateVisibility;
				visibility[col.accessorKey.toString()] = vis !== undefined ? vis : true;
			} else if (col.id) {
				visibility[col.id] = col.enableHiding !== false;
			}
		});
		return visibility;
	}, [columns]);

	const stateAndOnChanges = useTableSearchParams(
		{
			pathname: usePathname(),
			query: useSearchParams(),
			replace: (query) => router.replace(query, { scroll: false }),
		},
		{
			debounceMilliseconds: {
				globalFilter: 300,
				columnFilters: 0,
				rowSelection: 0,
				sorting: 0,
				columnOrder: 0,
				pagination: 0,
			},
		},
	);

	const table = useReactTable({
		...stateAndOnChanges,
		initialState: {
			columnVisibility: initialColumnVisibility,
		},
		data,
		columns,
		enableRowSelection: true,
		getCoreRowModel: getCoreRowModel(),
		getFilteredRowModel: getFilteredRowModel(),
		getPaginationRowModel: getPaginationRowModel(),
		getSortedRowModel: getSortedRowModel(),
		getFacetedRowModel: getFacetedRowModel(),
		getFacetedUniqueValues: getFacetedUniqueValues(),
	});

	return (
		<div className="space-y-4 container mx-auto">
			<DataTableToolbar table={table} />
			<div className="rounded-md border">
				<Table>
					<TableHeader>
						{table.getHeaderGroups().map((headerGroup) => (
							<TableRow key={headerGroup.id}>
								{headerGroup.headers.map((header) => {
									return (
										<TableHead key={header.id} colSpan={header.colSpan}>
											{header.isPlaceholder
												? null
												: flexRender(
														header.column.columnDef.header,
														header.getContext(),
													)}
										</TableHead>
									);
								})}
							</TableRow>
						))}
					</TableHeader>
					<TableBody>
						{table.getRowModel().rows?.length ? (
							table.getRowModel().rows.map((row) => (
								<TableRow
									key={row.id}
									data-state={row.getIsSelected() && "selected"}
								>
									{row.getVisibleCells().map((cell) => (
										<TableCell key={cell.id}>
											{flexRender(
												cell.column.columnDef.cell,
												cell.getContext(),
											)}
										</TableCell>
									))}
								</TableRow>
							))
						) : (
							<TableRow>
								<TableCell
									colSpan={columns.length}
									className="h-24 text-center"
								>
									{t("components.table.table.noResults")}
								</TableCell>
							</TableRow>
						)}
					</TableBody>
				</Table>
			</div>
			<DataTablePagination table={table} />
		</div>
	);
}
