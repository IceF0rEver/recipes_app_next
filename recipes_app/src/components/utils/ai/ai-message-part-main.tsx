"use client";

import { Fragment } from "react";
import { MessageResponse } from "@/components/ai-elements/message";
import type { MyUIMessage } from "./_types/types";

interface AiMessageMainPartProps {
	message: MyUIMessage;
	disabledAvatar?: boolean;
}

export function AiMessageMainPart({ ...props }: AiMessageMainPartProps) {
	return (
		<>
			{props.message.parts.map((part, i) => {
				switch (part.type) {
					case "text":
						return (
							<Fragment key={`${props.message.id}-${i}`}>
								<MessageResponse>{part.text}</MessageResponse>
							</Fragment>
						);
					default:
						return null;
				}
			})}
		</>
	);
}
