"use server";

import type { Session, User } from "better-auth";
import { revalidatePath } from "next/cache";
import type { Log, LogAction, LogStatus } from "@/generated/prisma";
import prisma from "../prisma";

interface LogProps {
	userId: User["id"];
	action: LogAction;
	targetId: User["id"] | Session["token"];
	status: LogStatus;
	metadata?: Log["metadata"];
}
interface LogError {
	success?: boolean;
	error?: { code?: string; message?: string; status?: number };
}
export async function createLog({
	userId,
	action,
	targetId,
	status,
	metadata,
}: LogProps): Promise<LogError> {
	try {
		await prisma.log.create({
			data: {
				userId: userId,
				action: action,
				targetId: targetId,
				status: status,
				metadata: metadata ?? undefined,
			},
		});
		revalidatePath("[locale]/dashboard/admin/logs", "page");

		return { success: true };
	} catch (error) {
		if (error instanceof Error) {
			if (
				error.message.includes("network") ||
				error.message.includes("timeout")
			) {
				return {
					success: false,
					error: { code: "SERVICE_UNAVAILABLE", status: 503 },
				};
			}
			if (
				error.message.includes("constraint") ||
				error.message.includes("foreign key")
			) {
				return {
					success: false,
					error: { code: "INVALID_DATA", status: 400 },
				};
			}
		}
		return {
			success: false,
			error: { code: "INTERNAL_SERVER_ERROR", status: 500 },
		};
	}
}
