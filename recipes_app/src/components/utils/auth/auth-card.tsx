"use client";

import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import type { AuthCardProps } from "@/types/auth-types";

export default function AuthCard({
	title,
	description,
	children,
	footer,
	className,
}: AuthCardProps) {
	return (
		<Card className={cn("w-full", className)}>
			<CardHeader>
				<CardTitle className="text-lg md:text-xl">{title}</CardTitle>
				<CardDescription className="text-xs md:text-sm">
					{description}
				</CardDescription>
			</CardHeader>
			<CardContent>{children}</CardContent>
			{footer && (
				<CardFooter>
					<div className="flex justify-center w-full">{footer}</div>
				</CardFooter>
			)}
		</Card>
	);
}
