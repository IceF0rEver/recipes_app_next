"use client";

import { PromptInputProvider } from "@/components/ai-elements/prompt-input";
import AiConversation from "@/components/utils/ai/ai-conversation";
import AiPromptInput from "@/components/utils/ai/ai-prompt-input";

interface AiChatProps {
	disabledFile?: boolean;
	disabledwebSearch?: boolean;
	disabledModelSelect?: boolean;
	disabledAvatar?: boolean;
}

export default function AiChat({ ...props }: AiChatProps) {
	return (
		<div className="max-w-4xl mx-auto p-6 relative size-full h-screen">
			<div className="flex flex-col h-full">
				<PromptInputProvider>
					<AiConversation {...props} />
					<AiPromptInput {...props} />
				</PromptInputProvider>
			</div>
		</div>
	);
}
