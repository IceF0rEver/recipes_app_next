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
			throw new Error("400 - BAD_REQUEST");
		}
		const userSessionsList = await auth.api.listUserSessions({
			headers,
			body: {
				userId: userId,
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
	const currentUser = await getUser();

	try {
		const validatedData = z
			.object({
				token: z.string().min(1),
			})
			.safeParse({
				token: token,
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

		if (token === currentSession?.token) {
			if (currentUser) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: currentUser.id,
					action: "SESSION_REVOKE",
					targetId: token,
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
				sessionToken: token,
			},
		});

		if (result.success) {
			if (currentUser) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: currentUser.id,
					action: "SESSION_REVOKE",
					targetId: token,
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
