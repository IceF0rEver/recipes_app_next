"use client";

import type { LucideProps } from "lucide-react";
import type { ForwardRefExoticComponent, RefAttributes } from "react";
import { Card, CardContent } from "@/components/ui/card";

interface AiQuickPromptsProps {
	prompts: {
		icon: ForwardRefExoticComponent<
			Omit<LucideProps, "ref"> & RefAttributes<SVGSVGElement>
		>;
		title: string;
		description: string;
		prompt: string;
	}[];
	onSubmit: (text: string) => void;
}
export default function AiQuickPrompts({
	prompts,
	onSubmit,
}: AiQuickPromptsProps) {
	return (
		<div className="flex justify-center">
			<div className="grid grid-cols-1 lg:grid-cols-2 gap-4 p-4 md:pt-12">
				{prompts.map((prompt, index) => (
					<Card
						// biome-ignore lint/suspicious/noArrayIndexKey: <index for key>
						key={index}
						className="w-full cursor-pointer transition-shadow hover:shadow shadow-xl rounded-xl py-5"
						onClick={() => onSubmit(prompt.prompt)}
					>
						<CardContent className="px-4">
							<div className="flex items-center gap-4">
								<div className="flex size-12 items-center justify-center rounded-lg bg-primary">
									<prompt.icon className="text-primary-foreground" />
								</div>
								<div className="flex-1">
									<h3 className="text-base font-semibold">{prompt.title}</h3>
									<p className="text-sm text-muted-foreground mt-1">
										{prompt.description}
									</p>
								</div>
							</div>
						</CardContent>
					</Card>
				))}
			</div>
		</div>
	);
}
