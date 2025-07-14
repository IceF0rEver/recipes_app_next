import type { UserWithRole } from "better-auth/plugins";
import type { VariantProps } from "class-variance-authority";
import type { ComponentType } from "react";
import type {
	Control,
	FieldPath,
	FieldValues,
	SubmitHandler,
	UseFormReturn,
} from "react-hook-form";
import type { buttonVariants } from "@/components/ui/button";
import type { signIn } from "@/lib/auth/auth-client";

export interface AuthFormProps<T extends FieldValues> {
	children: React.ReactNode;
	form: UseFormReturn<T>;
	onSubmit: SubmitHandler<T>;
	className?: string;
}

export interface AuthFooterProps {
	href: string;
	text?: string;
	label: string;
}

export interface AuthFieldProps<T extends FieldValues> {
	label?: string;
	description?: string;
	placeholder?: string;
	type: string;
	name: FieldPath<T>;
	control: Control<T>;
	fieldType?: "image" | "default";
	className?: string;
}

export interface AuthCardProps {
	title: string;
	description: string;
	children: React.ReactNode;
	footer?: React.ReactNode;
	className?: string;
}

export interface AuthButtonProps {
	type?: React.ButtonHTMLAttributes<HTMLButtonElement>["type"];
	variant?: VariantProps<typeof buttonVariants>["variant"];
	className?: string;
	label: string | React.ReactNode;
	isSocial?: boolean;
	isLoading?: boolean;
	socialProvider?: Parameters<typeof signIn.social>[0]["provider"];
}
export interface TableProps {
	datasTable: Promise<{
		users: UserWithRole[];
		total: number;
		limit?: number;
		offset?: number;
	}>;
	columnsItems: ItemTableProps[];
}

export interface ItemTableProps {
	key: string;
	value: string;
	subItems?: {
		value: string;
		label: string;
		icon?: ComponentType<{ className?: string }>;
	}[];
	enableSorting: boolean;
	enableHiding: boolean;
	initialStateVisibility: boolean;
}

interface subItemsTable {
	key: string;
	label: string;
	icon?: ComponentType<{ className?: string }>;
}

export interface ActionItemTableProps {
	key: string;
	label: string;
	type: "edit" | "delete" | "link" | "select";
	url?: string;
	separator?: boolean;
	icon?: ComponentType<{ className?: string }>;
	subItems?: subItemsTable[];
	onAction?: (value: unknown, selectedKey?: subItemsTable) => void;
}
