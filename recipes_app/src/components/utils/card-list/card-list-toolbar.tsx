"use client";

import { Search, X } from "lucide-react";
import { useEffect, useState } from "react";
import { useDebounce } from "use-debounce";
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
	const [text, setText] = useState(searchTerm);
	const [debouncedText] = useDebounce(text, 300);

	// biome-ignore lint/correctness/useExhaustiveDependencies: more dependencies
	useEffect(() => {
		onSearchChange(debouncedText);
	}, [debouncedText]);

	return (
		<div className="flex flex-col md:flex-row gap-4 w-full md:flex-1">
			<div className="relative max-w-md flex items-center">
				<Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-muted-foreground h-4 w-4" />
				<Input
					placeholder={t("components.cardList.toolbar.search")}
					value={text}
					onChange={(e) => setText(e.target.value)}
					className="px-10 h-8 md:w-[150px] lg:w-[250px]"
				/>
				{text.length > 0 && (
					<Button
						variant="ghost"
						onClick={() => setText("")}
						className="absolute right-0 h-8 px-2 lg:px-3"
					>
						<X />
					</Button>
				)}
			</div>
		</div>
	);
}
