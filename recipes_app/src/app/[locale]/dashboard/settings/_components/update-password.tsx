"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import { useCallback, useState } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import { type string, z } from "zod";
import AuthButton from "@/components/utils/auth/auth-button";
import AuthField from "@/components/utils/auth/auth-field";
import AuthForm from "@/components/utils/auth/auth-form";
import { authClient } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

interface UpdatePasswordProps {
	onOpenChange?: (open: boolean) => void;
}

export default function UpdatePassword({ onOpenChange }: UpdatePasswordProps) {
	const t = useI18n();

	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

	const updatePasswordSchema = authSchemas(t).updatePassword;
	type UpdatePasswordType = z.infer<typeof updatePasswordSchema>;
	const form = useForm<UpdatePasswordType>({
		resolver: zodResolver(updatePasswordSchema),
		defaultValues: {
			password: "",
			passwordConfirmation: "",
			currentPassword: "",
		},
	});

	const onSubmit = useCallback(
		async (values: UpdatePasswordType) => {
			try {
				const validatedData = updatePasswordSchema.parse({
					password: values.password,
					currentPassword: values.currentPassword,
					passwordConfirmation: values.passwordConfirmation,
				});
				await authClient.changePassword(
					{
						newPassword: validatedData.password,
						currentPassword: validatedData.currentPassword,
						revokeOtherSessions: true,
					},
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
							onOpenChange?.(false);
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
		[t, onOpenChange, updatePasswordSchema],
	);
	return (
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
				label={t("components.auth.form.currentPassword.label")}
				placeholder={t("components.auth.form.currentPassword.placeholder")}
				control={form.control}
				name="currentPassword"
				type="password"
			/>
			<AuthField
				label={t("components.auth.form.newPassword.label")}
				placeholder={t("components.auth.form.newPassword.placeholder")}
				control={form.control}
				name="password"
				type="password"
			/>
			<AuthField
				label={t("components.auth.form.newPasswordConfirmation.label")}
				placeholder={t(
					"components.auth.form.newPasswordConfirmation.placeholder",
				)}
				control={form.control}
				name="passwordConfirmation"
				type="password"
			/>
			<AuthButton isLoading={loading} label={t("button.update")} />
		</AuthForm>
	);
}
