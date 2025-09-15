import { stripe } from "@better-auth/stripe";
import { betterAuth } from "better-auth";
import { prismaAdapter } from "better-auth/adapters/prisma";
import { nextCookies } from "better-auth/next-js";
import { admin as adminPlugin } from "better-auth/plugins";
import Stripe from "stripe";
import { PrismaClient } from "@/generated/prisma";
import { resend } from "../resend";
import { ac, admin, user } from "./permissions";

const prisma = new PrismaClient();

// biome-ignore lint/style/noNonNullAssertion: .env
const stripeClient = new Stripe(process.env.STRIPE_SECRET_KEY!, {
	apiVersion: "2025-08-27.basil",
});

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
				subject: "Réinitialisation du mot de passe",
				text: `Réinitialisation du mot de passe : ${data.url}`,
				html: `
                <div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
                    <h2>Réinitialisation du mot de passe</h2>
                    <p>Bonjour ${data.user.name},</p>
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
			},
		}),
		stripe({
			stripeClient,
			// biome-ignore lint/style/noNonNullAssertion: .env
			stripeWebhookSecret: process.env.STRIPE_WEBHOOK_SECRET!,
			createCustomerOnSignUp: true,
			getCustomerCreateParams: async ({ user }, _request) => {
				return {
					metadata: {
						userId: user.id,
					},
				};
			},
			subscription: {
				enabled: true,
				plans: [
					{
						name: "premium",
						// biome-ignore lint/style/noNonNullAssertion: .env
						priceId: process.env.STRIPE_PLAN_PREMIUM_ID!,
						limits: {
							recipes: 25,
							exportPdt: 1,
						},
					},
				],
				onSubscriptionComplete: async ({ subscription }) => {
					const user = await prisma.user.findFirst({
						where: {
							stripeCustomerId: subscription.stripeCustomerId,
						},
					});

					if (user) {
						await resend.emails.send({
							from: "noreply@mybudget.ovh",
							to: user.email,
							subject: "Activation de votre abonnement Premium",
							html: `
								<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
								<h2>Activation dans votre abonnement Premium</h2>
								<p>Bonjour ${user.name},</p>
								<p>Votre abonnement <strong>Premium</strong> à Recipes Master est maintenant actif.</p>
								<p>Vous pouvez désormais profiter de toutes les fonctionnalités réservées aux membres Premium.</p>
								<p>Merci pour votre confiance,<br>L’équipe Recipes Master</p>
								</div>
							`,
						});
					}
				},
				onSubscriptionUpdate: async ({ subscription }) => {
					const user = await prisma.user.findFirst({
						where: {
							stripeCustomerId: subscription.stripeCustomerId,
						},
					});

					if (subscription.status === "active" && user) {
						if (subscription.cancelAtPeriodEnd) {
							await resend.emails.send({
								from: "noreply@mybudget.ovh",
								to: user.email,
								subject: "Annulation de votre abonnement Premium",
								html: `
									<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
										<h2>Annulation de votre abonnement Premium</h2>
										<p>Bonjour ${user.name},</p>
										<p>Votre abonnement Premium à Recipes Master vient d'être annuler.</p>
										<p>L’équipe Recipes Master.</p>
									</div>
								`,
							});
						} else {
							await resend.emails.send({
								from: "noreply@mybudget.ovh",
								to: user.email,
								subject: "Restauration de votre abonnement Premium",
								html: `
									<div style="font-family: Arial, sans-serif; line-height: 1.6; color: #333;">
										<h2>Restauration de votre abonnement Premium</h2>
										<p>Bonjour ${user.name},</p>
										<p>Votre abonnement Premium à Recipes Master vient d'être restaurer.</p>
										<p>L’équipe Recipes Master.</p>
									</div>
								`,
							});
						}
					}
				},
			},
		}),
		nextCookies(),
	],
});
