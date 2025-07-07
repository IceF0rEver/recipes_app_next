"use client";

import type { Row } from "@tanstack/react-table";
import { MoreHorizontal, Trash2 } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuSeparator,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useI18n } from "@/locales/client";

interface DataTableRowActionsProps<TData> {
	row: Row<TData>;
	onEdit: (value: TData) => void;
	onDelete: (value: TData) => void;
	links?: { key: string; label: string; url: string }[];
}

export function DataTableRowActions<TData>({
	row,
	onEdit,
	onDelete,
	links,
}: DataTableRowActionsProps<TData>) {
	const t = useI18n();
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
				<DropdownMenuItem onClick={() => onEdit(row.original)}>
					{t("button.edit")}
				</DropdownMenuItem>
				{links && (
					<div>
						<DropdownMenuSeparator />
						{links.map((link) => (
							<Link
								href={`${(row.original as { id: string }).id}${link.url}`}
								key={link.url}
							>
								<DropdownMenuItem>{link.label}</DropdownMenuItem>
							</Link>
						))}
						<DropdownMenuSeparator />
					</div>
				)}
				<DropdownMenuItem
					onClick={() => onDelete(row.original)}
					className="text-destructive focus:text-destructive"
				>
					<Trash2 className="text-destructive" />
					{t("button.delete")}
				</DropdownMenuItem>
			</DropdownMenuContent>
		</DropdownMenu>
	);
}
