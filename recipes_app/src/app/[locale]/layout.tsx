import { DM_Sans, Playfair_Display, Fira_Code } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";
import type { ReactElement } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProviderClient } from "@/locales/client";
import type { Metadata } from "next";
import { getI18n } from "@/locales/server";

const dmSans = DM_Sans({
	variable: "--font-sans",
	subsets: ["latin"],
	display: "swap",
});

const playfairDisplay = Playfair_Display({
	variable: "--font-serif",
	subsets: ["latin"],
	display: "swap",
});

const firaCode = Fira_Code({
	variable: "--font-mono",
	subsets: ["latin"],
	display: "swap",
});

export async function generateMetadata(): Promise<Metadata> {
	const t = await getI18n();
	return {
		title: {
			default: t("metaData.defaultTitle"),
			template: `${t("metaData.defaultTitle")} - %s`,
		},
		description: t("metaData.heroLayout.description"),
		keywords: [
			t("metaData.heroLayout.keywords.recipe"),
			t("metaData.heroLayout.keywords.cooking"),
			t("metaData.heroLayout.keywords.dashboard"),
			t("metaData.heroLayout.keywords.ai_assistant"),
			t("metaData.heroLayout.keywords.pdf_export"),
		],
		metadataBase: new URL("https://recipes-app-next-ten.vercel.app/"),
		alternates: {
			canonical: "/",
			languages: {
				"fr-FR": "/fr",
				"en-US": "/en",
			},
		},
		openGraph: {
			type: "website",
			locale: "fr_FR",
			url: "https://recipes-app-next-ten.vercel.app/",
			title: t("metaData.defaultTitle"),
			description: t("metaData.heroLayout.description"),
			siteName: t("metaData.defaultTitle"),
			images: [
				{
					url: "/og-image.jpg",
					width: 1200,
					height: 630,
					alt: `${t("metaData.defaultTitle")} - Image`,
				},
			],
		},
		robots: {
			index: true,
			follow: true,
			googleBot: {
				index: true,
				follow: true,
				"max-video-preview": -1,
				"max-image-preview": "large",
				"max-snippet": -1,
			},
		},
		category: "recipes",
	};
}

type RootLayoutProps = {
	params: Promise<{ locale: string }>;
	children: ReactElement;
};
export default async function RootLayout({ params, children }: RootLayoutProps) {
	const { locale } = await params;

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${dmSans.variable} ${playfairDisplay.variable} ${firaCode.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<I18nProviderClient locale={locale}>
						{children}
						<Toaster />
					</I18nProviderClient>
				</ThemeProvider>
			</body>
		</html>
	);
}
