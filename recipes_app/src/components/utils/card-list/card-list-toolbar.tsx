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
			<div className="relative max-w-md flex items-center">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
				<Input
					placeholder={t("components.cardList.toolbar.search")}
					value={searchTerm}
					onChange={(e) => onSearchChange(e.target.value)}
					className="px-10 h-8 md:w-[150px] lg:w-[250px]"
				/>
				{searchTerm.length > 0 && (
					<Button
						variant="ghost"
						onClick={() => onSearchChange("")}
						className="absolute right-0 h-8 px-2 lg:px-3"
					>
						<X />
					</Button>
				)}
			</div>
		</div>
	);
}
