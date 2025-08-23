"use client";
import { PlusIcon } from "lucide-react";
import { type FormEventHandler, useCallback, useState } from "react";
import {
	AIInput,
	AIInputButton,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";
import { useI18n } from "@/locales/client";
import AiManageRecipe from "./ai-manage-recipe";

type Status = "submitted" | "streaming" | "ready" | "error";
interface AiInputProps {
	chatId: string;
	status: Status;
	onSubmit: (text: string) => void;
	onStop: () => void;
	className?: string;
	placeholder?: string;
}
export default function AiInput({ onSubmit, onStop, status, className, placeholder, chatId }: AiInputProps) {
	const [isLoading, setIsLoading] = useState<boolean>(false);
	const [input, setInput] = useState<string>("");
	const t = useI18n();

	const handleSubmit: FormEventHandler<HTMLFormElement> = useCallback(
		(e) => {
			e.preventDefault();
			if (!input.trim()) return;
			onSubmit(input);
			setInput("");
		},
		[input, onSubmit],
	);

	const disabledCondition = !(status === "streaming" || (input.trim() && status !== "error")) || isLoading;
	return (
		<div className={className}>
			<AIInput onSubmit={handleSubmit}>
				<AIInputTextarea value={input} onChange={(e) => setInput(e.target.value)} placeholder={placeholder} />
				<AIInputToolbar className="border-t">
					<AIInputTools>
						<AIInputButton disabled={true}>
							<PlusIcon size={16} />
						</AIInputButton>
					</AIInputTools>
					<div className="flex gap-2">
						<AiManageRecipe status={status} onloading={() => setIsLoading} chatId={chatId} />
						<AIInputSubmit
							variant={status === "error" ? "destructive" : undefined}
							disabled={disabledCondition}
							status={status}
							onClick={() => {
								if (status === "streaming") {
									onStop();
								}
							}}
						/>
					</div>
				</AIInputToolbar>
			</AIInput>
			<p className="text-xs text-muted-foreground mt-2 text-center">{t("aiChat.aiInput.warning")}</p>
		</div>
	);
}
