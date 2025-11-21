"use client";

import { useRouter, useSearchParams } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { type string, z } from "zod";
import AuthButton from "@/components/utils/auth/auth-button";
import AuthCard from "@/components/utils/auth/auth-card";
import AuthField from "@/components/utils/auth/auth-field";
import AuthForm from "@/components/utils/auth/auth-form";
import { useGenericForm } from "@/hooks/use-form";
import { authClient } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

export default function Page() {
	const t = useI18n();
	const router = useRouter();
	const searchParams = useSearchParams();

	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});
	const token = searchParams.get("token");

	const resetPasswordSchema = authSchemas(t).resetPassword;

	const { form, onSubmit, isPending } = useGenericForm<
		z.infer<typeof resetPasswordSchema>
	>({
		schema: resetPasswordSchema,
		defaultValues: {
			password: "",
			passwordConfirmation: "",
		},
		onSubmit: useCallback(
			async (values: z.infer<typeof resetPasswordSchema>) => {
				try {
					const validatedData = resetPasswordSchema.parse({
						password: values.password,
						passwordConfirmation: values.passwordConfirmation,
					});
					await authClient.resetPassword(
						{ newPassword: validatedData.password, token: token as string },
						{
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
				}
			},
			[t, router, token, resetPasswordSchema],
		),
	});

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
				<AuthButton isLoading={isPending} label={t("button.update")} />
			</AuthForm>
		</AuthCard>
	);
}
