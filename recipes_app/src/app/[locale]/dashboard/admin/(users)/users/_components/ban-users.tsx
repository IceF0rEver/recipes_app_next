"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UserWithRole } from "better-auth/plugins";
import { Loader2 } from "lucide-react";
import {
	startTransition,
	useActionState,
	useCallback,
	useEffect,
	useMemo,
} from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import GenericField from "@/components/utils/form/generic-field";
import GenericSheet from "@/components/utils/sheet/generic-sheet";
import { useToast } from "@/hooks/use-toast";
import { useSession } from "@/lib/auth/auth-client";
import { authSchemas } from "@/lib/zod/auth-schemas";
import { useI18n } from "@/locales/client";
import { banUser, unBanUser } from "./_serveractions/actions";

interface BanUsersProps {
	sheetOpen: boolean;
	onSheetOpen: (sheetOpen: boolean) => void;
	userData: UserWithRole | null;
}

function BanUser({ userData, onSheetOpen }: BanUsersProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();
	const banList = useMemo(
		() => [
			{
				label: t("components.admin.users.ban.duration.oneHour"),
				value: "3600",
			},
			{
				label: t("components.admin.users.ban.duration.threeHours"),
				value: "10800",
			},
			{
				label: t("components.admin.users.ban.duration.twelveHours"),
				value: "43200",
			},
			{
				label: t("components.admin.users.ban.duration.oneDay"),
				value: "86400",
			},
			{
				label: t("components.admin.users.ban.duration.sevenDays"),
				value: "604800",
			},
			{
				label: t("components.admin.users.ban.duration.oneMonth"),
				value: "2419200",
			},
			{
				label: t("components.admin.users.ban.duration.permanent"),
				value: "-1",
			},
		],
		[t],
	);

	const banUserSchema = authSchemas(t).banUser;
	type BanUserType = z.infer<typeof banUserSchema>;

	const getDefaultValues = useCallback(
		(banData?: BanUserType) => ({
			userId: userData?.id,
			banExpires: banData?.banExpires || "",
			banReason: banData?.banReason || "",
		}),
		[userData?.id],
	);

	const [state, banFormAction, isPending] = useActionState(banUser, {
		success: false,
	});

	const form = useForm<BanUserType>({
		resolver: zodResolver(banUserSchema),
		defaultValues: getDefaultValues(),
	});

	const onSubmit = useCallback(
		(values: BanUserType) => {
			if (userData?.id !== currentUser?.user.id) {
				if (userData?.id) {
					const formData = new FormData();
					formData.append("userId", userData.id);
					formData.append("banReason", values.banReason);
					formData.append("banExpires", values.banExpires);
					startTransition(() => {
						banFormAction(formData);
					});
				}
			} else {
				toast.error(t("components.admin.users.toast.identicalIdError"));
			}
		},
		[currentUser, t, banFormAction, userData],
	);

	useEffect(() => {
		form.reset(getDefaultValues());
	}, [form, getDefaultValues]);

	useToast(state, isPending, {
		successMessage: t("components.admin.users.toast.ban.success"),
		errorMessage: t("components.admin.users.toast.error"),
		onSuccess: () => {
			onSheetOpen(false);
		},
	});

	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 px-4">
				<GenericField
					label={t("components.admin.users.form.banReason.label")}
					control={form.control}
					name="banReason"
					type="text"
				/>
				<GenericField
					label={t("components.admin.users.form.banExpires.label")}
					control={form.control}
					name="banExpires"
					type="text"
					fieldType="select"
					className="w-full"
					placeholder={t("button.choice")}
					datas={banList}
				/>
				<Button
					type="submit"
					variant="default"
					className="w-full"
					disabled={isPending}
				>
					{isPending ? (
						<Loader2 size={16} className="animate-spin" />
					) : (
						<span>{t("button.ban")}</span>
					)}
				</Button>
			</form>
		</Form>
	);
}

function UnBanUser({ userData, onSheetOpen }: BanUsersProps) {
	const t = useI18n();
	const { data: currentUser } = useSession();

	const unBanUserSchema = authSchemas(t).unBanUser;
	type UnBanUserType = z.infer<typeof unBanUserSchema>;

	const getDefaultValues = useCallback(
		(_banData?: UnBanUserType) => ({
			userId: userData?.id,
		}),
		[userData?.id],
	);

	const [state, unBanUserAction, isPending] = useActionState(unBanUser, {
		success: false,
	});

	const form = useForm<UnBanUserType>({
		resolver: zodResolver(unBanUserSchema),
		defaultValues: getDefaultValues(),
	});

	const onSubmit = useCallback(() => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id) {
				startTransition(() => {
					unBanUserAction(userData?.id);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalIdError"));
		}
	}, [t, currentUser, unBanUserAction, userData]);

	useEffect(() => {
		form.reset(getDefaultValues());
	}, [form, getDefaultValues]);

	useToast(state, isPending, {
		successMessage: t("components.admin.users.toast.unban.success"),
		errorMessage: t("components.admin.users.toast.error"),
		onSuccess: () => {
			onSheetOpen(false);
		},
	});

	return (
		<form onSubmit={form.handleSubmit(onSubmit)} className="grid gap-6 px-4">
			<Button
				type="submit"
				variant="default"
				className="w-full"
				disabled={isPending}
			>
				{isPending ? (
					<Loader2 size={16} className="animate-spin" />
				) : (
					<span>{t("button.unban")}</span>
				)}
			</Button>
		</form>
	);
}

export default function BanUsers({
	sheetOpen,
	onSheetOpen,
	userData,
}: BanUsersProps) {
	const t = useI18n();
	return (
		<GenericSheet
			sheetOpen={sheetOpen}
			onSheetOpen={onSheetOpen}
			title={t("components.admin.users.ban.title")}
			description={t("components.admin.users.ban.description")}
		>
			{userData?.banned ? (
				<UnBanUser
					userData={userData}
					sheetOpen={sheetOpen}
					onSheetOpen={onSheetOpen}
				/>
			) : (
				<BanUser
					userData={userData}
					sheetOpen={sheetOpen}
					onSheetOpen={onSheetOpen}
				/>
			)}
		</GenericSheet>
	);
}
