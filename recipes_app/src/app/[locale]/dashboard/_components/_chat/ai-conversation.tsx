"use client";

import type { UIDataTypes, UIMessage, UITools } from "ai";
import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from "@/components/ui/kibo-ui/ai/conversation";
import {
	AIMessage,
	AIMessageContent,
} from "@/components/ui/kibo-ui/ai/message";

interface AiConversationProps {
	messages: UIMessage<unknown, UIDataTypes, UITools>[];
}
export default function AiConversation({ messages }: AiConversationProps) {
	return (
		<AIConversation className="relative size-full">
			<AIConversationContent>
				{messages.map((message) => (
					<AIMessage
						from={message.role === "user" ? "user" : "assistant"}
						key={message.id}
					>
						{message.parts.map((part, i) => {
							switch (part.type) {
								case "text":
									return (
										<AIMessage
											from={message.role === "user" ? "user" : "assistant"}
											key={`${message.id}-${i}`}
										>
											<AIMessageContent>{part.text}</AIMessageContent>
										</AIMessage>
									);
							}
						})}
					</AIMessage>
				))}
			</AIConversationContent>
			<AIConversationScrollButton />
		</AIConversation>
	);
}
