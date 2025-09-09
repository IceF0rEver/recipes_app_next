"use client";

import { useI18n } from "@/locales/client";
import PlanCard from "./_components/plan-card";

export default function Page() {
	const t = useI18n();

	const freeFeatures = [
		t("components.plan.features.chatBot"),
		t("components.plan.features.limit3"),
	];

	const premiumFeatures = [
		t("components.plan.features.chatBot"),
		t("components.plan.features.limit25"),
		t("components.plan.features.pdfExport"),
	];

	const handleUpgrade = () => {};

	return (
		<div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
			<PlanCard
				title={t("components.plan.free.title")}
				description={t("components.plan.free.description")}
				itemsContent={freeFeatures}
				disableButton={true}
				buttonLabel={t("button.currentPlan")}
			>
				<div className="mt-4">
					<span className="text-4xl font-bold">0€</span>
				</div>
			</PlanCard>
			<PlanCard
				enableBadge
				badgeLabel={t("components.badge.recommended")}
				title={t("components.plan.premium.title")}
				description={t("components.plan.premium.description")}
				buttonLabel={t("button.premium")}
				buttonHandleAction={handleUpgrade}
				itemsContent={premiumFeatures}
			>
				<div className="mt-4">
					<span className="text-4xl font-bold">19€</span>
				</div>
			</PlanCard>
		</div>
	);
}
