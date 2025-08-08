import type { Log } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getLogsList(): Promise<{
	logs: Log[];
}> {
	"use cache";
	try {
		const logsList = await prisma.log.findMany({
			orderBy: {
				createdAt: "desc",
			},
		});
		return { logs: logsList };
	} catch (error) {
		if (error instanceof Error && error.message.includes("network")) {
			throw new Error("503 - SERVICE_UNAVAILABLE");
		} else {
			throw new Error("500 - INTERNAL_SERVER_ERROR");
		}
	}
}
