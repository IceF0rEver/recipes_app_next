import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { PrismaClient } from "@/generated/prisma";
import { admin as adminPlugin } from "better-auth/plugins";
import { ac, admin, premium, user } from "./permissions";
import { resend } from "../resend";

const prisma = new PrismaClient();

export const auth = betterAuth({
	databaseHooks: {
		user: {
			create: {
				before: async (user) => {
					return {
						data: {
							...user,
							firstName: user.name.split(" ")[0],
							lastName: user.name.split(" ")[1],
						},
					};
				},
			},
		},
	},
	database: prismaAdapter(prisma, {
		provider: "postgresql",
	}),
	emailAndPassword: {
		enabled: true,
		async sendResetPassword(data) {
			await resend.emails.send({
				from: "noreply@mybudget.ovh",
				to: data.user.email,
				subject: "Reset Password",
				text: `Reset password : ${data.url}`,
			});
		},
	},
	user: {
		changeEmail: {
			enabled: true,
		},
	},
	socialProviders: {
		google: {
			prompt: "select_account",
			clientId: process.env.GOOGLE_CLIENT_ID ?? "",
			clientSecret: process.env.GOOGLE_CLIENT_SECRET ?? "",
		},
		// github: {
		//     clientId: process.env.GITHUB_CLIENT_ID!,
		//     clientSecret: process.env.GITHUB_CLIENT_SECRET!
		// }
	},
	plugins: [
		adminPlugin({
            ac,
            roles: {
                admin,
                user,
                premium
            }
        }),
		nextCookies()
	],
});
