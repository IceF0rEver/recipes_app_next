"use server";

import { APIError } from "better-auth/api";
import type { UserWithRole } from "better-auth/plugins";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import type { User } from "@/generated/prisma";
import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { createLog } from "@/lib/service/logs-service";
import { authSchemas, authTableSchema } from "@/lib/zod/auth-schemas";
import { getI18n } from "@/locales/server";

interface UserWithRoleAndStripe extends UserWithRole {
	stripeCustomerId?: string | null;
}

export async function getUsersList(headers: Headers): Promise<{
	users: UserWithRoleAndStripe[];
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
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		}
		throw new Error("500 - INTERNAL_SERVER_ERROR");
	}
}

export interface UserState {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
	message?: string;
}

export async function deleteUser(
	_prevState: UserState,
	userId: User["id"],
): Promise<UserState> {
	try {
		const user = await getUser();

		const authSchema = authTableSchema.pick({ id: true });
		const validatedTargetIdData = authSchema.safeParse({ id: userId });
		const validatedUserIdData = authSchema.safeParse({ id: user?.id });

		if (!validatedTargetIdData.success || !validatedUserIdData.success) {
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}

		const { id: validatedTargetId } = validatedTargetIdData.data;
		const { id: validatedUserId } = validatedUserIdData.data;

		if (validatedTargetId !== validatedUserId) {
			const result = await auth.api.removeUser({
				headers: await headers(),
				body: {
					userId: validatedTargetId,
				},
			});
			if (result) {
				if (validatedUserId) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: validatedUserId,
						action: "USER_DELETE",
						targetId: validatedTargetId,
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
					code: "USER_DELETE_FAILED",
					status: 500,
				},
			};
		}
		if (validatedUserId) {
			const { success: logSuccess, error: logError } = await createLog({
				userId: validatedUserId,
				action: "USER_DELETE",
				targetId: validatedTargetId,
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

export async function updateRoleUser(
	_prevState: UserState,
	{ userId, role }: { userId: User["id"]; role: User["role"] },
): Promise<UserState> {
	try {
		const user = await getUser();

		const authSchemaRole = authTableSchema.pick({ id: true, role: true });
		const authSchema = authTableSchema.pick({ id: true });
		const validatedRoleData = authSchemaRole.safeParse({
			id: userId,
			role: role,
		});
		const validatedUserIdData = authSchema.safeParse({ id: user?.id });

		if (!validatedUserIdData.success || !validatedRoleData.success) {
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}

		const { id: validatedIdRole, role: validatedRole } = validatedRoleData.data;
		const { id: validatedUserId } = validatedUserIdData.data;
		if (validatedIdRole !== validatedUserId) {
			const result = await auth.api.setRole({
				headers: await headers(),
				body: {
					userId: validatedIdRole,
					role: role as "admin" | "user",
				},
			});
			if (result) {
				if (validatedUserId) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: validatedUserId,
						action: "ROLE_CHANGE",
						targetId: validatedIdRole,
						metadata: {
							newRole: validatedRole,
						},
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
					code: "ROLE_CHANGE_FAILED",
					status: 500,
				},
			};
		}
		if (validatedUserId) {
			await prisma.log.create({
				data: {
					userId: validatedUserId,
					action: "ROLE_CHANGE",
					targetId: validatedIdRole,
					metadata: {
						newRole: validatedRole,
					},
					status: "FAILED",
				},
			});
			revalidatePath("[locale]/dashboard/admin/logs", "page");
		}
		return {
			success: false,
			error: {
				code: "INVALID_OPERATION",
				status: 403,
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

export async function banUser(
	_prevState: UserState,
	formData: FormData,
): Promise<UserState> {
	try {
		const user = await getUser();

		const authSchemaBan = authTableSchema.pick({
			id: true,
			banExpires: true,
			banReason: true,
		});
		const authSchema = authTableSchema.pick({ id: true });
		const parsedData = JSON.parse(formData.get("banUserData") as string);
		const validatedBanData = authSchemaBan.safeParse(parsedData);
		const validatedUserIdData = authSchema.safeParse({ id: user?.id });
		if (!validatedBanData.success || !validatedUserIdData.success) {
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}

		const { id, banReason, banExpires } = validatedBanData.data;
		const { id: userId } = validatedUserIdData.data;
		if (id !== userId) {
			const result = await auth.api.banUser({
				headers: await headers(),
				body: {
					userId: id,
					banReason: banReason ?? "",
					banExpiresIn: Number(banExpires),
				},
			});
			if (result) {
				if (userId) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: userId,
						action: "USER_SUSPEND",
						targetId: id,
						status: "SUCCESS",
						metadata: JSON.stringify({
							banReason: banReason ?? "",
							banExpires: banExpires,
						}),
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
					code: "USER_SUSPEND_FAILED",
					status: 500,
				},
			};
		}
		if (userId) {
			const { success: logSuccess, error: logError } = await createLog({
				userId: userId,
				action: "USER_SUSPEND",
				targetId: id,
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

export async function unBanUser(
	_prevState: UserState,
	userId: User["id"],
): Promise<UserState> {
	try {
		const user = await getUser();

		const authSchema = authTableSchema.pick({ id: true });
		const validatedTargetIdData = authSchema.safeParse({ id: userId });
		const validatedUserIdData = authSchema.safeParse({ id: user?.id });

		if (!validatedTargetIdData.success || !validatedUserIdData.success) {
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
			};
		}

		const { id: validatedTargetId } = validatedTargetIdData.data;
		const { id: validatedUserId } = validatedUserIdData.data;
		if (validatedTargetId !== validatedUserId) {
			const result = await auth.api.unbanUser({
				headers: await headers(),
				body: {
					userId: validatedTargetId,
				},
			});
			if (result) {
				if (validatedUserId) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: validatedUserId,
						action: "USER_ACTIVATE",
						targetId: validatedTargetId,
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
					code: "USER_ACTIVATE_FAILED",
					status: 500,
				},
			};
		}
		if (validatedUserId) {
			const { success: logSuccess, error: logError } = await createLog({
				userId: validatedUserId,
				action: "USER_ACTIVATE",
				targetId: validatedTargetId,
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
