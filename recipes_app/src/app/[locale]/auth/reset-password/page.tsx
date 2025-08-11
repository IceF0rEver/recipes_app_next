"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type string, z } from "zod";
import AuthButton from "@/components/utils/auth/auth-button";
import AuthCard from "@/components/utils/auth/auth-card";
import AuthField from "@/components/utils/auth/auth-field";
import AuthForm from "@/components/utils/auth/auth-form";
import { authClient } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

export default function Page() {
	const t = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
	const token = searchParams.get("token");

	const resetPasswordSchema = authSchemas(t).resetPassword;
	type ResetPasswordType = z.infer<typeof resetPasswordSchema>;
	const form = useForm<ResetPasswordType>({
		resolver: zodResolver(resetPasswordSchema),
		defaultValues: {
			password: "",
			passwordConfirmation: "",
		},
	});

	const onSubmit = useCallback(
		async (values: ResetPasswordType) => {
			try {
				const validatedData = resetPasswordSchema.parse({
					password: values.password,
					passwordConfirmation: values.passwordConfirmation,
				});
				await authClient.resetPassword(
					{ newPassword: validatedData.password, token: token as string },
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
							toast.success(t("components.auth.resetPassword.toast.success"));
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
		[t, router, token, resetPasswordSchema],
	);

	return (
		<AuthCard
			title={t("components.auth.resetPassword.title")}
			description={t("components.auth.resetPassword.description")}
			className="w-full sm:w-sm"
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
					label={t("components.auth.form.newPassword.label")}
					placeholder={t("components.auth.form.newPassword.placeholder")}
					control={form.control}
					name="password"
					type="password"
				/>
				<AuthField
					label={t("components.auth.form.confirmNewPassword.label")}
					placeholder={t("components.auth.form.confirmNewPassword.placeholder")}
					control={form.control}
					name="passwordConfirmation"
					type="password"
				/>
				<AuthButton isLoading={loading} label={t("button.update")} />
			</AuthForm>
		</AuthCard>
	);
}
