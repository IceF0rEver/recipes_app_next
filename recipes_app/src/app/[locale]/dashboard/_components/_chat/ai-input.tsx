"use client";
import { GlobeIcon, MicIcon, PlusIcon } from "lucide-react";
import { type FormEventHandler, useState } from "react";
import {
	AIInput,
	AIInputButton,
	AIInputSubmit,
	AIInputTextarea,
	AIInputToolbar,
	AIInputTools,
} from "@/components/ui/kibo-ui/ai/input";

type Status = "submitted" | "streaming" | "ready" | "error";
interface AiInputProps {
	status: Status;
	onSubmit: (text: string) => void;
}
export default function AiInput({ onSubmit, status }: AiInputProps) {
	const [input, setInput] = useState("");
	const handleSubmit: FormEventHandler<HTMLFormElement> = (e) => {
		e.preventDefault();
		if (!input.trim()) return;
		onSubmit(input);
		setInput("");
	};
	return (
		<div>
			<AIInput onSubmit={handleSubmit}>
				<AIInputTextarea
					value={input}
					onChange={(e) => setInput(e.target.value)}
					placeholder="Demandez-moi une recette, des conseils de cuisine..."
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
				Appuyez sur Entrée pour envoyer • L'IA peut faire des erreurs, vérifiez
				les informations importantes
			</p>
		</div>
	);
}
