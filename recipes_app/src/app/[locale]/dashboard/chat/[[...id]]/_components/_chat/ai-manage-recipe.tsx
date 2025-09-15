"use client";

import type { UIDataTypes, UIMessage, UITools } from "ai";
import { Archive, EllipsisVertical, FileInput, RefreshCcw } from "lucide-react";
import { useRouter } from "next/navigation";
import {
	startTransition,
	use,
	useActionState,
	useCallback,
	useEffect,
	useMemo,
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
import {
	archiveActiveChat,
	resetActiveChat,
	updateArchiveChat,
} from "../_serveractions/actions";

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
export default function AiManageRecipe({
	status,
	onloading,
	chat,
	messages,
}: ManageRecipeProps) {
	const t = useI18n();
	const router = useRouter();
	const currentChat = use(chat);
	const toastArchiveChat = useRef<string | number | null>(null);
	const toastUpdateArchiveChat = useRef<string | number | null>(null);
	const toastResetChat = useRef<string | number | null>(null);

	const [resetActiveState, resetActiveChatAction, isPendingResetActive] =
		useActionState(resetActiveChat, {
			success: false,
		});
	const [archiveActiveState, archiveActiveChatAction, isPendingArchiveActive] =
		useActionState(archiveActiveChat, {
			success: false,
		});
	const [updateArchiveState, updateArchiveChatAction, isPendingUpdateArchive] =
		useActionState(updateArchiveChat, {
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

	// biome-ignore lint/correctness/useExhaustiveDependencies: i18n and router
	useEffect(() => {
		if (resetActiveState.success === true && toastResetChat.current) {
			toast.success(t("components.recipe.toast.success.resetActiveChat"), {
				id: toastResetChat.current,
			});
			router.push("/dashboard/chat");
		} else if (
			resetActiveState.success === false &&
			resetActiveState.error &&
			toastResetChat.current
		) {
			toast.error(t("components.admin.users.toast.error"), {
				id: toastResetChat.current,
			});
			console.error(
				`${resetActiveState.error.status} - ${resetActiveState.error.code}`,
			);
		}

		if (archiveActiveState.success === true && toastArchiveChat.current) {
			toast.success(t("components.recipe.toast.success.create"), {
				id: toastArchiveChat.current,
			});
			router.push("/dashboard/chat");
		} else if (
			archiveActiveState.success === false &&
			archiveActiveState.error &&
			toastArchiveChat.current
		) {
			if (archiveActiveState.error.code === "LIMIT_REACHED_PREMIUM") {
				toast.error(t("components.myRecipes.toast.limit.premium"), {
					id: toastArchiveChat.current,
				});
			} else if (archiveActiveState.error.code === "LIMIT_REACHED_BASIC") {
				toast.error(t("components.myRecipes.toast.limit.basic"), {
					id: toastArchiveChat.current,
				});
				setTimeout(() => {
					toastArchiveChat.current = null;
				}, 150);
				router.push("/dashboard/settings?selected=plan");
			} else {
				toast.error(t("components.admin.users.toast.error"), {
					id: toastArchiveChat.current,
				});
				console.error(
					`${archiveActiveState.error.status} - ${archiveActiveState.error.code}`,
				);
			}
		}

		if (updateArchiveState.success === true && toastUpdateArchiveChat.current) {
			toast.success(t("components.recipe.toast.success.update"), {
				id: toastUpdateArchiveChat.current,
			});
		} else if (
			updateArchiveState.success === false &&
			updateArchiveState.error &&
			toastUpdateArchiveChat.current
		) {
			toast.error(t("components.admin.users.toast.error"), {
				id: toastUpdateArchiveChat.current,
			});
			console.error(
				`${updateArchiveState.error.status} - ${updateArchiveState.error.code}`,
			);
		}
	}, [resetActiveState, archiveActiveState, updateArchiveState]);

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

		if (isPendingUpdateArchive) {
			toastUpdateArchiveChat.current = toast.loading(
				t("components.recipe.toast.loading.updateActiveChat"),
			);
		} else if (toastUpdateArchiveChat.current) {
			toastUpdateArchiveChat.current = null;
		}

		onloading();
	}, [isPendingResetActive, isPendingArchiveActive, isPendingUpdateArchive]);

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
								<DropdownMenuItem
									disabled={disabledCondition}
									onClick={handleReset}
								>
									<RefreshCcw size={16} />
									{t("button.reset")}
								</DropdownMenuItem>
								<DropdownMenuItem
									disabled={disabledCondition}
									onClick={handleArchive}
								>
									<Archive size={16} />
									{t("button.addRecipe")}
								</DropdownMenuItem>
							</>
						) : (
							<DropdownMenuItem
								disabled={disabledCondition}
								onClick={handleUpdate}
							>
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
