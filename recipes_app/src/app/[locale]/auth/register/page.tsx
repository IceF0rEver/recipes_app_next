"use client";

import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { type string, z } from "zod";
import AuthButton from "@/components/utils/auth/auth-button";
import AuthCard from "@/components/utils/auth/auth-card";
import AuthField from "@/components/utils/auth/auth-field";
import AuthFooter from "@/components/utils/auth/auth-footer";
import AuthForm from "@/components/utils/auth/auth-form";
import { useGenericForm } from "@/hooks/use-form";
import { signUp } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

export default function Page() {
	const t = useI18n();
	const router = useRouter();

	const signUpSchema = authSchemas(t).signUp;
	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

	const { form, onSubmit, isPending } = useGenericForm<
		z.infer<typeof signUpSchema>
	>({
		schema: signUpSchema,
		defaultValues: {
			email: "",
			password: "",
			passwordConfirmation: "",
			firstName: "",
			lastName: "",
			image: undefined,
		},
		onSubmit: useCallback(
			async (values: z.infer<typeof signUpSchema>) => {
				try {
					const validatedData = signUpSchema.parse({
						email: values.email,
						password: values.password,
						passwordConfirmation: values.passwordConfirmation,
						firstName: values.firstName,
						lastName: values.lastName,
						image: values.image,
					});

					await signUp.email(
						{
							email: validatedData.email,
							name: `${validatedData.firstName} ${validatedData.lastName}`,
							password: validatedData.password,
							image: validatedData.image,
						},
						{
							onError: (ctx) => {
								setErrorMessage({
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
				} catch (error) {
					if (error instanceof z.ZodError) {
						console.error(error);
					}
				}
			},
			[t, router, signUpSchema],
		),
	});
	return (
		<AuthCard
			title={t("components.auth.register.title")}
			description={t("components.auth.register.description")}
			className="w-full sm:w-sm"
			footer={
				<AuthFooter
					href={"/auth/login"}
					text={t("components.auth.link.haveAccount")}
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
				<div className="flex gap-3">
					<div className="flex-1">
						<AuthField
							label={t("components.auth.form.firstName.label")}
							placeholder={t("components.auth.form.firstName.placeholder")}
							control={form.control}
							name="firstName"
							type="text"
						/>
					</div>
					<div className="flex-1">
						<AuthField
							label={t("components.auth.form.lastName.label")}
							placeholder={t("components.auth.form.lastName.placeholder")}
							control={form.control}
							name="lastName"
							type="text"
						/>
					</div>
				</div>
				<AuthField
					label={t("components.auth.form.email.label")}
					placeholder={t("components.auth.form.email.placeholder")}
					control={form.control}
					name="email"
					type="email"
				/>
				<AuthField
					label={t("components.auth.form.password.label")}
					placeholder={t("components.auth.form.password.placeholder")}
					control={form.control}
					name="password"
					type="password"
				/>
				<AuthField
					label={t("components.auth.form.confirmPassword.label")}
					placeholder={t("components.auth.form.confirmPassword.placeholder")}
					control={form.control}
					name="passwordConfirmation"
					type="password"
				/>
				<AuthField
					label={t("components.auth.form.image.label")}
					control={form.control}
					name="image"
					type="file"
					fieldType="image"
				/>
				<AuthButton isLoading={isPending} label={t("button.register")} />
			</AuthForm>
		</AuthCard>
	);
}
