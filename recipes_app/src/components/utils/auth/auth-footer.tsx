"use client";

import Link from "next/link";
import type { AuthFooterProps } from "@/types/auth-types";

export default function AuthFooter({ href, text, label }: AuthFooterProps) {
	return (
		<span className="text-center text-sm text-accent-foreground">
			{text}
			<Link href={href} className="font-medium text-primary">
				{label}
			</Link>
		</span>
	);
}
