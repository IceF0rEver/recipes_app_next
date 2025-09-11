import { stripeClient } from "@better-auth/stripe/client";
import { adminClient } from "better-auth/client/plugins";
import { createAuthClient } from "better-auth/react";
import { ac, admin, user } from "./permissions";

export const authClient = createAuthClient({
	baseURL: process.env.NEXT_PUBLIC_APP_URL,
	plugins: [
		adminClient({
			ac,
			roles: {
				admin,
				user,
			},
		}),
		stripeClient({
			subscription: true,
		}),
	],
});

export const { signIn, signOut, signUp, useSession } = authClient;

export type ErrorCode = keyof typeof authClient.$ERROR_CODES;
