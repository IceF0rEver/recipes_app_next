import type { Log } from "@/generated/prisma";
import type { ItemTableProps } from "@/types/react-table";

export interface LogsTableProps {
	datasTable: Promise<{
		logs: Log[];
	}>;
	columnsItems: ItemTableProps[];
}
