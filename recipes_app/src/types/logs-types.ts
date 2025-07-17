import type { ComponentType } from "react";
import type { Log } from "@/generated/prisma";

export interface LogsTableProps {
	datasTable: Promise<{
		logs: Log[];
	}>;
	columnsItems: ItemTableProps[];
}

export interface ItemTableProps {
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
