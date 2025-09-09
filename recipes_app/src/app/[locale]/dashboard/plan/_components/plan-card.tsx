"use client";

import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface PlanCardProps {
	title: string;
	description: string;
	itemsContent?: string[] | null;
	enableBadge?: boolean;
	badgeLabel?: string;
	buttonLabel?: string;
	disableButton?: boolean;
	buttonHandleAction?: () => void;
	children: React.ReactNode;
}
export default function PlanCard({
	title,
	description,
	itemsContent,
	enableBadge = false,
	badgeLabel,
	buttonLabel,
	disableButton = false,
	buttonHandleAction,
	children,
}: PlanCardProps) {
	return (
		<Card
			className={cn(
				enableBadge && "border-primary",
				"relative shadow-lg scale-105",
			)}
		>
			{enableBadge && (
				<Badge className="absolute -top-3 left-1/2 transform -translate-x-1/2 bg-primary text-primary-foreground">
					<Star className="h-4 w-4 mr-1" />
					{badgeLabel}
				</Badge>
			)}
			<CardHeader>
				<CardTitle className="text-2xl">{title}</CardTitle>
				<CardDescription>{description}</CardDescription>
				{children}
			</CardHeader>
			<CardContent className="h-full">
				<ul className="space-y-3">
					{itemsContent?.map((item, index) => (
						// biome-ignore lint/suspicious/noArrayIndexKey: index for key
						<li key={index} className="flex items-center gap-3">
							<Check className="h-5 w-5 text-primary flex-shrink-0" />
							<span className="text-sm">{item}</span>
						</li>
					))}
				</ul>
			</CardContent>
			<CardFooter>
				<Button
					variant={!enableBadge ? "outline" : "default"}
					disabled={disableButton}
					className="w-full"
					size="lg"
					onClick={buttonHandleAction}
				>
					{buttonLabel}
				</Button>
			</CardFooter>
		</Card>
	);
}
