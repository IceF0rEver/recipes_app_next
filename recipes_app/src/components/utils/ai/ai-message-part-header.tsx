"use client";

import type { ReasoningUIPart } from "ai";
import { ChevronLeftIcon, ChevronRightIcon } from "lucide-react";
import { useState } from "react";
import {
	MessageAttachment,
	MessageAttachments,
} from "@/components/ai-elements/message";
import {
	Reasoning,
	ReasoningContent,
	ReasoningTrigger,
} from "@/components/ai-elements/reasoning";
import {
	Source,
	Sources,
	SourcesContent,
	SourcesTrigger,
} from "@/components/ai-elements/sources";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type { MyUIMessage } from "./_types/types";

interface AiMessageHeaderPartProps {
	message: MyUIMessage;
}

interface AiMessageHeaderPartFileProps
	extends Pick<AiMessageHeaderPartProps, "message"> {}

export function AiMessageHeaderPartSources({
	...props
}: AiMessageHeaderPartProps) {
	return (
		props.message.parts.filter((part) => part.type === "source-url").length >
			0 && (
			<Sources
				className={cn(
					props.message.role !== "user" ? "justify-start" : "justify-end",
					"flex m-0",
				)}
			>
				<SourcesTrigger
					count={
						props.message.parts.filter((part) => part.type === "source-url")
							.length
					}
				/>
				{props.message.parts
					.filter((part) => part.type === "source-url")
					.map((part, i) => (
						<SourcesContent key={`${props.message.id}-${i}`}>
							<Source
								key={`${props.message.id}-${i}`}
								href={part.url}
								title={part.url}
							/>
						</SourcesContent>
					))}
			</Sources>
		)
	);
}

export function AiMessageHeaderPartReasoning({
	...props
}: AiMessageHeaderPartProps) {
	const reasoningPart = props.message.parts.find(
		(part) => part.type === "reasoning",
	) as ReasoningUIPart;

	return reasoningPart?.text ? (
		<Reasoning
			className={cn("w-full")}
			isStreaming={reasoningPart.state === "streaming"}
			duration={props.message.metadata?.reasoningDuration}
		>
			<ReasoningTrigger />
			<ReasoningContent>{reasoningPart.text}</ReasoningContent>
		</Reasoning>
	) : null;
}

export function AiMessageHeaderPartFile({
	...props
}: AiMessageHeaderPartFileProps) {
	const filtredMessages = props.message.parts.filter(
		(part) => part.type === "file",
	);

	const [showAll, setShowAll] = useState(false);

	const handleShowAll = () => setShowAll((prev) => !prev);

	if (filtredMessages.length === 0) return null;

	const messagesToShow = showAll
		? filtredMessages
		: filtredMessages.slice(0, 1);

	return (
		<div className="flex flex-row gap-2 items-center">
			<MessageAttachments>
				{messagesToShow.map((attachment) => (
					<MessageAttachment data={attachment} key={attachment.url} />
				))}
			</MessageAttachments>
			{filtredMessages.length > 1 && (
				<Button
					type="button"
					variant={"ghost"}
					size={"icon-sm"}
					className="cursor-pointer h-full"
					onClick={handleShowAll}
				>
					{showAll ? <ChevronLeftIcon /> : <ChevronRightIcon />}
				</Button>
			)}
		</div>
	);
}
