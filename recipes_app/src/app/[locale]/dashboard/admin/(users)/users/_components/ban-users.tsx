"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type { UserWithRole } from "better-auth/plugins";
import { Loader2 } from "lucide-react";
import { startTransition, useActionState, useCallback, useEffect } from "react";
import { useForm } from "react-hook-form";
import { toast } from "sonner";
import type { z } from "zod";
import { Button } from "@/components/ui/button";
import { Form } from "@/components/ui/form";
import GenericField from "@/components/utils/form/generic-field";
import GenericSheet from "@/components/utils/sheet/generic-sheet";
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

	const [state, formAction, isPending] = useActionState(banUser, {
		success: false,
	});

	const form = useForm<BanUserType>({
		resolver: zodResolver(banUserSchema),
		defaultValues: getDefaultValues(),
	});

	const onSubmit = (values: BanUserType) => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id) {
				const formData = new FormData();
				formData.append("userId", userData.id);
				formData.append("banReason", values.banReason);
				formData.append("banExpires", values.banExpires);
				startTransition(() => {
					formAction(formData);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalIdError"));
		}
	};

	useEffect(() => {
		form.reset(getDefaultValues());
	}, [form, getDefaultValues]);

	useEffect(() => {
		if (state.success === true) {
			toast.success(
				state.message || t("components.admin.users.toast.ban.success"),
			);
			onSheetOpen(false);
		} else if (state.success === false && state.error) {
			console.error(`${state.error.status} - ${state.error.code}`);
			toast.error(t("components.admin.users.toast.error"));
		}
	}, [state, t, onSheetOpen]);

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
					datas={[
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
					]}
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

	const [state, formAction, isPending] = useActionState(unBanUser, {
		success: false,
	});

	const form = useForm<UnBanUserType>({
		resolver: zodResolver(unBanUserSchema),
		defaultValues: getDefaultValues(),
	});

	const onSubmit = () => {
		if (userData?.id !== currentUser?.user.id) {
			if (userData?.id) {
				const formData = new FormData();
				formData.append("userId", userData?.id);
				startTransition(() => {
					formAction(formData);
				});
			}
		} else {
			toast.error(t("components.admin.users.toast.identicalIdError"));
		}
	};

	useEffect(() => {
		form.reset(getDefaultValues());
	}, [form, getDefaultValues]);

	useEffect(() => {
		if (state.success === true) {
			toast.success(
				state.message || t("components.admin.users.toast.unban.success"),
			);
			onSheetOpen(false);
		} else if (state.success === false && state.error) {
			console.error(`${state.error.status} - ${state.error.code}`);
			toast.error(t("components.admin.users.toast.error"));
		}
	}, [state, t, onSheetOpen]);

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
