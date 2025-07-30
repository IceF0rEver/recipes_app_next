"use client";

import type { Table } from "@tanstack/react-table";
import { X } from "lucide-react";
import { type ComponentType, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/locales/client";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({
	table,
}: DataTableToolbarProps<TData>) {
	const t = useI18n();
	const globalFilter = table.getState().globalFilter ?? "";

	const isFiltered =
		table.getState().columnFilters.length > 0 || globalFilter.length > 0;

	const filterableColumns = useMemo(() => {
		return table
			.getVisibleLeafColumns()
			.filter(
				(col) =>
					col.columnDef.meta?.subItems &&
					col.columnDef.meta.subItems.length > 0,
			);
	}, [table]);
	return (
		<div className="flex flex-col md:flex-row-reverse items-center justify-between gap-2">
			<DataTableViewOptions table={table} />

			<div className="flex flex-col md:flex-row gap-2 w-full md:max-w-full md:flex-1">
				<Input
					placeholder={t("components.table.toolbar.search")}
					value={globalFilter as string}
					onChange={(event) => table.setGlobalFilter(event.target.value)}
					className="h-8 md:w-[150px] lg:w-[250px]"
				/>
				<div className="flex gap-2 overflow-x-auto md:max-w-md">
					{filterableColumns.map((column) => (
						<DataTableFacetedFilter
							key={column.id}
							column={column}
							title={column.columnDef.meta?.label}
							options={
								column.columnDef.meta?.subItems?.map(
									(item: {
										value: string;
										label: string;
										icon?: ComponentType<{ className?: string }>;
									}) => ({
										label: item.label,
										value: item.value,
										icon: item.icon,
									}),
								) ?? []
							}
						/>
					))}
				</div>
				{isFiltered && (
					<Button
						variant="outline"
						onClick={() => {
							table.resetColumnFilters();
							table.setGlobalFilter(undefined);
						}}
						className="h-8 px-2 lg:px-3"
					>
						<X />
					</Button>
				)}
			</div>
		</div>
	);
}
