"use client";

import { useRouter, useSearchParams } from "next/navigation";
import type React from "react";
import { useEffect, useMemo, useState } from "react";
import {
	List,
	ListBody,
	ListFooter,
	ListHeader,
	ListHeaderTitle,
	ListItem,
} from "@/components/utils/card-list/ui/list";
import CardListPagination from "./card-list-pagination";
import CardListToolbar from "./card-list-toolbar";

interface CardsListProps<T> {
	data: T[];
	card: (item: T) => React.ReactNode;
	title?: string;
	enablePagination?: boolean;
	enableToolBar?: boolean;
	emptyMessage: string;
	cardWidth?: string;
}

export function CardsList<T>({
	data,
	card,
	title,
	enablePagination = false,
	enableToolBar = false,
	emptyMessage,
	cardWidth = "320",
}: CardsListProps<T>) {
	const searchParams = useSearchParams();
	const router = useRouter();

	const [searchTerm, setSearchTerm] = useState(
		searchParams.get("search") || "",
	);

	const [currentPage, setCurrentPage] = useState(
		Number(searchParams.get("page")) || 1,
	);
	const [pageSize, setPageSize] = useState(
		Number(searchParams.get("pageSize")) || 10,
	);

	useEffect(() => {
		const params = new URLSearchParams(searchParams.toString());

		searchTerm ? params.set("search", searchTerm) : params.delete("search");

		currentPage !== 0
			? params.set("page", String(currentPage))
			: params.delete("page");

		pageSize !== 0
			? params.set("pageSize", String(pageSize))
			: params.delete("pageSize");

		router.replace(`?${params.toString()}`, { scroll: false });
	}, [searchTerm, currentPage, pageSize, router, searchParams]);

	const filteredData = useMemo(() => {
		if (!searchTerm.trim()) return data;
		return data.filter((item) =>
			JSON.stringify(item).toLowerCase().includes(searchTerm.toLowerCase()),
		);
	}, [data, searchTerm]);

	const paginatedData = useMemo(() => {
		if (!enablePagination) return filteredData;

		const startIndex = (currentPage - 1) * pageSize;
		return filteredData.slice(startIndex, startIndex + pageSize);
	}, [filteredData, currentPage, pageSize, enablePagination]);

	const totalPages =
		filteredData.length > 0 ? Math.ceil(filteredData.length / pageSize) : 1;

	// biome-ignore lint/correctness/useExhaustiveDependencies: more dependencies
	useEffect(() => {
		setCurrentPage(1);
	}, [searchTerm]);

	const displayData = enablePagination ? paginatedData : filteredData;

	return (
		<List>
			<ListHeader>
				<ListHeaderTitle>{title}</ListHeaderTitle>
				{enableToolBar && (
					<CardListToolbar
						searchTerm={searchTerm}
						onSearchChange={setSearchTerm}
					/>
				)}
			</ListHeader>

			<ListBody cardWidth={cardWidth}>
				{displayData.length > 0 ? (
					displayData.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: index for key
						<ListItem key={index}>{card(item)}</ListItem>
					))
				) : (
					<ListItem>
						<p className="text-muted-foreground text-center">{emptyMessage}</p>
					</ListItem>
				)}
			</ListBody>

			{enablePagination && (
				<ListFooter>
					<CardListPagination
						currentPage={currentPage}
						totalPages={totalPages}
						pageSize={pageSize}
						totalItems={filteredData.length}
						onPageChange={setCurrentPage}
						onPageSizeChange={(newSize) => {
							setPageSize(newSize);
							setCurrentPage(1);
						}}
					/>
				</ListFooter>
			)}
		</List>
	);
}
