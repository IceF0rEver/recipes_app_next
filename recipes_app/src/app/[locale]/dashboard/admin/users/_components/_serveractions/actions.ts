"use server";

import { APIError } from "better-auth/api";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/auth/server";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { getI18n } from "@/locales/server";

export async function getUsersList(headers: Headers) {
	"use cache";
	const usersList = await auth.api.listUsers({
		headers: headers,
		query: {},
	});
	return usersList;
}

export async function checkAdminPermission(action: "create" | "share" | "update" | "delete") {
	try {
		const user = await getUser();

		if (user) {
			const { success, error } = await auth.api.userHasPermission({
				body: {
					userId: user.id,
					permissions: {
						project: [action],
					},
				},
			});
			return { success, error };
		}
	} catch (error) {
		if (error instanceof APIError) {
			console.log(error.message, error.status);
		}
	}
}

export interface DeleteUserState {
	success?: boolean;
	error?: string;
	message?: string;
}

export async function deleteUser(_prevState: DeleteUserState, formData: FormData): Promise<DeleteUserState> {
	const t = await getI18n();
	const deleteUserSchema = authSchemas(t).deleteUser;
	const currentUser = await getUser();

	try {
		const validatedData = deleteUserSchema.safeParse({
			userId: formData.get("userId"),
		});

		if (!validatedData.success) {
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
			return {
				success: false,
				error: t("errors.APIError"),
			};
		} else {
			return {
				success: false,
				error: t("errors.unexpectedError"),
			};
		}
	}
}
