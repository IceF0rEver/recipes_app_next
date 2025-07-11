"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Pencil, Trash2 } from "lucide-react";
import Link from "next/link";
import type { ComponentType } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuRadioGroup,
	DropdownMenuRadioItem,
	DropdownMenuSeparator,
	DropdownMenuSub,
	DropdownMenuSubContent,
	DropdownMenuSubTrigger,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

type ActionType = "edit" | "delete" | "link" | "select";

interface RowAction<TData> {
	key: string;
	label: string;
	type: ActionType;
	url?: string;
	separator?: boolean;
	icon?: ComponentType<{ className?: string }>;
	subItems?: {
		key: string;
		label: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
	onAction?: (value: TData) => void;
}

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	actions: RowAction<TData>[];
}

export function DataTableRowActions<TData>({ row, actions }: DataTableRowActionsProps<TData>) {
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button variant="ghost" className="flex h-8 w-8 p-0 data-[state=open]:bg-muted">
					<MoreHorizontal />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				{actions.map((action) => {
					if (action.type === "link" && action.url) {
						const href = `${(row.original as { id: string }).id}${action.url}`;
						return (
							<div key={action.key}>
								{action.separator && <DropdownMenuSeparator />}
								<Link href={href}>
									<DropdownMenuItem>{action.label}</DropdownMenuItem>
								</Link>
							</div>
						);
					}

					if (action.type === "select") {
						return (
							<DropdownMenuSub key={action.key}>
								{action.separator && <DropdownMenuSeparator />}
								<DropdownMenuSubTrigger>{action.label}</DropdownMenuSubTrigger>
								<DropdownMenuSubContent>
									<DropdownMenuRadioGroup value={(row.original as { role: string }).role}>
										{action.subItems?.map((item) => (
											<DropdownMenuRadioItem key={item.key} value={item.key}>
												{item.label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						);
					}

					if (action.type === "edit" || action.type === "delete") {
						return (
							<div key={action.key}>
								{action.separator && <DropdownMenuSeparator />}
								<DropdownMenuItem
									onClick={() => action.onAction?.(row.original)}
									className={
										action.type === "delete" ? "text-destructive focus:text-destructive" : ""
									}
								>
									{action.type === "delete" && <Trash2 className="text-destructive h-4 w-4" />}
									{action.type === "edit" && <Pencil className="h-4 w-4" />}
									{action.label}
								</DropdownMenuItem>
							</div>
						);
					}

					return null;
				})}
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
