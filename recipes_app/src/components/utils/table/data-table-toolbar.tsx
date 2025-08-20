"use client";

import type { Table } from "@tanstack/react-table";
import { Search, X } from "lucide-react";
import { type ComponentType, useMemo } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/locales/client";
import { DataTableFacetedFilter } from "./data-table-faceted-filter";
import { DataTableViewOptions } from "./data-table-view-options";

interface DataTableToolbarProps<TData> {
	table: Table<TData>;
}

export function DataTableToolbar<TData>({ table }: DataTableToolbarProps<TData>) {
	const t = useI18n();
	const globalFilter = table.getState().globalFilter ?? "";

	const isFiltered = globalFilter.length > 0;

	const filterableColumns = useMemo(() => {
		return table
			.getVisibleLeafColumns()
			.filter((col) => col.columnDef.meta?.subItems && col.columnDef.meta.subItems.length > 0);
	}, [table]);
	return (
		<div className="flex flex-col md:flex-row-reverse items-center justify-between gap-2">
			<DataTableViewOptions table={table} />

			<div className="flex flex-col md:flex-row gap-2 w-full md:max-w-full md:flex-1">
				<div className="relative max-w-md flex items-center">
					<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
					<Input
						placeholder={t("components.table.toolbar.search")}
						value={globalFilter as string}
						onChange={(event) => table.setGlobalFilter(event.target.value)}
						className="px-10 h-8 md:w-[150px] lg:w-[250px]"
					/>
					{isFiltered && (
						<Button
							variant="ghost"
							onClick={() => {
								table.setGlobalFilter(undefined);
							}}
							className="absolute right-0 h-8 px-2 lg:px-3 "
						>
							<X />
						</Button>
					)}
				</div>
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
			</div>
		</div>
	);
}
