"use server";
import { getUserWithSubscription } from "@/lib/auth/server";

export async function GET(_req: Request) {
	try {
		const data = await getUserWithSubscription();

		if (!data) {
			return new Response(JSON.stringify({ error: "Not authenticated" }), {
				status: 401,
				headers: { "Content-Type": "application/json" },
			});
		}

		return new Response(
			JSON.stringify({
				user: {
					id: data.user?.id,
					email: data.user?.email,
					role: data.user?.role,
				},
				subscription: data.subscription
					? {
							id: data.subscription.id,
							plan: data.subscription.plan,
							status: data.subscription.status,
							stripeCustomerId: data.subscription.stripeCustomerId,
						}
					: null,
			}),
			{ status: 200, headers: { "Content-Type": "application/json" } },
		);
	} catch (err) {
		console.error("API error:", err);
		return new Response(JSON.stringify({ error: "Internal Server Error" }), {
			status: 500,
			headers: { "Content-Type": "application/json" },
		});
	}
}
