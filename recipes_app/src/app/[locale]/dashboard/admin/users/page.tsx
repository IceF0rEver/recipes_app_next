"use server";
import { headers } from "next/headers";
import { Suspense } from "react";
import { ErrorBoundary } from "react-error-boundary";
import UsersTable from "@/app/[locale]/dashboard/admin/users/_components/users-table";
import { getI18n } from "@/locales/server";
import { getUsersList } from "./_components/_serveractions/actions";

export default async function Page() {
	const t = await getI18n();
	const header = await headers();

	const datasTable = getUsersList(header);

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
			key: "email",
			value: t("components.table.email"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "emailVerified",
			value: t("components.table.emailVerified"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
		{
			key: "name",
			value: t("components.table.name"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "image",
			value: t("components.table.image"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
		{
			key: "role",
			value: t("components.table.role"),
			subItems: [
				{ value: "user", label: t("components.table.roles.user") },
				{ value: "premium", label: t("components.table.roles.premium") },
				{ value: "admin", label: t("components.table.roles.admin") },
			],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "banned",
			value: t("components.table.banned"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: true,
		},
		{
			key: "banReason",
			value: t("components.table.banReason"),
			subItems: [],
			enableSorting: true,
			enableHiding: true,
			initialStateVisibility: false,
		},
		{
			key: "banExpires",
			value: t("components.table.banExpires"),
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
		<ErrorBoundary fallback={<div>Something went wrong</div>}>
			<Suspense fallback={<div>Loading...</div>}>
				<UsersTable datasTable={datasTable} columnsItems={columnsItems} />
			</Suspense>
		</ErrorBoundary>
	);
}
