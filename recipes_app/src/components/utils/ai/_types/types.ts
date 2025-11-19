import type { InferUITools, UIDataTypes, UIMessage } from "ai";
import { z } from "zod";
import type { tools } from "@/lib/ai/tools";

export const messageMetadataSchema = z.object({
	branchId: z.string().uuid().optional(),
	parentMessageId: z.string().uuid().nullable().optional(),
	createdAt: z.number().optional(),
	reasoningDuration: z.number().optional(),
});

export type MessageMetadata = z.infer<typeof messageMetadataSchema>;

export type MyUIMessage = UIMessage<
	MessageMetadata,
	UIDataTypes,
	InferUITools<typeof tools>
>;
