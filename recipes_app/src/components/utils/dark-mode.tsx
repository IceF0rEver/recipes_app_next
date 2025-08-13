"use client";

import { MonitorCog, Moon, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Label } from "@/components/ui/label";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import { cn } from "@/lib/utils";

interface DarkModeProps {
	className?: string;
}

export default function DarkMode({ className }: DarkModeProps) {
	const [isMounted, setIsMounted] = useState(false);
	const { theme, setTheme } = useTheme();

	useEffect(() => {
		setIsMounted(true);
	}, []);

	const mods = [
		{ key: "light", icon: <Sun className="h-4 w-4" /> },
		{ key: "dark", icon: <Moon className="h-4 w-4" /> },
		{ key: "system", icon: <MonitorCog className="h-4 w-4" /> },
	];

	if (!isMounted)
		return (
			<div className={cn(className, "bg-muted w-[86px] h-7.5 rounded-full")} />
		);

	return (
		<div className={cn(className)}>
			<RadioGroup
				value={theme}
				onValueChange={setTheme}
				className="flex flex-row gap-1 border p-0.5 rounded-full max-w-max"
			>
				{mods?.map((item) => (
					<div key={item.key} className="flex items-center space-x-2">
						<RadioGroupItem
							value={item.key}
							id={item.key}
							className="sr-only"
						/>
						<Label
							htmlFor={item.key}
							className={`flex h-6 w-6 items-center justify-center rounded-full cursor-pointer ${
								theme === item.key ? "bg-primary" : "hover:bg-accent"
							}`}
						>
							{item.icon}
						</Label>
					</div>
				))}
			</RadioGroup>
		</div>
	);
}
