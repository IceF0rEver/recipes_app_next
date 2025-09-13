"use client";
import { useRouter } from "next/navigation";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import type { Subscription } from "@/generated/prisma";
import { authClient } from "@/lib/auth/auth-client";
import { useCurrentLocale, useI18n } from "@/locales/client";
import SettingsArticle from "./settings-article";
import SettingsItemsHeader from "./settings-items-header";

interface PlanContentActiveProps {
	subscription: Subscription;
}

export default function PlanContentActive({ subscription }: PlanContentActiveProps) {
	const t = useI18n();
	const locale = useCurrentLocale();
	const router = useRouter();

	return (
		<article className="max-w-3xl">
			<SettingsItemsHeader
				title={t("components.settings.items.plan.title")}
				description={t("components.settings.items.plan.description")}
			/>
			<section className="flex flex-col w-full gap-9">
				{subscription.cancelAtPeriodEnd ? (
					<SettingsArticle
						className="flex flex-col gap-2"
						description={t("components.settings.form.plan.description.restorePlan")}
					>
						<form>
							<Button
								variant="default"
								size="lg"
								formAction={async () => {
									const { error } = await authClient.subscription.restore({
										subscriptionId: subscription.id,
									});
									if (error) {
										toast.error(t("components.plan.toast.restorePlan.error"));
									} else {
										toast.success(t("components.plan.toast.restorePlan.success"));
										router.refresh();
									}
								}}
							>
								{t("button.restorePlan")}
							</Button>
						</form>
					</SettingsArticle>
				) : (
					<SettingsArticle
						className="flex flex-col gap-2"
						description={t("components.settings.form.plan.description.cancelPlan")}
					>
						<form>
							<Button
								variant="default"
								size="lg"
								formAction={async () => {
									const { error } = await authClient.subscription.cancel({
										subscriptionId: subscription.id,
										returnUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/settings?selected=plan`,
									});
									if (error) {
										toast.error(t("components.plan.toast.cancelPlan.error"));
									} else {
										toast.success(t("components.plan.toast.cancelPlan.success"));
										router.refresh();
									}
								}}
							>
								{t("button.cancelPlan")}
							</Button>
						</form>
					</SettingsArticle>
				)}
			</section>
		</article>
	);
}
