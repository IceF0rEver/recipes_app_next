"use client";

import type { Column, ColumnDef, Row } from "@tanstack/react-table";
import type { ComponentType } from "react";
import { Badge } from "@/components/ui/badge";
import { Checkbox } from "@/components/ui/checkbox";
import { DataTableColumnHeader } from "./data-table-columns-header";
import { DataTableRowActions } from "./data-table-row-action";

interface ItemTableProps {
	key: string;
	value: string;
	subItems?: {
		value: string;
		label: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
	enableSorting: boolean;
	enableHiding: boolean;
	initialStateVisibility: boolean;
}

interface ActionItemTableProps<TData> {
	key: string;
	label: string;
	type: "edit" | "delete" | "link" | "select";
	url?: string;
	separator?: boolean;
	icon?: ComponentType<{ className?: string }>;
	subItems?: {
		key: string;
		label: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
	onAction?: (
		value: TData,
		selectedKey?: {
			key: string;
			label: string;
			icon?: ComponentType<{ className?: string }>;
		},
	) => void;
}

export const dataTableColumnList = <TData extends Record<string, unknown>>(
	items: ItemTableProps[],
	actions: ActionItemTableProps<TData>[],
): ColumnDef<TData>[] => [
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
		header: ({ column }: { column: Column<TData, unknown> }) => (
			<DataTableColumnHeader column={column} title={item.value} />
		),
		cell: ({ row }: { row: Row<TData> }) => {
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
		cell: ({ row }) => <DataTableRowActions row={row} actions={actions} />,
	},
];
