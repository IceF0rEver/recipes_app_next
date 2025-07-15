import type { UserWithRole } from "better-auth/plugins";
import type { ComponentType } from "react";

export interface UsersTableProps {
	datasTable: Promise<{
		users: UserWithRole[];
		total: number;
		limit?: number;
		offset?: number;
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
