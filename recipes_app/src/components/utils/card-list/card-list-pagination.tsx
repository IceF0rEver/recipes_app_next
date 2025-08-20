"use client";

import { ChevronLeft, ChevronRight, ChevronsLeft, ChevronsRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { useI18n } from "@/locales/client";

interface CardListPaginationProps {
	currentPage: number;
	totalPages: number;
	pageSize: number;
	totalItems: number;
	onPageChange: (page: number) => void;
	onPageSizeChange: (size: number) => void;
}

export default function CardListPagination({
	currentPage,
	totalPages,
	pageSize,
	totalItems,
	onPageChange,
	onPageSizeChange,
}: CardListPaginationProps) {
	const t = useI18n();
	const canPreviousPage = currentPage > 1;
	const canNextPage = currentPage < totalPages;

	return (
		<div className="flex flex-col md:flex-row-reverse md:items-center gap-2 justify-between md:px-2">
			<div className="flex justify-between items-center space-x-6 lg:space-x-8">
				<div className="flex items-center gap-2">
					<p className="hidden md:block text-sm font-medium">{t("components.cardList.pagination.perPage")}</p>
					<Select value={`${pageSize}`} onValueChange={(value) => onPageSizeChange(Number(value))}>
						<SelectTrigger className="h-8 w-[70px]">
							<SelectValue placeholder={pageSize} />
						</SelectTrigger>
						<SelectContent side="top">
							{[10, 20, 30, 40].map((size) => (
								<SelectItem key={size} value={`${size}`}>
									{size}
								</SelectItem>
							))}
						</SelectContent>
					</Select>
				</div>
				<div className="hidden md:flex w-[100px] items-center justify-center text-sm font-medium">
					{t("components.cardList.pagination.page")}
					{currentPage}
					{t("components.cardList.pagination.on")}
					{totalPages}
				</div>
				<div className="flex items-center gap-2">
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
						onClick={() => onPageChange(1)}
						disabled={!canPreviousPage}
					>
						<span className="sr-only">{t("components.cardList.pagination.firstPage")}</span>
						<ChevronsLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0 bg-transparent"
						onClick={() => onPageChange(currentPage - 1)}
						disabled={!canPreviousPage}
					>
						<span className="sr-only">{t("components.cardList.pagination.previousPage")}</span>
						<ChevronLeft />
					</Button>
					<Button
						variant="outline"
						className="h-8 w-8 p-0 bg-transparent"
						onClick={() => onPageChange(currentPage + 1)}
						disabled={!canNextPage}
					>
						<span className="sr-only">{t("components.cardList.pagination.nextPage")}</span>
						<ChevronRight />
					</Button>
					<Button
						variant="outline"
						className="hidden h-8 w-8 p-0 lg:flex bg-transparent"
						onClick={() => onPageChange(totalPages)}
						disabled={!canNextPage}
					>
						<span className="sr-only">{t("components.cardList.pagination.lastPage")}</span>
						<ChevronsRight />
					</Button>
				</div>
			</div>
			<div className="flex-1 text-sm text-muted-foreground">
				{totalItems}
				{t("components.cardList.pagination.total")}
			</div>
		</div>
	);
}
