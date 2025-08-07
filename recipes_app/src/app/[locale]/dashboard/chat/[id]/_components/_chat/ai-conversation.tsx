"use client";

import type { UIDataTypes, UIMessage, UITools } from "ai";

import {
	AIConversation,
	AIConversationContent,
	AIConversationScrollButton,
} from "@/components/ui/kibo-ui/ai/conversation";
import {
	AIMessage,
	AIMessageAvatar,
	AIMessageContent,
} from "@/components/ui/kibo-ui/ai/message";

import { useSession } from "@/lib/auth/auth-client";

interface AiConversationProps {
	messages: UIMessage<unknown, UIDataTypes, UITools>[];
	className?: string;
}
export default function AiConversation({
	messages,
	className,
}: AiConversationProps) {
	const { data: session } = useSession();
	return (
		<AIConversation className={className}>
			<AIConversationContent>
				{messages.map((message) => (
					<AIMessage
						from={message.role === "user" ? "user" : "assistant"}
						key={message.id}
						className="whitespace-pre-wrap"
					>
						{message.parts.map((part, i) => {
							switch (part.type) {
								case "text":
									return (
										<AIMessage
											from={message.role === "user" ? "user" : "assistant"}
											key={`${message.id}-${i}`}
										>
											<AIMessageContent>
												{part.text
													.split(/\*\*(.*?)\*\*/g)
													.map((part, index) => {
														if (index % 2 === 1) {
															// biome-ignore lint/suspicious/noArrayIndexKey: key index
															return <strong key={index}>{part}</strong>;
														} else {
															if (
																part.includes("### ") ||
																part.includes("#### ")
															) {
																const match = part.replace(/(#{3,4}) (.*)/, "");

																return (
																	// biome-ignore lint/suspicious/noArrayIndexKey: key index
																	<h2 className="text-xl" key={index}>
																		<strong>{match}</strong>
																	</h2>
																);
															}
															// biome-ignore lint/suspicious/noArrayIndexKey: key index
															return <span key={index}>{part}</span>;
														}
													})}
											</AIMessageContent>
											{message.role === "user" ? (
												<AIMessageAvatar
													name={session?.user.name}
													src={session?.user.image ?? ""}
												/>
											) : (
												<AIMessageAvatar name={"AI"} src={""} />
											)}
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
