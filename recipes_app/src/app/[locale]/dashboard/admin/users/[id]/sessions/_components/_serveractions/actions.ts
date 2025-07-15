"use server";

import { APIError } from "better-auth/api";
import type { SessionWithImpersonatedBy } from "better-auth/plugins";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { getI18n } from "@/locales/server";

export async function getUserSessionsList(
	headers: Headers,
	userId: string,
): Promise<{
	sessions: SessionWithImpersonatedBy[];
}> {
	"use cache";

	try {
		const validatedData = z
			.object({
				userId: z.string().min(1),
			})
			.safeParse({
				userId: userId,
			});

		if (!validatedData.success) {
			console.error(validatedData.error);
		}
		const userSessionsList = await auth.api.listUserSessions({
			headers,
			body: {
				userId: userId,
			},
		});
		return userSessionsList;
	} catch (error) {
		console.error(error);
		return {
			sessions: [],
		};
	}
}

export interface SessionState {
	success?: boolean;
	error?: string;
	message?: string;
}

export async function deleteSession(
	_prevState: SessionState,
	formData: FormData,
): Promise<SessionState> {
	const t = await getI18n();
	const deleteSessionSchema = authSchemas(t).deleteSession;

	try {
		const validatedData = deleteSessionSchema.safeParse({
			token: formData.get("token"),
		});

		if (!validatedData.success) {
			console.error(t("errors.userBadId"));
			return {
				success: false,
				error: t("errors.userBadId"),
			};
		}
		const { token } = validatedData.data;

		const result = await auth.api.revokeUserSession({
			headers: await headers(),
			body: {
				sessionToken: token,
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
