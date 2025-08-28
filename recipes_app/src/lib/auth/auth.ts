import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import { PrismaClient } from "@/generated/prisma";
import { resend } from "../resend";
import { ac, admin, premium, user } from "./permissions";

const prisma = new PrismaClient();

export const auth = betterAuth({
	trustedOrigins: [
		"http://localhost:3000",
		"http://192.168.0.11:3000",
		"https://recipes-app-next-ten.vercel.app/",
	],
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
				html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Réinitialisation du mot de passe</h2>
                    <p>Bonjour ${data.user.email},</p>
                    <p>Vous avez demandé à réinitialiser votre mot de passe. Cliquez sur le bouton ci-dessous pour continuer :</p>
                    <a href="${data.url}" style="display: inline-block; padding: 10px 20px; margin: 10px 0; background-color: #4CAF50; color: white; text-decoration: none; border-radius: 5px;">Réinitialiser le mot de passe</a>
                    <p>Si vous n’avez pas demandé cette réinitialisation, ignorez simplement cet email.</p>
                    <p>Merci,<br>L’équipe Recipes Master</p>
                </div>
            `,
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
	rateLimit: {
		enabled: false,
	},
	plugins: [
		adminPlugin({
			ac,
			roles: {
				admin,
				user,
				premium,
			},
		}),
		nextCookies(),
	],
});
