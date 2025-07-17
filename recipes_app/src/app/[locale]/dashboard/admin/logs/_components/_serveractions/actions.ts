import type { Log } from "@/generated/prisma";
import prisma from "@/lib/prisma";

export async function getLogsList(): Promise<{
	logs: Log[];
}> {
	"use cache";
	try {
		const logsList = await prisma.log.findMany();
		return { logs: logsList };
	} catch (error) {
		console.error(error);
		return {
			logs: [],
		};
	}
}
