"use client";

import type * as React from "react";
import { cn } from "@/lib/utils";

interface ListBodyProps extends React.ComponentProps<"section"> {
	cardWidth?: string;
}

function List({ className, ...props }: React.ComponentProps<"div">) {
	return <div data-slot="list-container" className={cn("space-y-6", className)} {...props} />;
}

function ListHeader({ className, ...props }: React.ComponentProps<"header">) {
	return <header data-slot="list-header" className={cn("flex flex-col gap-4", className)} {...props} />;
}

function ListHeaderTitle({ className, ...props }: React.ComponentProps<"h2">) {
	return (
		<h2
			data-slot="list-header-title"
			className={cn("text-2xl font-semibold text-foreground", className)}
			{...props}
		/>
	);
}

function ListBody({ className, cardWidth, ...props }: ListBodyProps) {
	const gridCols = `repeat(auto-fit,${cardWidth}px)`;

	return (
		<section
			data-slot="list-body"
			className={cn("grid gap-4 sm:gap-6 justify-evenly", className)}
			style={{ gridTemplateColumns: gridCols }}
			{...props}
		/>
	);
}
function ListItem({ className, ...props }: React.ComponentProps<"article">) {
	return (
		<article
			data-slot="list-item"
			className={cn("flex items-center justify-center min-h-40", className)}
			{...props}
		/>
	);
}

function ListFooter({ className, ...props }: React.ComponentProps<"footer">) {
	return <footer data-slot="list-footer" className={cn("mt-6", className)} {...props} />;
}

export { List, ListHeader, ListHeaderTitle, ListBody, ListItem, ListFooter };
