"use client";

import { Archive, EllipsisVertical, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	startTransition,
	useActionState,
	useCallback,
	useEffect,
	useRef,
} from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import {
	DropdownMenu,
	DropdownMenuContent,
	DropdownMenuItem,
	DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { AIInputButton } from "@/components/ui/kibo-ui/ai/input";
import type { Chat } from "@/generated/prisma";
import { useI18n } from "@/locales/client";
import { archiveActiveChat, resetActiveChat } from "../_serveractions/actions";

type Status = "submitted" | "streaming" | "ready" | "error";

interface ManageRecipeProps {
	status: Status;
	onloading: () => void;
	chatId: Chat["id"];
}
export default function AiManageRecipe({
	status,
	onloading,
	chatId,
}: ManageRecipeProps) {
	const t = useI18n();
	const router = useRouter();
	const toastArchiveChat = useRef<string | number | null>(null);
	const toastResetChat = useRef<string | number | null>(null);
	const disabledCondition = status === "error" || status === "streaming";

	const [resetActiveState, resetActiveChatAction, isPendingResetActive] =
		useActionState(resetActiveChat, { success: false });
	const [archiveActiveState, archiveActiveChatAction, isPendingArchiveActive] =
		useActionState(archiveActiveChat, { success: false });

	const handleReset = useCallback(() => {
		startTransition(() => {
			resetActiveChatAction(chatId);
		});
	}, [chatId, resetActiveChatAction]);

	const handleArchive = useCallback(() => {
		startTransition(() => {
			archiveActiveChatAction(chatId);
		});
	}, [archiveActiveChatAction, chatId]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: i18n and router
	useEffect(() => {
		if (resetActiveState.success === true) {
			if (toastResetChat.current) {
				toast.success(t("components.recipe.toast.success.resetActiveChat"), {
					id: toastResetChat.current,
				});
			}
			router.push("/dashboard/chat");
		} else if (resetActiveState.success === false && resetActiveState.error) {
			console.error(
				`${resetActiveState.error.status} - ${resetActiveState.error.code}`,
			);
			toast.error(t("components.admin.users.toast.error"));
		}

		if (archiveActiveState.success === true) {
			if (toastArchiveChat.current) {
				toast.success(t("components.recipe.toast.success.resetActiveChat"), {
					id: toastArchiveChat.current,
				});
			}
			router.push("/dashboard/chat");
		} else if (
			archiveActiveState.success === false &&
			archiveActiveState.error
		) {
			console.error(
				`${archiveActiveState.error.status} - ${archiveActiveState.error.code}`,
			);
			toast.error(t("components.admin.users.toast.error"));
		}
	}, [resetActiveState, archiveActiveState]);

	// biome-ignore lint/correctness/useExhaustiveDependencies: i18n and onloading
	useEffect(() => {
		if (isPendingResetActive) {
			toastResetChat.current = toast.loading(
				t("components.recipe.toast.loading.resetActiveChat"),
			);
		} else if (toastResetChat.current) {
			toastResetChat.current = null;
		}

		if (isPendingArchiveActive) {
			toastArchiveChat.current = toast.loading(
				t("components.recipe.toast.loading.createRecipe"),
			);
		} else if (toastArchiveChat.current) {
			toastArchiveChat.current = null;
		}

		onloading();
	}, [isPendingResetActive, isPendingArchiveActive]);

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
						<DropdownMenuItem
							disabled={disabledCondition}
							onClick={() => handleReset()}
						>
							<RefreshCcw size={16} />
							{t("button.reset")}
						</DropdownMenuItem>
						<DropdownMenuItem
							disabled={disabledCondition}
							onClick={() => handleArchive()}
						>
							<Archive size={16} />
							{t("button.addRecipe")}
						</DropdownMenuItem>
					</DropdownMenuContent>
				</DropdownMenu>
			</div>
			<div className="hidden md:flex">
				<AIInputButton disabled={disabledCondition} onClick={handleReset}>
					<RefreshCcw size={16} />
					<span>{t("button.reset")}</span>
				</AIInputButton>
				<AIInputButton disabled={disabledCondition} onClick={handleArchive}>
					<Archive size={16} />
					<span> {t("button.addRecipe")}</span>
				</AIInputButton>
			</div>
		</>
	);
}
