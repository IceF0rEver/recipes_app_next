"use client";

import { Search, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { useI18n } from "@/locales/client";

interface CardListToolbarProps {
	searchTerm: string;
	onSearchChange: (value: string) => void;
}

export default function CardListToolbar({
	searchTerm,
	onSearchChange,
}: CardListToolbarProps) {
	const t = useI18n();
	return (
		<div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
			<div className="relative flex-1 max-w-md">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
				<Input
					placeholder={t("components.cardList.toolbar.search")}
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="pl-10 h-8"
				/>
			</div>
			{searchTerm.length > 0 && (
				<Button
					type="button"
					variant="outline"
					onClick={() => onSearchChange("")}
					className="h-8 px-3 bg-transparent"
				>
					<X className="h-4 w-4" />
				</Button>
			)}
		</div>
	);
}
