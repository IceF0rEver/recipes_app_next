export interface User {
	id: string | null;
	email: string | null;
	role: string | null;
}

export interface Subscription {
	id: string | null;
	plan: string | null;
	status: string | null;
	stripeCustomerId: string | null;
}

export interface UserWithSubscriptionResponse {
	user: User;
	subscription: Subscription | null;
}

export interface ErrorResponse {
	error: string;
}
