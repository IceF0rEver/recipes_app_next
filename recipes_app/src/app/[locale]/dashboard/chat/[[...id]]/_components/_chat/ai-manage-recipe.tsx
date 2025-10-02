"use client";

import type { UIDataTypes, UIMessage, UITools } from "ai";
import { Archive, EllipsisVertical, FileInput, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import { startTransition, use, useActionState, useCallback, useEffect, useMemo, useState } from "react";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIInputButton } from "@/components/ui/kibo-ui/ai/input";
import type { Chat } from "@/generated/prisma";
import { useToast } from "@/hooks/use-toast";
import { useI18n } from "@/locales/client";
import { archiveActiveChat, resetActiveChat, updateArchiveChat } from "../_serveractions/actions";

type Status = "submitted" | "streaming" | "ready" | "error";

interface ManageRecipeProps {
	status: Status;
	onloading: () => void;
	chat: Promise<{
		chat?: Chat | null;
		error?: {
			message?: string;
			status?: number;
		};
	}>;
	messages: UIMessage<unknown, UIDataTypes, UITools>[] | null;
}
export default function AiManageRecipe({ status, onloading, chat, messages }: ManageRecipeProps) {
	const t = useI18n();
	const router = useRouter();
	const currentChat = use(chat);

	const [archiveActiveToastErrorMessage, setArchiveActiveToastErrorMessage] = useState<string>(
		t("components.admin.users.toast.error"),
	);

	const [resetActiveState, resetActiveChatAction, isPendingResetActive] = useActionState(resetActiveChat, {
		success: false,
	});
	const [archiveActiveState, archiveActiveChatAction, isPendingArchiveActive] = useActionState(archiveActiveChat, {
		success: false,
	});
	const [updateArchiveState, updateArchiveChatAction, isPendingUpdateArchive] = useActionState(updateArchiveChat, {
		success: false,
	});

	const disabledCondition = useMemo(() => {
		return (
			status === "error" ||
			status === "streaming" ||
			isPendingResetActive ||
			isPendingArchiveActive ||
			messages?.length === 0
		);
	}, [status, isPendingResetActive, isPendingArchiveActive, messages?.length]);

	const handleReset = useCallback(() => {
		startTransition(() => {
			resetActiveChatAction(currentChat.chat?.id ?? "");
		});
	}, [currentChat.chat?.id, resetActiveChatAction]);

	const handleArchive = useCallback(() => {
		startTransition(() => {
			archiveActiveChatAction(currentChat.chat?.id ?? "");
		});
	}, [archiveActiveChatAction, currentChat.chat?.id]);

	const handleUpdate = useCallback(() => {
		startTransition(() => {
			updateArchiveChatAction(currentChat.chat?.id ?? "");
		});
	}, [updateArchiveChatAction, currentChat.chat?.id]);

	useToast(resetActiveState, isPendingResetActive, {
		successMessage: t("components.recipe.toast.success.resetActiveChat"),
		errorMessage: t("components.admin.users.toast.error"),
		loadingMessage: t("components.recipe.toast.loading.resetActiveChat"),
		onSuccess: () => {
			router.push("/dashboard/chat");
		},
		onPending: () => {
			onloading();
		},
	});

	useToast(updateArchiveState, isPendingUpdateArchive, {
		successMessage: t("components.recipe.toast.success.update"),
		errorMessage: t("components.admin.users.toast.error"),
		loadingMessage: t("components.recipe.toast.loading.updateActiveChat"),
		onPending: () => {
			onloading();
		},
	});

	useEffect(() => {
		if (archiveActiveState?.error?.code === "LIMIT_REACHED_PREMIUM") {
			setArchiveActiveToastErrorMessage(t("components.myRecipes.toast.limit.premium"));
		} else if (archiveActiveState?.error?.code === "LIMIT_REACHED_BASIC") {
			setArchiveActiveToastErrorMessage(t("components.myRecipes.toast.limit.basic"));
		} else if (archiveActiveState?.error) {
			setArchiveActiveToastErrorMessage(t("components.admin.users.toast.error"));
		}
	}, [archiveActiveState?.error, t]);

	useToast(archiveActiveState, isPendingArchiveActive, {
		successMessage: t("components.recipe.toast.success.create"),
		errorMessage: archiveActiveToastErrorMessage,
		loadingMessage: t("components.recipe.toast.loading.createRecipe"),
		onSuccess: () => {
			router.push("/dashboard/chat");
		},
		onPending: () => {
			onloading();
		},
		onError: () => {
			if (archiveActiveState?.error?.code === "LIMIT_REACHED_BASIC") {
				router.push("/dashboard/settings?selected=plan");
			}
		},
	});

	return (
		<>
			<div className="md:hidden">
				<DropdownMenu>
					<DropdownMenuTrigger asChild>
						<Button variant="ghost">
							<EllipsisVertical />
						</Button>
					</DropdownMenuTrigger>
					<DropdownMenuContent className="w-full" align="start">
						{currentChat.chat?.isActive ? (
							<>
								<DropdownMenuItem disabled={disabledCondition} onClick={handleReset}>
									<RefreshCcw size={16} />
									{t("button.reset")}
								</DropdownMenuItem>
								<DropdownMenuItem disabled={disabledCondition} onClick={handleArchive}>
									<Archive size={16} />
									{t("button.addRecipe")}
								</DropdownMenuItem>
							</>
						) : (
							<DropdownMenuItem disabled={disabledCondition} onClick={handleUpdate}>
								<FileInput size={16} />
								{t("button.update")}
							</DropdownMenuItem>
						)}
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="hidden md:flex gap-2">
				{currentChat.chat?.isActive ? (
					<>
						<AIInputButton disabled={disabledCondition} onClick={handleReset}>
							<RefreshCcw size={16} />
							<span>{t("button.reset")}</span>
						</AIInputButton>
						<AIInputButton disabled={disabledCondition} onClick={handleArchive}>
							<Archive size={16} />
							<span> {t("button.addRecipe")}</span>
						</AIInputButton>
					</>
				) : (
					<AIInputButton disabled={disabledCondition} onClick={handleUpdate}>
						<FileInput size={16} />
						<span> {t("button.update")}</span>
					</AIInputButton>
				)}
			</div>
		</>
	);
}
