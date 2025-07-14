"use client";

import type { ReactElement } from "react";
import { Separator } from "@/components/ui/separator";
import {
	Sheet,
	SheetContent,
	SheetDescription,
	SheetFooter,
	SheetHeader,
	SheetTitle,
} from "@/components/ui/sheet";

interface GenericSheetProps {
	sheetOpen: boolean;
	onSheetOpen: (sheetOpen: boolean) => void;
	children: ReactElement;
	title?: string;
	description?: string;
	footer?: ReactElement;
}
export default function GenericSheet({
	sheetOpen,
	onSheetOpen,
	children,
	title = "",
	description = "",
	footer,
}: GenericSheetProps) {
	return (
		<Sheet open={sheetOpen} onOpenChange={onSheetOpen}>
			<SheetContent>
				<SheetHeader>
					<SheetTitle>{title}</SheetTitle>
					<SheetDescription>{description}</SheetDescription>
					<Separator className="my-2" />
				</SheetHeader>
				{children}
			</SheetContent>
			<SheetFooter>{footer}</SheetFooter>
		</Sheet>
	);
}
