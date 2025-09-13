import type { UserWithRole } from "better-auth/plugins";
import type { ItemTableProps } from "@/types/react-table";

export interface UsersTableProps {
	datasTable: Promise<{
		users: UserWithRole[];
		total: number;
		limit?: number;
		offset?: number;
	}>;
	columnsItems: ItemTableProps[];
}
