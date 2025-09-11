"use client";

import { Separator } from "@/components/ui/separator";

interface SettingsItemsHeaderProps {
	title: string;
	description: string;
}
export default function SettingsItemsHeader({ title, description }: SettingsItemsHeaderProps) {
	return (
		<header>
			<h2 className="text-xl font-bold">{title}</h2>
			<p className="py-2">{description}</p>
			<Separator className="my-4" />
		</header>
	);
}
