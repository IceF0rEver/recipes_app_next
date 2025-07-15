"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { usePathname } from "next/navigation";
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

type ActionType = "sheet" | "delete" | "link" | "select";

interface SubItems {
	key: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
}

interface RowAction<TData> {
	key: string;
	label: string;
	type: ActionType;
	url?: string;
	separator?: boolean;
	icon?: ComponentType<{ className?: string }>;
	subItems?: SubItems[];
	onAction?: (value: TData, selectedKey?: SubItems) => void;
}

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	actions: RowAction<TData>[];
}

export function DataTableRowActions<TData>({
	row,
	actions,
}: DataTableRowActionsProps<TData>) {
	const pathname = usePathname();
	return (
		<DropdownMenu modal={false}>
			<DropdownMenuTrigger asChild>
				<Button
					variant="ghost"
					className="flex h-8 w-8 p-0 data-[state=open]:bg-muted"
				>
					<MoreHorizontal />
					<span className="sr-only">Open menu</span>
				</Button>
			</DropdownMenuTrigger>
			<DropdownMenuContent align="end" className="w-[160px]">
				{actions.map((action) => {
					if (action.type === "link" && action.url) {
						const href = `${pathname}/${(row.original as { id: string }).id}${action.url}`;
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
									<DropdownMenuRadioGroup
										value={(row.original as { role: string }).role}
									>
										{action.subItems?.map((item) => (
											<DropdownMenuRadioItem
												key={item.key}
												onClick={() => action.onAction?.(row.original, item)}
												value={item.key}
											>
												{item.label}
											</DropdownMenuRadioItem>
										))}
									</DropdownMenuRadioGroup>
								</DropdownMenuSubContent>
							</DropdownMenuSub>
						);
					}

					if (action.type === "sheet" || action.type === "delete") {
						return (
							<div key={action.key}>
								{action.separator && <DropdownMenuSeparator />}
								<DropdownMenuItem
									onClick={() => action.onAction?.(row.original)}
									className={
										action.type === "delete"
											? "text-destructive focus:text-destructive"
											: ""
									}
								>
									{action.type === "delete" && (
										<Trash2 className="text-destructive h-4 w-4" />
									)}
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
