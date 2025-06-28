"use client";

import { useI18n } from "@/locales/client";
import { z, type string } from "zod";
import { useState } from "react";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthForm from "../auth/auth-form";
import AuthField from "../auth/auth-field";
import AuthButton from "../auth/auth-button";

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

	const onSubmit = async (values: UpdatePasswordType) => {
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
							betterError: t(`BASE_ERROR_CODES.${ctx.error.code}` as keyof typeof string),
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
	};
	return (
		<AuthForm form={form} onSubmit={onSubmit} className="grid gap-4">
			{errorMessage.betterError && (
				<p className="text-sm text-destructive" aria-live="polite" aria-atomic="true">
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
				placeholder={t("components.auth.form.newPasswordConfirmation.placeholder")}
				control={form.control}
				name="passwordConfirmation"
				type="password"
			/>
			<AuthButton isLoading={loading} label={t("button.update")} />
		</AuthForm>
	);
}
