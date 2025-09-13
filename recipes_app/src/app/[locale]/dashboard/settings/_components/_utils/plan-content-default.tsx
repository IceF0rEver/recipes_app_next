"use client";

import { useRouter } from "next/navigation";
import { toast } from "sonner";
import PlanCard from "@/app/[locale]/dashboard/settings/_components/_utils/plan-card";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useCurrentLocale, useI18n } from "@/locales/client";

export default function PlanContentDefault() {
	const t = useI18n();
	const locale = useCurrentLocale();
	const router = useRouter();

	const freeFeatures = [t("components.plan.features.chatBot"), t("components.plan.features.limit3")];

	const premiumFeatures = [
		t("components.plan.features.chatBot"),
		t("components.plan.features.limit25"),
		t("components.plan.features.pdfExport"),
	];
	return (
		<div className="container mx-auto space-y-4">
			<div className="text-center mb-16">
				<h1 className="text-4xl md:text-5xl font-bold text-balance mb-6">
					{t("components.plan.layout.title")}
				</h1>
				<p className="text-xl text-muted-foreground text-pretty max-w-2xl mx-auto">
					{t("components.plan.layout.description")}
				</p>
			</div>
			<form className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
				<PlanCard
					title={t("components.plan.free.title")}
					description={t("components.plan.free.description")}
					itemsContent={freeFeatures}
					amount="0€"
				>
					<Button variant={"outline"} className="w-full" size="lg" disabled>
						{t("button.currentPlan")}
					</Button>
				</PlanCard>

				<PlanCard
					enableBadge
					badgeLabel={t("components.badge.recommended")}
					title={t("components.plan.premium.title")}
					description={t("components.plan.premium.description")}
					itemsContent={premiumFeatures}
					amount="4.99€"
				>
					<Button
						variant={"default"}
						className="w-full"
						size="lg"
						formAction={async () => {
							const { error } = await authClient.subscription.upgrade({
								plan: "premium",
								successUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/settings?selected=plan`,
								cancelUrl: `${process.env.NEXT_PUBLIC_APP_URL}/${locale}/dashboard/settings?selected=plan`,
							});
							if (error) {
								toast.error(t("components.plan.toast.error"));
							} else {
								toast.success(t("components.plan.toast.success"));
								router.refresh();
							}
						}}
					>
						{t("button.premium")}
					</Button>
				</PlanCard>
			</form>
		</div>
	);
}
