"use client";

import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { z, type string } from "zod";
import { useI18n } from "@/locales/client";
import { useState } from "react";
import AuthCard from "@/components/auth/auth-card";
import AuthField from "@/components/auth/auth-field";
import AuthForm from "@/components/auth/auth-form";
import AuthButton from "@/components/auth/auth-button";
import AuthFooter from "@/components/auth/auth-footer";
import { useRouter } from "next/navigation";
import { signUp } from "@/lib/auth/auth-client";

export default function Page() {
	const t = useI18n();
	const router = useRouter();

	const signUpSchema = authSchemas(t).signUp;
	type SignUpType = z.infer<typeof signUpSchema>;

	const [loading, setLoading] = useState<boolean>(false);
	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

	const form = useForm<SignUpType>({
		resolver: zodResolver(signUpSchema),
		defaultValues: {
			email: "",
			password: "",
			passwordConfirmation: "",
			firstName: "",
			lastName: "",
			image: "",
		},
	});
	const onSubmit = async (values: SignUpType) => {
		try {
			const validatedData = signUpSchema.parse({
				email: values.email,
				password: values.password,
				passwordConfirmation: values.passwordConfirmation,
				firstName: values.firstName,
				lastName: values.lastName,
				image: values.image ?? "",
			});

			await signUp.email(
				{
					email: validatedData.email,
					name: `${validatedData.firstName} ${validatedData.lastName}`,
					password: validatedData.password,
					image: validatedData.image,
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
						router.push(`/dashboard`);
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
		<AuthCard
			title={t("components.auth.register.title")}
			description={t("components.auth.register.description")}
			className="max-w-md"
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
					<p className="text-sm text-destructive" aria-live="polite" aria-atomic="true">
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
				<AuthButton isLoading={loading} label={t("button.register")} />
			</AuthForm>
		</AuthCard>
	);
}
