import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";
// import { Toaster } from "@/components/ui/sonner";
import type { ReactElement } from "react";
import ThemeColorProvider from "@/components/providers/theme-color-provider";
import { ThemeProvider } from "@/components/providers/theme-provider";
import { I18nProviderClient } from "@/locales/client";

const geistSans = Geist({
	variable: "--font-geist-sans",
	subsets: ["latin"],
});

const geistMono = Geist_Mono({
	variable: "--font-geist-mono",
	subsets: ["latin"],
});

type RootLayoutProps = {
	params: Promise<{ locale: string }>;
	children: ReactElement;
};
export default async function RootLayout({ params, children }: RootLayoutProps) {
	const { locale } = await params;

	return (
		<html lang={locale} suppressHydrationWarning>
			<body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
				<ThemeProvider attribute="class" defaultTheme="system" enableSystem disableTransitionOnChange>
					<I18nProviderClient locale={locale}>
						<ThemeColorProvider>
							{children}
							{/* <Toaster /> */}
						</ThemeColorProvider>
					</I18nProviderClient>
				</ThemeProvider>
			</body>
		</html>
	);
}
