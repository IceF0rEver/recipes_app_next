import type { SessionWithImpersonatedBy } from "better-auth/plugins";
import type { ItemTableProps } from "@/types/react-table";

export interface SessionsTableProps {
	datasTable: Promise<{
		sessions: SessionWithImpersonatedBy[];
		error?: { code?: string; message?: string; status?: number };
	}>;
	columnsItems: ItemTableProps[];
}
