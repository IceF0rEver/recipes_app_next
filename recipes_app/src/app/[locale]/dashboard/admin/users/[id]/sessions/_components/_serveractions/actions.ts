"use server";

import type { Session } from "better-auth";
import { APIError } from "better-auth/api";
import type { SessionWithImpersonatedBy } from "better-auth/plugins";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { z } from "zod";
import { auth } from "@/lib/auth/auth";
import { getSession, getUser } from "@/lib/auth/server";
import { createLog } from "@/lib/service/logs-service";
import { authTableSchema } from "@/lib/zod/auth-schemas";
import { sessionTableSchema } from "@/lib/zod/session-schemas";

export async function getUserSessionsList(
	headers: Headers,
	userId: string,
): Promise<{
	sessions: SessionWithImpersonatedBy[];
}> {
	"use cache";

	try {
		const authSchema = authTableSchema.pick({ id: true });
		const validatedData = authSchema.safeParse({ id: userId });

		if (!validatedData.success) {
			throw new Error("400 - BAD_REQUEST");
		}
		const { id } = validatedData.data;
		const userSessionsList = await auth.api.listUserSessions({
			headers,
			body: {
				userId: id,
			},
		});
		return userSessionsList;
	} catch (error) {
		if (error instanceof z.ZodError) {
			throw new Error("400 - BAD_REQUEST");
		}
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

export interface SessionState {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
	message?: string;
}

export async function deleteSession(
	_prevState: SessionState,
	token: Session["token"],
): Promise<SessionState> {
	const currentSession = await getSession();
	const user = await getUser();

	try {
		const sessionSchema = sessionTableSchema.pick({
			token: true,
			userId: true,
		});
		const validatedData = sessionSchema.safeParse({
			token: token,
			userId: user?.id,
		});

		if (!validatedData.success) {
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}
		const { token: validatedToken, userId } = validatedData.data;
		if (validatedToken === currentSession?.token) {
			if (user) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: userId,
					action: "SESSION_REVOKE",
					targetId: validatedToken,
					status: "FAILED",
				});
				if (!logSuccess) {
					console.warn(logError);
				}
			}
			return {
				success: false,
				error: {
					code: "INVALID_OPERATION",
					status: 403,
				},
			};
		}

		const result = await auth.api.revokeUserSession({
			headers: await headers(),
			body: {
				sessionToken: validatedToken,
			},
		});

		if (result.success) {
			if (user) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: userId,
					action: "SESSION_REVOKE",
					targetId: validatedToken,
					status: "SUCCESS",
				});
				if (!logSuccess) {
					console.warn(logError);
				}
			}
			revalidatePath("[locale]/dashboard/admin/users", "page");

			return {
				success: true,
			};
		}
		return {
			success: false,
			error: {
				code: "REVOKE_SESSION_FAILED",
				status: 500,
			},
		};
	} catch (error) {
		console.warn(error);

		if (error instanceof APIError) {
			return {
				success: false,
				error: {
					code: "API_ERROR",
					status: 502,
				},
			};
		}
		return {
			success: false,
			error: {
				code: "UNEXPECTED_ERROR",
				status: 500,
			},
		};
	}
}
