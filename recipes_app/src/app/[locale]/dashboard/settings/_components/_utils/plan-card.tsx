"use client";

import { Check, Star } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import {
	Card,
	CardContent,
	CardDescription,
	CardFooter,
	CardHeader,
	CardTitle,
} from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { useI18n } from "@/locales/client";

interface PlanCardProps {
	title: string;
	description: string;
	amount: string;
	itemsContent?: string[] | null;
	enableBadge?: boolean;
	badgeLabel?: string;
	children: React.ReactNode;
}
export default function PlanCard({
	title,
	amount,
	description,
	itemsContent,
	enableBadge = false,
	badgeLabel,
	children,
}: PlanCardProps) {
	const t = useI18n();
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
				<div className="mt-4">
					<span className="text-4xl font-bold">{amount}</span>
					<span className="text-muted-foreground">
						{t("components.plan.month")}
					</span>
				</div>
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
			<CardFooter>{children}</CardFooter>
		</Card>
	);
}
