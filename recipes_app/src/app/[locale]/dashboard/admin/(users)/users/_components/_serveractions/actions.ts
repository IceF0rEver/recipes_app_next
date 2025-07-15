"use server";

import { APIError } from "better-auth/api";
import type { UserWithRole } from "better-auth/plugins";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/auth/server";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { getI18n } from "@/locales/server";

export async function getUsersList(headers: Headers): Promise<{
	users: UserWithRole[];
	total: number;
	limit?: number;
	offset?: number;
}> {
	"use cache";

	try {
		const usersList = await auth.api.listUsers({
			headers,
			query: {},
		});
		return usersList;
	} catch (error) {
		console.error(error);
		return {
			users: [],
			total: 0,
		};
	}
}

export interface UserState {
	success?: boolean;
	error?: string;
	message?: string;
}

export async function deleteUser(
	_prevState: UserState,
	formData: FormData,
): Promise<UserState> {
	const t = await getI18n();
	const deleteUserSchema = authSchemas(t).deleteUser;
	const currentUser = await getUser();

	try {
		const validatedData = deleteUserSchema.safeParse({
			userId: formData.get("userId"),
		});

		if (!validatedData.success) {
			console.error(t("errors.userBadId"));
			return {
				success: false,
				error: t("errors.userBadId"),
			};
		}
		const { userId } = validatedData.data;

		if (userId !== currentUser?.id) {
			const result = await auth.api.removeUser({
				headers: await headers(),
				body: {
					userId: userId,
				},
			});
			if (result) {
				revalidatePath("[locale]/dashboard/admin/users", "page");

				return {
					success: true,
				};
			} else {
				return {
					success: false,
				};
			}
		} else {
			return {
				success: false,
			};
		}
	} catch (error) {
		if (error instanceof APIError) {
			console.error(error);
			return {
				success: false,
				error: t("errors.APIError"),
			};
		} else {
			console.error(error);
			return {
				success: false,
				error: t("errors.unexpectedError"),
			};
		}
	}
}

export async function updateRoleUser(
	_prevState: UserState,
	formData: FormData,
): Promise<UserState> {
	const t = await getI18n();
	const roleUserSchema = authSchemas(t).roleUser;
	const currentUser = await getUser();

	try {
		const validatedData = roleUserSchema.safeParse({
			userId: formData.get("userId"),
			role: formData.get("role"),
		});

		if (!validatedData.success) {
			console.error(t("errors.userBadId"));
			return {
				success: false,
				error: t("errors.userBadId"),
			};
		}
		const { userId, role } = validatedData.data;

		if (userId !== currentUser?.id) {
			const result = await auth.api.setRole({
				headers: await headers(),
				body: {
					userId: userId,
					role: role,
				},
			});
			if (result) {
				revalidatePath("[locale]/dashboard/admin/users", "page");

				return {
					success: true,
				};
			} else {
				return {
					success: false,
				};
			}
		} else {
			return {
				success: false,
			};
		}
	} catch (error) {
		if (error instanceof APIError) {
			console.error(error);
			return {
				success: false,
				error: t("errors.APIError"),
			};
		} else {
			console.error(error);
			return {
				success: false,
				error: t("errors.unexpectedError"),
			};
		}
	}
}

export async function banUser(
	_prevState: UserState,
	formData: FormData,
): Promise<UserState> {
	const t = await getI18n();
	const banUserSchema = authSchemas(t).banUser;
	const currentUser = await getUser();

	try {
		const validatedData = banUserSchema.safeParse({
			userId: formData.get("userId"),
			banReason: formData.get("banReason"),
			banExpires: formData.get("banExpires"),
		});

		if (!validatedData.success) {
			console.error(validatedData.error);
			return {
				success: false,
				error: t("errors.validatedData"),
			};
		}
		const { userId, banReason, banExpires } = validatedData.data;
		if (userId !== currentUser?.id) {
			const result = await auth.api.banUser({
				headers: await headers(),
				body: {
					userId: userId,
					banReason: banReason,
					banExpiresIn: banExpires === "-1" ? undefined : Number(banExpires),
				},
			});
			if (result) {
				revalidatePath("[locale]/dashboard/admin/users", "page");

				return {
					success: true,
				};
			} else {
				return {
					success: false,
				};
			}
		} else {
			return {
				success: false,
			};
		}
	} catch (error) {
		if (error instanceof APIError) {
			console.error(error);
			return {
				success: false,
				error: t("errors.APIError"),
			};
		} else {
			console.error(error);
			return {
				success: false,
				error: t("errors.unexpectedError"),
			};
		}
	}
}

export async function unBanUser(
	_prevState: UserState,
	formData: FormData,
): Promise<UserState> {
	const t = await getI18n();
	const unBanUserSchema = authSchemas(t).unBanUser;
	const currentUser = await getUser();

	try {
		const validatedData = unBanUserSchema.safeParse({
			userId: formData.get("userId"),
		});

		if (!validatedData.success) {
			console.error(validatedData.error);
			return {
				success: false,
				error: t("errors.validatedData"),
			};
		}
		const { userId } = validatedData.data;
		if (userId !== currentUser?.id) {
			const result = await auth.api.unbanUser({
				headers: await headers(),
				body: {
					userId: userId,
				},
			});
			if (result) {
				revalidatePath("[locale]/dashboard/admin/users", "page");

				return {
					success: true,
				};
			} else {
				return {
					success: false,
				};
			}
		} else {
			return {
				success: false,
			};
		}
	} catch (error) {
		if (error instanceof APIError) {
			console.error(error);
			return {
				success: false,
				error: t("errors.APIError"),
			};
		} else {
			console.error(error);
			return {
				success: false,
				error: t("errors.unexpectedError"),
			};
		}
	}
}
