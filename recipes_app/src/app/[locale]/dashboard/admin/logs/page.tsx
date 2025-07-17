"use server";

import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import { getI18n } from "@/locales/server";
import { getLogsList } from "./_components/_serveractions/actions";
import LogsTable from "./_components/logs-table";
// biome-ignore lint/suspicious/noShadowRestrictedNames: error name
import Error from "./error";
import Loading from "./loading";

export default async function Page() {
	const t = await getI18n();

	const datasTable = getLogsList();

	const columnsItems = [
		{
			key: "id",
			value: t("components.table.id"),
			subItems: [],
			enableSorting: false,
			enableHiding: false,
			initialStateVisibility: false,
		},
		{
			key: "userId",
			value: t("components.table.userIdAuthor"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "action",
			value: t("components.table.action"),
			subItems: [
				{ value: "USER_DELETE", label: t("components.table.logs.userDelete") },
				{
					value: "USER_SUSPEND",
					label: t("components.table.logs.userSuspend"),
				},
				{
					value: "USER_ACTIVATE",
					label: t("components.table.logs.userActivate"),
				},
				{ value: "ROLE_CHANGE", label: t("components.table.logs.roleChange") },
				{
					value: "SESSION_REVOKE",
					label: t("components.table.logs.sessionRevoke"),
				},
			],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "targetId",
			value: t("components.table.targetId"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "status",
			value: t("components.table.status"),
			subItems: [
				{ value: "SUCCESS", label: t("components.table.logs.success") },
				{ value: "FAILED", label: t("components.table.logs.failed") },
				{ value: "PENDING", label: t("components.table.logs.pending") },
			],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "metadata",
			value: t("components.table.metadata"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
		{
			key: "createdAt",
			value: t("components.table.createdAt"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "updatedAt",
			value: t("components.table.updatedAt"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
	];

	return (
		<ErrorBoundary fallback={<Error />}>
			<Suspense fallback={<Loading />}>
				<LogsTable datasTable={datasTable} columnsItems={columnsItems} />
			</Suspense>
		</ErrorBoundary>
	);
}
