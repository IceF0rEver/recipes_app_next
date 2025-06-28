"use client";

import { cn } from "@/lib/utils";

interface SettingsArticleProps {
	children: React.ReactNode;
	label: string;
	description?: string;
	className?: string;
}

export default function SettingsArticle({ children, label, description, className }: SettingsArticleProps) {
	return (
		<article className={cn(className)}>
			<div className="flex flex-row gap-2">
				<p className="my-auto">{label} :</p>
				{children}
			</div>
			<p className="text-sm opacity-60">{description}</p>
		</article>
	);
}
