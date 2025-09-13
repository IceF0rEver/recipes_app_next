import type { Subscription, User } from "@/generated/prisma";

interface UserWithSubscription {
	user: User | null;
	subscription: Subscription | null;
}

export interface SettingsPageProps {
	userWithSubscription: Promise<UserWithSubscription | undefined>;
}

export interface PlanProps {
	userWithSubscription: Promise<UserWithSubscription | undefined>;
}
