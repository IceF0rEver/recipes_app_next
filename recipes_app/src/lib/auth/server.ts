"use server";
import { headers } from "next/headers";
import { auth } from "@/lib/auth/auth";
import prisma from "../prisma";

export const getUser = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.user;
};

export const getUserWithSubscription = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});

	if (session?.user) {
		const userWithStripe = await prisma.user.findUnique({
			where: { id: session.user.id },
		});
		const subscription = await prisma.subscription.findFirst({
			where: {
				stripeCustomerId: userWithStripe?.stripeCustomerId,
				status: "active",
			},
		});
		return { user: userWithStripe, subscription: subscription };
	}
};

export const getSession = async () => {
	const session = await auth.api.getSession({
		headers: await headers(),
	});
	return session?.session;
};
