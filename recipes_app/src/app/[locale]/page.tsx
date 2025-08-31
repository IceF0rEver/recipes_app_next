import { Check } from "lucide-react";
// import Image from "next/image";
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
		<div className="min-h-screen flex justify-center items-center">
			<section className="container bg-background text-foreground md:px-8 p-4">
				<div className="grid grid-cols-1 xl:grid-cols-2 gap-6 md:gap-12 items-center justify-center py-4 md:py-6 w-full">
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
						<div className="flex gap-2">
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
						<ul className="space-y-2 text-muted-foreground">
							{features.map((feature) => (
								<li key={feature.key} className="flex items-center gap-2">
									<Check className="w-4 h-4 text-primary" />
									<span>{feature.value}</span>
								</li>
							))}
						</ul>
					</div>
					<div className="h-full">
						<Card className="h-full pt-4 pb-0 gap-0">
							<CardHeader className="border-b-1 pb-4 flex gap-2 px-3">
								<span className="size-3 rounded-full bg-red-500" />
								<span className="size-3 rounded-full bg-yellow-500" />
								<span className="size-3 rounded-full bg-green-500" />
							</CardHeader>
							<CardContent className="p-0 m-0">
								{/* <Image
									width={500}
									height={400}
									src="/images/placeholder.svg"
									alt="Illustration IA et cuisine"
									className="rounded-b-lg w-full"
								/> */}
							</CardContent>
						</Card>
					</div>
				</div>
				<div className="w-full">
					<DarkMode className="float-end" />
				</div>
			</section>
		</div>
	);
}
