"use server";

import { APIError } from "better-auth/api";
import type { UserWithRole } from "better-auth/plugins";
import { revalidatePath } from "next/cache";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import { getUser } from "@/lib/auth/server";
import prisma from "@/lib/prisma";
import { createLog } from "@/lib/service/logs-service";
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
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		} else {
			throw new Error("500 - INTERNAL_SERVER_ERROR");
		}
	}
}

export interface UserState {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
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
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
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
				if (currentUser) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: currentUser.id,
						action: "USER_DELETE",
						targetId: userId,
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
			} else {
				return {
					success: false,
					error: {
						code: "USER_DELETE_FAILED",
						status: 500,
					},
				};
			}
		} else {
			if (currentUser) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: currentUser.id,
					action: "USER_DELETE",
					targetId: userId,
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
		} else {
			return {
				success: false,
				error: {
					code: "UNEXPECTED_ERROR",
					status: 500,
				},
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
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
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
				if (currentUser) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: currentUser.id,
						action: "ROLE_CHANGE",
						targetId: userId,
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
			} else {
				return {
					success: false,
					error: {
						code: "ROLE_CHANGE_FAILED",
						status: 500,
					},
				};
			}
		} else {
			if (currentUser) {
				await prisma.log.create({
					data: {
						userId: currentUser.id,
						action: "ROLE_CHANGE",
						targetId: userId,
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
		}
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
		} else {
			return {
				success: false,
				error: {
					code: "UNEXPECTED_ERROR",
					status: 500,
				},
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
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
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
				if (currentUser) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: currentUser.id,
						action: "USER_SUSPEND",
						targetId: userId,
						status: "SUCCESS",
						metadata: {
							banReason: banReason,
							banExpires: banExpires,
						},
					});
					if (!logSuccess) {
						console.warn(logError);
					}
				}
				revalidatePath("[locale]/dashboard/admin/users", "page");

				return {
					success: true,
				};
			} else {
				return {
					success: false,
					error: {
						code: "USER_SUSPEND_FAILED",
						status: 500,
					},
				};
			}
		} else {
			if (currentUser) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: currentUser.id,
					action: "USER_SUSPEND",
					targetId: userId,
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
		} else {
			return {
				success: false,
				error: {
					code: "UNEXPECTED_ERROR",
					status: 500,
				},
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
			return {
				success: false,
				error: {
					code: "BAD_REQUEST",
					status: 400,
				},
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
				if (currentUser) {
					const { success: logSuccess, error: logError } = await createLog({
						userId: currentUser.id,
						action: "USER_ACTIVATE",
						targetId: userId,
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
			} else {
				return {
					success: false,
					error: {
						code: "USER_ACTIVATE_FAILED",
						status: 500,
					},
				};
			}
		} else {
			if (currentUser) {
				const { success: logSuccess, error: logError } = await createLog({
					userId: currentUser.id,
					action: "USER_ACTIVATE",
					targetId: userId,
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
		} else {
			return {
				success: false,
				error: {
					code: "UNEXPECTED_ERROR",
					status: 500,
				},
			};
		}
	}
}
