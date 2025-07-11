import { Separator } from "@/components/ui/separator";

interface LayoutHeaderProps {
	title: string;
	description: string;
}

export default async function LayoutHeader({ title, description }: LayoutHeaderProps) {
	return (
		<header>
			<h1 className="text-3xl font-bold">{title}</h1>
			<p className="py-2">{description}</p>
			<Separator className="my-4" />
		</header>
	);
}
