import DarkMode from "@/components/utils/dark-mode";
import SelectLang from "@/components/utils/select-lang";

export default async function Layout({
	children,
}: {
	children: React.ReactNode;
}) {
	return (
		<div className="flex flex-col justify-center items-center h-screen">
			<div className="max-w-md space-y-2 px-2 md:px-4">
				<div>{children}</div>
				<div className="flex gap-2 items-center justify-end">
					<SelectLang />
					<DarkMode />
				</div>
			</div>
		</div>
	);
}
