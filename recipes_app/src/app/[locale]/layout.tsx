import { DM_Sans, Playfair_Display, Fira_Code } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@/components/ui/sonner";
import type { ReactElement } from "react";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProviderClient } from "@/locales/client";

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
						{/* <Toaster /> */}
					</I18nProviderClient>
				</ThemeProvider>
			</body>
		</html>
	);
}
