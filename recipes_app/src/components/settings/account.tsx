"use client";
import { useI18n } from "@/locales/client";
import { useState } from "react";
import { useSession } from "@/lib/auth-client";
import SettingsArticlePassword from "./settings-article-password";
import { z, type string } from "zod";
import { authClient } from "@/lib/auth-client";
import { toast } from "sonner";
import AuthForm from "../auth/auth-form";
import { authSchemas } from "@/lib/zod/auth-schemas";
import AuthField from "../auth/auth-field";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import AuthButton from "../auth/auth-button";
import SettingsItemsHeader from "./settings-items-header";

export default function Account() {
	const t = useI18n();
	const { data: session } = useSession();

	const [loading, setLoading] = useState<boolean>(false);

	const [errorMessage, setErrorMessage] = useState<Record<string, string>>({});

	const updateUserSchema = authSchemas(t).updateUser;
	type UpdateUserType = z.infer<typeof updateUserSchema>;
	const form = useForm<UpdateUserType>({
		resolver: zodResolver(updateUserSchema),
		defaultValues: {
			email: session?.user.email ?? "",
			firstName: session?.user.name.split(" ")[0] ?? "",
			lastName: session?.user.name.split(" ")[1] ?? "",
			image: session?.user.image ?? "",
		},
	});
	const onSubmit = async (values: UpdateUserType) => {
		try {
			const validatedData = updateUserSchema.parse({
				email: values.email,
				firstName: values.firstName,
				lastName: values.lastName,
				image: values.image,
			});
			if (
				validatedData.firstName !== session?.user.name.split(" ")[0] ||
				validatedData.lastName !== session?.user.name.split(" ")[1] ||
				validatedData.image !== session?.user.image
			) {
				await authClient.updateUser(
					{
						...((validatedData.firstName !== session?.user.name.split(" ")[0] ||
							validatedData.lastName !== session?.user.name.split(" ")[1]) && {
							name: `${validatedData.firstName} ${validatedData.lastName}`,
						}),
						...(validatedData.image !== session?.user.image && { image: validatedData.image }),
					},
					{
						onResponse: () => {
							setLoading(false);
						},
						onRequest: () => {
							setLoading(true);
						},
						onError: (ctx) => {
							setErrorMessage({
								betterError: t(`BASE_ERROR_CODES.${ctx.error.code}` as keyof typeof string),
							});
						},
						onSuccess: async () => {
							toast.success(t("components.settings.toast.nameOrImageSuccess"));
						},
					},
				);
			}
			if (validatedData.email !== session?.user.email) {
				await authClient.changeEmail(
					{ newEmail: validatedData.email },
					{
						onResponse: () => {
							setLoading(false);
						},
						onRequest: () => {
							setLoading(true);
						},
						onError: (ctx) => {
							setErrorMessage({
								betterError: t(`BASE_ERROR_CODES.${ctx.error.code}` as keyof typeof string),
							});
						},
						onSuccess: async () => {
							toast.success(t("components.settings.toast.emailSuccess"));
						},
					},
				);
			}
		} catch (error) {
			if (error instanceof z.ZodError) {
				console.error(error);
			}
			setLoading(false);
		}
	};
	return (
		<article className="max-w-3xl">
			<SettingsItemsHeader
				title={t("components.settings.items.account.title")}
				description={t("components.settings.items.account.description")}
			/>
			<section className="flex flex-col gap-9">
				<SettingsArticlePassword />
				<AuthForm form={form} onSubmit={onSubmit} className="grid gap-9">
					{errorMessage.betterError && (
						<p className="text-sm text-destructive" aria-live="polite" aria-atomic="true">
							{errorMessage.betterError}
						</p>
					)}
					<div className="flex gap-3 md:max-w-2/3">
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
						className={"md:max-w-2/3"}
					/>
					<AuthField
						label={t("components.auth.form.image.label")}
						control={form.control}
						name="image"
						type="file"
						fieldType="image"
						className={"md:max-w-2/3"}
					/>
					<AuthButton className={"w-1/4"} isLoading={loading} label={t("button.update")} />
				</AuthForm>
			</section>
		</article>
	);
}
