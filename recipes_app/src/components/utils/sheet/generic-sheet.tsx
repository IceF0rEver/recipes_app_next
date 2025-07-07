"use client";

import type { ReactElement } from "react";
import { Separator } from "@/components/ui/separator";
import { Sheet, SheetContent, SheetDescription, SheetHeader, SheetTitle } from "@/components/ui/sheet";
import { useI18n } from "@/locales/client";

interface GenericSheetProps {
	sheetOpen: boolean;
	onSheetOpen: (sheetOpen: boolean) => void;
	type: "edit" | "add";
	children: ReactElement;
	title?: string;
	description?: string;
}
export default function GenericSheet({
	sheetOpen,
	onSheetOpen,
	type = "edit",
	children,
	title = "",
	description = "",
}: GenericSheetProps) {
	const t = useI18n();

	const defaultTitle =
		type === "edit"
			? t("components.utils.sheet.title.edit") + title
			: t("components.utils.sheet.title.add") + title;

	const defaultDescription =
		type === "edit"
			? t("components.utils.sheet.description.edit") + description
			: t("components.utils.sheet.description.add") + description;
	return (
		<Sheet open={sheetOpen} onOpenChange={onSheetOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{defaultTitle}</SheetTitle>
					<SheetDescription>{defaultDescription}</SheetDescription>
					<Separator className="my-2" />
				</SheetHeader>
				{children}
			</SheetContent>
		</Sheet>
	);
}
