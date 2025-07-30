import type { Table } from "@tanstack/react-table";
import {
	ChevronLeft,
	ChevronRight,
	ChevronsLeft,
	ChevronsRight,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
	Select,
	SelectContent,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/locales/client";

interface DataTablePaginationProps<TData> {
	table: Table<TData>;
}

export function DataTablePagination<TData>({
	table,
}: DataTablePaginationProps<TData>) {
	const t = useI18n();

	const selectedCount = table.getFilteredSelectedRowModel().rows.length;
	const totalCount = table.getFilteredRowModel().rows.length;
	const thisPage = table.getState().pagination.pageIndex + 1;
	const pageCount = table.getPageCount();
	return (
		<div className="flex flex-col md:flex-row-reverse md:items-center gap-2 justify-between md:px-2">
			<div className="flex justify-between items-center space-x-6 lg:space-x-8">
				<div className="flex items-center gap-2">
					<p className="hidden md:block text-sm font-medium">
						{t("components.table.pagination.rowsPerPage")}
					</p>
					<Select
						value={`${table.getState().pagination.pageSize}`}
						onValueChange={(value) => table.setPageSize(Number(value))}
					>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={table.getState().pagination.pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40, 50].map((pageSize) => (
								<SelectItem key={pageSize} value={`${pageSize}`}>
									{pageSize}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="hidden md:flex w-[100px] items-center justify-center text-sm font-medium">
					{
						// @ts-ignore
						t("components.table.pagination.pageIndex", {
							thisPage: thisPage,
							pageCount: pageCount,
						})
					}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(0)}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">
							{t("components.table.pagination.firstPage")}
						</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.previousPage()}
						disabled={!table.getCanPreviousPage()}
					>
						<span className="sr-only">
							{t("components.table.pagination.previousPage")}
						</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0"
						onClick={() => table.nextPage()}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">
							{t("components.table.pagination.nextPage")}
						</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex"
						onClick={() => table.setPageIndex(table.getPageCount() - 1)}
						disabled={!table.getCanNextPage()}
					>
						<span className="sr-only">
							{t("components.table.pagination.lastPage")}
						</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
			<div className="flex-1 text-sm text-muted-foreground">
				{
					// @ts-ignore
					t("components.table.pagination.rowsSelected", {
						rowSelected: selectedCount,
						rowCount: totalCount,
					})
				}
			</div>
		</div>
	);
}
