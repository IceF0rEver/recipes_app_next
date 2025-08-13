"use client";

import { Loader2 } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";
import type { string } from "zod";
import { Button } from "@/components/ui/button";
import { signIn } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import type { AuthButtonProps } from "@/types/auth-types";

export default function AuthButton({
	type = "submit",
	variant = "default",
	className,
	label,
	isSocial = false,
	socialProvider = "google",
	isLoading = false,
}: AuthButtonProps) {
	const router = useRouter();
	const t = useI18n();

	const [loading, setLoading] = useState<boolean>(isLoading);

	const handleSubmitSocial = async () => {
		await signIn.social(
			{
				provider: socialProvider,
				callbackURL: "/dashboard",
			},
			{
				onRequest: () => {
					setLoading(true);
				},
				onResponse: () => {
					setLoading(false);
				},
				onError: (ctx) => {
					console.error({
						betterError: t(
							`BASE_ERROR_CODES.${ctx.error.code}` as keyof typeof string,
						),
					});
				},
				onSuccess: async () => {
					router.push("/dashboard");
				},
			},
		);
	};
	useEffect(() => {
		setLoading(isLoading);
	}, [isLoading]);

	return (
		<Button
			variant={variant}
			type={type}
			className={className}
			disabled={loading}
			onClick={isSocial === true ? () => handleSubmitSocial() : undefined}
		>
			{loading ? (
				<Loader2 size={16} className="animate-spin" />
			) : (
				<span>{label}</span>
			)}
		</Button>
	);
}
