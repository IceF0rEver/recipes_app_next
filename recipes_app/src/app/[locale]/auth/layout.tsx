import DarkMode from "@/components/utils/dark-mode";
import SelectLang from "@/components/utils/select-lang";

export default async function Layout({ children }: { children: React.ReactNode }) {
	return (
		<div>
			<div>{children}</div>
			<div className="absolute bottom-4 right-4 flex items-center gap-2">
				<SelectLang />
				<DarkMode />
			</div>
		</div>
	);
}
