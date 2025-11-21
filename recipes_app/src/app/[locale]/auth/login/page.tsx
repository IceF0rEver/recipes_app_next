"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { type string, z } from "zod";
import { Separator } from "@/components/ui/separator";
import AuthButton from "@/components/utils/auth/auth-button";
import AuthCard from "@/components/utils/auth/auth-card";
import AuthField from "@/components/utils/auth/auth-field";
import AuthFooter from "@/components/utils/auth/auth-footer";
import AuthForm from "@/components/utils/auth/auth-form";
import { useGenericForm } from "@/hooks/use-form";
import { signIn } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";

const GoogleLabel = () => {
	const t = useI18n();
	return (
		<span className="flex gap-2">
			<svg
				role="img"
				aria-label="google"
				aria-labelledby="google"
				xmlns="http://www.w3.org/2000/svg"
				width="0.98em"
				height="1em"
				viewBox="0 0 256 262"
			>
				<path
					fill="#4285F4"
					d="M255.878 133.451c0-10.734-.871-18.567-2.756-26.69H130.55v48.448h71.947c-1.45 12.04-9.283 30.172-26.69 42.356l-.244 1.622l38.755 30.023l2.685.268c24.659-22.774 38.875-56.282 38.875-96.027"
				/>
				<path
					fill="#34A853"
					d="M130.55 261.1c35.248 0 64.839-11.605 86.453-31.622l-41.196-31.913c-11.024 7.688-25.82 13.055-45.257 13.055c-34.523 0-63.824-22.773-74.269-54.25l-1.531.13l-40.298 31.187l-.527 1.465C35.393 231.798 79.49 261.1 130.55 261.1"
				/>
				<path
					fill="#FBBC05"
					d="M56.281 156.37c-2.756-8.123-4.351-16.827-4.351-25.82c0-8.994 1.595-17.697 4.206-25.82l-.073-1.73L15.26 71.312l-1.335.635C5.077 89.644 0 109.517 0 130.55s5.077 40.905 13.925 58.602z"
				/>
				<path
					fill="#EB4335"
					d="M130.55 50.479c24.514 0 41.05 10.589 50.479 19.438l36.844-35.974C195.245 12.91 165.798 0 130.55 0C79.49 0 35.393 29.301 13.925 71.947l42.211 32.783c10.59-31.477 39.891-54.251 74.414-54.251"
				/>
			</svg>
			{t("button.google")}
		</span>
	);
};

// const GithubLabel = () => {
// 	const t = useI18n();
// 	return (
// 		<span className="flex gap-2">
// 			<svg xmlns="http://www.w3.org/2000/svg" width="1em" height="1em" viewBox="0 0 24 24">
// 				<path fill="currentColor" d="M12 2A10 10 0 0 0 2 12c0 4.42 2.87 8.17 6.84 9.5c.5.08.66-.23.66-.5v-1.69c-2.77.6-3.36-1.34-3.36-1.34c-.46-1.16-1.11-1.47-1.11-1.47c-.91-.62.07-.6.07-.6c1 .07 1.53 1.03 1.53 1.03c.87 1.52 2.34 1.07 2.91.83c.09-.65.35-1.09.63-1.34c-2.22-.25-4.55-1.11-4.55-4.92c0-1.11.38-2 1.03-2.71c-.1-.25-.45-1.29.1-2.64c0 0 .84-.27 2.75 1.02c.79-.22 1.65-.33 2.5-.33s1.71.11 2.5.33c1.91-1.29 2.75-1.02 2.75-1.02c.55 1.35.2 2.39.1 2.64c.65.71 1.03 1.6 1.03 2.71c0 3.82-2.34 4.66-4.57 4.91c.36.31.69.92.69 1.85V21c0 .27.16.59.67.5C19.14 20.16 22 16.42 22 12A10 10 0 0 0 12 2"></path>
// 			</svg>
// 			{t('button.github')}
// 		</span>
// 	)
// }

export default function Page() {
	const t = useI18n();
	const router = useRouter();
	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

	const signInSchema = authSchemas(t).signIn;

	const { form, onSubmit, isPending } = useGenericForm<
		z.infer<typeof signInSchema>
	>({
		schema: signInSchema,
		defaultValues: {
			email: "",
			password: "",
		},
		onSubmit: useCallback(
			async (values: z.infer<typeof signInSchema>) => {
				try {
					const validatedData = signInSchema.parse({
						email: values.email,
						password: values.password,
					});
					await signIn.email(validatedData, {
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
					});
				} catch (error) {
					if (error instanceof z.ZodError) {
						console.error(error);
					}
				}
			},
			[t, signInSchema, router],
		),
	});

	return (
		<AuthCard
			title={t("components.auth.login.title")}
			description={t("components.auth.login.description")}
			className="w-full sm:w-sm"
			footer={
				<AuthFooter
					href={"/auth/register"}
					label={t("button.register")}
					text={t("components.auth.link.noAccount")}
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
				<AuthField
					label={t("components.auth.form.password.label")}
					placeholder={t("components.auth.form.password.placeholder")}
					control={form.control}
					name="password"
					type="password"
				/>
				<Link
					href="/auth/forgot-password"
					className="ml-auto inline-block text-sm text-primary hover:underline"
				>
					{t("components.auth.link.forgotPassword")}
				</Link>
				<AuthButton isLoading={isPending} label={t("button.login")} />
				<div className="flex items-center gap-2 px-2 pb-1">
					<Separator className="flex-1" />
					<span className="text-xs text-muted-foreground">
						{t("components.auth.login.orSocial")}
					</span>
					<Separator className="flex-1" />
				</div>
				<AuthButton
					socialProvider={"google"}
					isSocial={true}
					type={"button"}
					variant={"outline"}
					label={<GoogleLabel />}
				/>
				{/* <AuthButton type={"button"} variant={"outline"} label={<GithubLabel/>}/> */}
			</AuthForm>
		</AuthCard>
	);
}
