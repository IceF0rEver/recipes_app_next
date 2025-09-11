"use client";

import { Suspense, useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { Button } from "@/components/ui/button";
import { authClient } from "@/lib/auth/auth-client";
import { useI18n } from "@/locales/client";
import type { UserWithSubscriptionResponse } from "@/types/subscription-types";
import PlanCard from "../_utils/plan-card";

function PlanSkeleton() {
	return (
		<div className="container mx-auto space-y-4">
			<div className="text-center mb-16">
				<div className="h-12 bg-gray-200 rounded-lg animate-pulse mb-6 max-w-md mx-auto" />
				<div className="h-6 bg-gray-200 rounded-lg animate-pulse max-w-2xl mx-auto" />
			</div>
			<div className="grid md:grid-cols-2 gap-12 max-w-4xl mx-auto">
				<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
				<div className="h-96 bg-gray-200 rounded-lg animate-pulse" />
			</div>
		</div>
	);
}

function PlanContent() {
	const t = useI18n();
	const [userWithSubscription, setUserWithSubscription] =
		useState<UserWithSubscriptionResponse | null>(null);
	const [_isLoading, setIsLoading] = useState(true);

	// biome-ignore lint/correctness/useExhaustiveDependencies: i18n
	const fetchData = useCallback(async () => {
		try {
			setIsLoading(true);
			const res = await fetch("/api/subscription", {
				method: "GET",
				headers: { "Content-Type": "application/json" },
				cache: "no-store",
			});
			const data: UserWithSubscriptionResponse = await res.json();

			if (!res.ok) {
				toast.error(t("components.plan.toast.error"));
				return;
			}

			setUserWithSubscription(data);
		} catch (err) {
			console.error(err);
			toast.error(t("components.plan.toast.error"));
		} finally {
			setIsLoading(false);
		}
	}, []);

	useEffect(() => {
		fetchData();
	}, [fetchData]);

	const freeFeatures = [
		t("components.plan.features.chatBot"),
		t("components.plan.features.limit3"),
	];

	const premiumFeatures = [
		t("components.plan.features.chatBot"),
		t("components.plan.features.limit25"),
		t("components.plan.features.pdfExport"),
	];

	return (
		<>
			{userWithSubscription ? (
				<div>Vous êtes premium</div>
			) : (
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
										disableRedirect: true,
									});
									if (error) {
										toast.error(t("components.plan.toast.error"));
									} else {
										toast.success(t("components.plan.toast.success"));
									}
								}}
							>
								{t("button.premium")}
							</Button>
						</PlanCard>
					</form>
				</div>
			)}
		</>
	);
}

export default function Plan() {
	return (
		<Suspense fallback={<PlanSkeleton />}>
			<PlanContent />
		</Suspense>
	);
}
