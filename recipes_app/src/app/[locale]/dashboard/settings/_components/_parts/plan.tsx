"use client";

import { Suspense, use } from "react";
import type { PlanProps } from "@/app/[locale]/dashboard/settings/_components/_types/settings-type";
import PlanContentActive from "@/app/[locale]/dashboard/settings/_components/_utils/plan-content-active";
import PlanContentDefault from "@/app/[locale]/dashboard/settings/_components/_utils/plan-content-default";
import Loading from "@/app/[locale]/dashboard/settings/loading";

function PlanContent({ userWithSubscription }: PlanProps) {
	const { subscription } = use(userWithSubscription) ?? {};
	return (
		<>
			{subscription?.status === "active" ? (
				<PlanContentActive subscription={subscription} />
			) : (
				<PlanContentDefault />
			)}
		</>
	);
}

export default function Plan({ userWithSubscription }: PlanProps) {
	return (
		<Suspense fallback={<Loading />}>
			<PlanContent userWithSubscription={userWithSubscription} />
		</Suspense>
	);
}
