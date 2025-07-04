import "@tanstack/react-table";

declare module "@tanstack/react-table" {
	interface ColumnMeta<_TData, _TValue> {
		label?: string;
		subItems?: { value: string; label: string; icon?: ComponentType<{ className?: string }> }[];
	}
}
