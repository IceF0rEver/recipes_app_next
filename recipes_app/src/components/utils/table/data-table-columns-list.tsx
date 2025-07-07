"use client";

import type { Column, ColumnDef, Row } from "@tanstack/react-table";

import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import type { ItemTableProps } from "@/types/auth-types";
import { DataTableColumnHeader } from "./data-table-columns-header";
import { DataTableRowActions } from "./data-table-row-action";

export const dataTableColumnList = <T extends object>(
	items: ItemTableProps[],
	onEdit: (value?: T) => void,
	onDelete: (value?: T) => void,
	links?: { key: string; label: string; url: string }[],
): ColumnDef<T>[] => [
	{
		id: "select",
		header: ({ table }) => (
			<Checkbox
				checked={
					table.getIsAllPageRowsSelected() ||
					(table.getIsSomePageRowsSelected() && "indeterminate")
				}
				onCheckedChange={(value) => table.toggleAllPageRowsSelected(!!value)}
				aria-label="Select all"
				className="translate-y-[2px]"
			/>
		),
		cell: ({ row }) => (
			<Checkbox
				checked={row.getIsSelected()}
				onCheckedChange={(value) => row.toggleSelected(!!value)}
				aria-label="Select row"
				className="translate-y-[2px]"
			/>
		),
		enableSorting: false,
		enableHiding: false,
	},

	...items.map((item: ItemTableProps) => ({
		accessorKey: item.key,
		header: ({ column }: { column: Column<T, unknown> }) => (
			<DataTableColumnHeader column={column} title={item.value} />
		),
		cell: ({ row }: { row: Row<T> }) => {
			if (item.subItems && item.subItems.length > 0) {
				const cellValue = row.getValue(item.key);
				const matched = item.subItems?.find((sub) => sub.value === cellValue);

				if (!matched) return null;

				return (
					<div className="flex items-center">
						<Badge variant={"outline"}>{matched.label}</Badge>
					</div>
				);
			}

			return <div>{row.getValue(item.key)}</div>;
		},
		enableSorting: item.enableSorting,
		enableHiding: item.enableHiding,
		meta: {
			label: item.value,
			subItems: item.subItems,
			initialStateVisibility: item.initialStateVisibility ?? true,
		},
	})),

	{
		id: "actions",
		cell: ({ row }) => (
			<DataTableRowActions
				row={row}
				onEdit={onEdit}
				onDelete={onDelete}
				links={links}
			/>
		),
	},
];
