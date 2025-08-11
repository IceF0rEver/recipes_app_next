"use client";
import { GlobeIcon, MicIcon, PlusIcon } from "lucide-react";
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

type Status = "submitted" | "streaming" | "ready" | "error";
interface AiInputProps {
	status: Status;
	onSubmit: (text: string) => void;
	className?: string;
	placeholder?: string;
}
export default function AiInput({
	onSubmit,
	status,
	className,
	placeholder,
}: AiInputProps) {
	const [input, setInput] = useState("");
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
	return (
		<div className={className}>
			<AIInput onSubmit={handleSubmit}>
				<AIInputTextarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder={placeholder}
				/>
				<AIInputToolbar className="border-t">
					<AIInputTools>
						<AIInputButton>
							<PlusIcon size={16} />
						</AIInputButton>
						<AIInputButton>
							<MicIcon size={16} />
						</AIInputButton>
						<AIInputButton>
							<GlobeIcon size={16} />
							<span>Recherche</span>
						</AIInputButton>
					</AIInputTools>
					<AIInputSubmit disabled={!input.trim()} status={status} />
				</AIInputToolbar>
			</AIInput>
			<p className="text-xs text-muted-foreground mt-2 text-center">
				{t("aiChat.aiInput.warning")}
			</p>
		</div>
	);
}
