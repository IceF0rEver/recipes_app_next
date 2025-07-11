"use client";

import GenericSheet from "@/components/utils/sheet/generic-sheet";
import type { Auth } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

interface ManageUsersProps {
	sheetOpen: boolean;
	onSheetOpen: (sheetOpen: boolean) => void;
	type: "edit" | "add";
	userData: Auth | null;
}
export default function ManageUsers({ sheetOpen, onSheetOpen, type = "edit", userData }: ManageUsersProps) {
	const t = useI18n();
	return (
		<GenericSheet
			sheetOpen={sheetOpen}
			onSheetOpen={onSheetOpen}
			type={type}
			title={t("components.admin.users.name")}
			description={t("components.admin.users.name")}
		>
			<div>test</div>
		</GenericSheet>
	);
}
