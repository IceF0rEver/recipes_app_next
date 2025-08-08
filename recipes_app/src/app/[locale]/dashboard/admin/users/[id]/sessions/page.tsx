"use server";
import type { User } from "better-auth";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
// biome-ignore lint/suspicious/noShadowRestrictedNames: error name
import Error from "@/app/[locale]/dashboard/admin/(users)/users/error";
import Loading from "@/app/[locale]/dashboard/admin/(users)/users/loading";
import { getI18n } from "@/locales/server";
import { getUserSessionsList } from "./_components/_serveractions/actions";
import SessionsTable from "./_components/sessions-table";

interface PageProps {
	params: Promise<{ id: User["id"] }>;
}
export default async function Page({ params }: PageProps) {
	const t = await getI18n();
	const header = await headers();
	const { id } = await params;

	const datasTable = getUserSessionsList(header, id);

	const columnsItems = [
		{
			key: "id",
			value: t("components.table.id"),
			subItems: [],
			enableSorting: false,
			enableHiding: false,
			initialStateVisibility: true,
		},
		{
			key: "token",
			value: t("components.table.token"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "expiresAt",
			value: t("components.table.expiresAt"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
		{
			key: "ipAddress",
			value: t("components.table.ipAddress"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "userAgent",
			value: t("components.table.userAgent"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
		{
			key: "userId",
			value: t("components.table.userId"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "impersonatedBy",
			value: t("components.table.impersonatedBy"),
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
			initialStateVisibility: false,
		},
		{
			key: "updatedAt",
			value: t("components.table.updatedAt"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
	];

	return (
		<ErrorBoundary fallback={<Error />}>
			<Suspense fallback={<Loading />}>
				<SessionsTable datasTable={datasTable} columnsItems={columnsItems} />
			</Suspense>
		</ErrorBoundary>
	);
}
