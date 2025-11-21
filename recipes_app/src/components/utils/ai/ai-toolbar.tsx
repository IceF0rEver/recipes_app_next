"use client";

import { CheckIcon, GlobeIcon } from "lucide-react";
import { useState } from "react";
import {
	ModelSelector,
	ModelSelectorContent,
	ModelSelectorEmpty,
	ModelSelectorGroup,
	ModelSelectorInput,
	ModelSelectorItem,
	ModelSelectorList,
	ModelSelectorLogo,
	ModelSelectorLogoGroup,
	ModelSelectorName,
	ModelSelectorTrigger,
} from "@/components/ai-elements/model-selector";
import {
	PromptInputActionAddAttachments,
	PromptInputActionMenu,
	PromptInputActionMenuContent,
	PromptInputActionMenuTrigger,
	PromptInputButton,
	PromptInputSelect,
	PromptInputSelectContent,
	PromptInputSelectItem,
	PromptInputSelectTrigger,
	PromptInputSelectValue,
} from "@/components/ai-elements/prompt-input";
import { useI18n } from "@/locales/client";
import { useChatContext } from "./_providers/chat-provider";

export function ToolBarInputActionMenu() {
	return (
		<PromptInputActionMenu>
			<PromptInputActionMenuTrigger />
			<PromptInputActionMenuContent>
				<PromptInputActionAddAttachments />
			</PromptInputActionMenuContent>
		</PromptInputActionMenu>
	);
}

export function ToolBarInputButton() {
	const { setWebSearch, webSearch } = useChatContext();
	const t = useI18n();
	return (
		<PromptInputButton
			variant={webSearch ? "default" : "ghost"}
			onClick={() => setWebSearch(!webSearch)}
		>
			<GlobeIcon size={16} />
			<span>{t("button.search")}</span>
		</PromptInputButton>
	);
}

export function ToolBarInputModelSelect() {
	const { setModel, model, models } = useChatContext();

	const [selectedModel, setSelectedModel] = useState<string>(
		model || models[0]?.id,
	);

	return (
		<PromptInputSelect
			onValueChange={(value) => {
				setSelectedModel(value);
				setModel(value);
			}}
			value={selectedModel}
		>
			<PromptInputSelectTrigger>
				<PromptInputSelectValue />
			</PromptInputSelectTrigger>

			<PromptInputSelectContent>
				{models.map((m) => (
					<PromptInputSelectItem key={m.id} value={m.id}>
						{m.name}
					</PromptInputSelectItem>
				))}
			</PromptInputSelectContent>
		</PromptInputSelect>
	);
}

export function ToolBarInputModelSelector() {
	const { setModel, model, models } = useChatContext();

	const [open, setOpen] = useState(false);
	const [selectedModel, setSelectedModel] = useState<string>(
		model || models[0]?.id,
	);

	const selectedModelData = models.find((model) => model.id === selectedModel);
	const chefs = Array.from(new Set(models.map((model) => model.chef)));

	return (
		<ModelSelector onOpenChange={setOpen} open={open}>
			<ModelSelectorTrigger asChild>
				<PromptInputButton variant={"ghost"}>
					{selectedModelData?.chefSlug && (
						<ModelSelectorLogo provider={selectedModelData.chefSlug} />
					)}
					{selectedModelData?.name && (
						<ModelSelectorName>{selectedModelData.name}</ModelSelectorName>
					)}
				</PromptInputButton>
			</ModelSelectorTrigger>
			<ModelSelectorContent>
				<ModelSelectorInput placeholder="Search models..." />
				<ModelSelectorList>
					<ModelSelectorEmpty>No models found.</ModelSelectorEmpty>
					{chefs.map((chef) => (
						<ModelSelectorGroup heading={chef} key={chef}>
							{models
								.filter((model) => model.chef === chef)
								.map((model) => (
									<ModelSelectorItem
										key={model.id}
										onSelect={() => {
											setModel(model.id);
											setSelectedModel(model.id);
											setOpen(false);
										}}
										value={model.id}
									>
										<ModelSelectorLogo provider={model.chefSlug} />
										<ModelSelectorName>{model.name}</ModelSelectorName>
										<ModelSelectorLogoGroup>
											{model.providers.map((provider) => (
												<ModelSelectorLogo key={provider} provider={provider} />
											))}
										</ModelSelectorLogoGroup>
										{selectedModel === model.id ? (
											<CheckIcon className="ml-auto size-4" />
										) : (
											<div className="ml-auto size-4" />
										)}
									</ModelSelectorItem>
								))}
						</ModelSelectorGroup>
					))}
				</ModelSelectorList>
			</ModelSelectorContent>
		</ModelSelector>
	);
}
