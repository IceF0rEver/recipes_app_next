import { z } from "zod";
import type { useI18n } from "@/locales/client";
export const authSchemas = (t: ReturnType<typeof useI18n>) => ({
	signIn: z.object({
		email: z.string().email(t("zod.email")),
		password: z.string().min(6, t("zod.min.password")),
	}),

	signUp: z
		.object({
			email: z.string().email(t("zod.email")),
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
			firstName: z.string().min(1, t("zod.min.firstName")).trim().regex(/^\S+$/, t("zod.space")),
			lastName: z.string().min(1, t("zod.min.lastName")).trim().regex(/^\S+$/, t("zod.space")),
			image: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		}),

	forgotPassword: z.object({
		email: z.string().email(t("zod.email")),
	}),

	resetPassword: z
		.object({
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		}),

	updatePassword: z
		.object({
			password: z.string().min(6, t("zod.min.password")),
			passwordConfirmation: z.string(),
			currentPassword: z.string(),
		})
		.refine((data) => data.password === data.passwordConfirmation, {
			message: t("zod.password.mismatch"),
			path: ["passwordConfirmation"],
		}),

	updateUser: z.object({
		email: z.string().email(t("zod.email")),
		firstName: z.string().min(1, t("zod.min.firstName")).trim().regex(/^\S+$/, t("zod.space")),
		lastName: z.string().min(1, t("zod.min.lastName")).trim().regex(/^\S+$/, t("zod.space")),
		image: z.string(),
	}),
	deleteUser: z.object({
		userId: z.string().min(1),
	}),
	roleUser: z.object({
		userId: z.string().min(1),
		role: z.enum(["user", "admin"]),
	}),
	banUser: z.object({
		userId: z.string().min(1),
		banReason: z.string().min(1, t("zod.min.banReason")),
		banExpires: z.string().min(1, t("zod.min.banExpires")),
	}),
	unBanUser: z.object({
		userId: z.string().min(1),
	}),
});
