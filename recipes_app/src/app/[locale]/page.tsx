import { Check } from "lucide-react";
import Link from "next/link";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader } from "@/components/ui/card";
import DarkMode from "@/components/utils/dark-mode";
import SelectLang from "@/components/utils/select-lang";
import { getI18n } from "@/locales/server";

export default async function HeroPage() {
	const t = await getI18n();
	const features = [
		{ key: "chatbot", value: t("heroPage.features.chatbot") },
		{ key: "recipes", value: t("heroPage.features.recipes") },
		{ key: "pdf", value: t("heroPage.features.pdf") },
	];
	return (
		<section className="min-h-screen flex flex-col gap-6 md:gap-12 items-center justify-center bg-background text-foreground px-4 md:px-8 py-4">
			<div className="flex flex-col md:flex-row gap-6 md:gap-12 items-center max-w-7xl w-full">
				<div className="space-y-6">
					<div className="flex items-center justify-between">
						<Badge variant="outline" className="text-sm">
							{t("heroPage.badge")}
						</Badge>
						<SelectLang />
					</div>
					<h1 className="text-4xl md:text-5xl font-bold tracking-tight">
						<span>{t("heroPage.title.firstPart")}</span>
						<span className="text-primary">
							{t("heroPage.title.secondPart")}
						</span>
					</h1>
					<p className="text-muted-foreground text-lg">
						{t("heroPage.description")}
					</p>
					<div className="flex gap-4 flex-wrap">
						<Link href="/auth/register">
							<Button size="lg" className="shadow-md">
								{t("button.register")}
							</Button>
						</Link>
						<Link href="/auth/login">
							<Button size="lg" className="shadow-md" variant="secondary">
								{t("button.login")}
							</Button>
						</Link>
					</div>
					<ul className="mt-6 space-y-2 text-muted-foreground">
						{features.map((feature) => (
							<li key={feature.key} className="flex items-center gap-2">
								<Check className="w-4 h-4 text-primary" />
								<span>{feature.value}</span>
							</li>
						))}
					</ul>
				</div>
				<div className="relative w-full h-80 md:h-[500px] animate-fade-in">
					<Card className="h-full py-4">
						<CardHeader className="border-b-1 pb-4 flex gap-2 px-3">
							<span className="size-3 rounded-full bg-red-500"></span>
							<span className="size-3 rounded-full bg-yellow-500"></span>
							<span className="size-3 rounded-full bg-green-500"></span>
						</CardHeader>
						<CardContent>
							{/* <Image
									src="/illustrations/ai-cooking.svg"
									alt="Illustration IA et cuisine"
									fill
									className="object-contain"
									priority
									/> */}
						</CardContent>
					</Card>
				</div>
			</div>
			<div className="float-end max-w-7xl w-full">
				<DarkMode className="float-end" />
			</div>
		</section>
	);
}
