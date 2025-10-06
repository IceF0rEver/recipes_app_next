import { z } from "zod";

export const sessionTableSchema = z.object({
	id: z.string().uuid(),
	expiresAt: z.date(),
	token: z.string(),
	createdAt: z.date(),
	updatedAt: z.date(),
	ipAddress: z.string().nullable().optional(),
	userAgent: z.string().nullable().optional(),
	userId: z.string().uuid(),
	impersonatedBy: z.string().nullable().optional(),
});
