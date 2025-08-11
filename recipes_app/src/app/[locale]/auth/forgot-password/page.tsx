"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type string, z } from "zod";
import AuthButton from "@/components/utils/auth/auth-button";
import AuthCard from "@/components/utils/auth/auth-card";
import AuthField from "@/components/utils/auth/auth-field";
import AuthFooter from "@/components/utils/auth/auth-footer";
import AuthForm from "@/components/utils/auth/auth-form";
import { authClient } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

export default function Page() {
	const t = useI18n();
	const router = useRouter();

	const [loading, setLoading] = useState<boolean>(false);

	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

	const forgotPasswordSchema = authSchemas(t).forgotPassword;
	type ForgotPasswordType = z.infer<typeof forgotPasswordSchema>;

	const form = useForm<ForgotPasswordType>({
		resolver: zodResolver(forgotPasswordSchema),
		defaultValues: {
			email: "",
		},
	});
	const onSubmit = useCallback(
		async (values: ForgotPasswordType) => {
			try {
				const validatedData = forgotPasswordSchema.parse({
					email: values.email,
				});

				await authClient.forgetPassword(
					{ email: validatedData.email, redirectTo: "/auth/reset-password" },
					{
						onRequest: () => {
							setLoading(true);
						},
						onResponse: () => {
							setLoading(false);
						},
						onError: (ctx) => {
							setErrorMessage({
								betterError: t(
									`BASE_ERROR_CODES.${ctx.error.code}` as keyof typeof string,
								),
							});
						},
						onSuccess: async () => {
							toast.success(t("components.auth.forgetPassword.toast.success"));
							router.push("/auth/login");
						},
					},
				);
			} catch (error) {
				if (error instanceof z.ZodError) {
					console.error(error);
				}
				setLoading(false);
			}
		},
		[router, t, forgotPasswordSchema],
	);
	return (
		<AuthCard
			title={t("components.auth.forgetPassword.title")}
			description={t("components.auth.forgetPassword.description")}
			className="w-full sm:w-sm"
			footer={
				<AuthFooter
					href={"/auth/login"}
					text={t("components.auth.link.login")}
					label={t("button.login")}
				/>
			}
		>
			<AuthForm form={form} onSubmit={onSubmit} className="grid gap-4">
				{errorMessage.betterError && (
					<p
						className="text-sm text-destructive"
						aria-live="polite"
						aria-atomic="true"
					>
						{errorMessage.betterError}
					</p>
				)}
				<AuthField
					label={t("components.auth.form.email.label")}
					placeholder={t("components.auth.form.email.placeholder")}
					control={form.control}
					name="email"
					type="email"
				/>
				<AuthButton isLoading={loading} label={t("button.send")} />
			</AuthForm>
		</AuthCard>
	);
}
