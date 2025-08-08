import type { SessionWithImpersonatedBy } from "better-auth/plugins";
import type { ComponentType } from "react";

export interface SessionsTableProps {
	datasTable: Promise<{
		sessions: SessionWithImpersonatedBy[];
		error?: { code?: string; message?: string; status?: number };
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
