import { z } from "zod";
export const authSchemas = (
	// biome-ignore lint/suspicious/noExplicitAny: more complex
	t: (...args: Parameters<(key: string, ...params: any[]) => string>) => string,
) => ({
	signIn: z.object({
		email: z.string().email(t("zod.email")),
		password: z.string().min(6, t("zod.min.password")),
	}),

	signUp: z
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
	}),
	deleteUser: z.object({
		userId: z.string().min(1),
	}),
	roleUser: z.object({
		userId: z.string().min(1),
		role: z.enum(["user", "admin", "premium"]),
	}),
});

export const authSchema = z.object({
	id: z.string(),
	email: z.string().email(),
	emailVerified: z.boolean(),
	name: z.string(),
	image: z.string().nullable().optional(),
	role: z.enum(["user", "admin", "premium"]),
	banned: z.boolean().nullable().optional(),
	banReason: z.string().nullable().optional(),
	banExpires: z.string().nullable().optional(),
	createdAt: z.string(),
	updatedAt: z.string(),
});

export type Auth = z.infer<typeof authSchema>;
