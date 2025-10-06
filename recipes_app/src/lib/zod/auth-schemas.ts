import { z } from "zod";
import type { useI18n } from "@/locales/client";
export const authSchemas = (t: ReturnType<typeof useI18n>) => {
	const signIn = z.object({
		email: z.string().email(t("zod.email")),
		password: z.string().min(6, t("zod.min.password")),
	});

	const signUp = z
		.object({
			email: z.string().email(t("zod.email")),
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
			firstName: z
				.string()
				.min(1, t("zod.min.firstName"))
				.trim()
				.regex(/^\S+$/, t("zod.space")),
			lastName: z
				.string()
				.min(1, t("zod.min.lastName"))
				.trim()
				.regex(/^\S+$/, t("zod.space")),
			image: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		});

	const forgotPassword = z.object({
		email: z.string().email(t("zod.email")),
	});

	const resetPassword = z
		.object({
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		});

	const updatePassword = z
		.object({
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
			currentPassword: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		});

	const updateUser = z.object({
		email: z.string().email(t("zod.email")),
		firstName: z
			.string()
			.min(1, t("zod.min.firstName"))
			.trim()
			.regex(/^\S+$/, t("zod.space")),
		lastName: z
			.string()
			.min(1, t("zod.min.lastName"))
			.trim()
			.regex(/^\S+$/, t("zod.space")),
		image: z.string(),
	});

	const banUser = z.object({
		userId: authTableSchema.pick({ id: true }),
		banReason: z.string().min(1, t("zod.min.banReason")),
		banExpires: z.string().min(1, t("zod.min.banExpires")),
	});

	return {
		signIn,
		signUp,
		forgotPassword,
		resetPassword,
		updatePassword,
		updateUser,
		banUser,
	};
};
export const authTableSchema = z.object({
	id: z.string().uuid(),
	name: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	image: z.string().nullable().optional(),
	createdAt: z.date(),
	updatedAt: z.date(),
	role: z.enum(["user", "admin"]),
	banned: z.boolean().nullable().optional(),
	banReason: z.string().nullable().optional(),
	banExpires: z.date().nullable().optional(),
	stripeCustomerId: z.string().nullable().optional(),
});
