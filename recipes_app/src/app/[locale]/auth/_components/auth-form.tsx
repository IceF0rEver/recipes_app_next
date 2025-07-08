"use client";

import type { FieldValues } from "react-hook-form";
import { Form } from "@/components/ui/form";
import { cn } from "@/lib/utils";
import type { AuthFormProps } from "@/types/auth-types";

export default function AuthForm<T extends FieldValues>({
	children,
	form,
	onSubmit,
	className,
}: AuthFormProps<T>) {
	return (
		<Form {...form}>
			<form onSubmit={form.handleSubmit(onSubmit)} className={cn(className)}>
				{children}
			</form>
		</Form>
	);
}
