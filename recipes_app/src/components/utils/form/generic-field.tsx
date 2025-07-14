"use client";

import { format } from "date-fns";
import { enUS, fr } from "date-fns/locale";
import { CalendarIcon } from "lucide-react";
import type { Control, FieldPath, FieldValues } from "react-hook-form";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
	FormControl,
	FormDescription,
	FormField,
	FormItem,
	FormLabel,
	FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
	Popover,
	PopoverContent,
	PopoverTrigger,
} from "@/components/ui/popover";
import { RadioGroup, RadioGroupItem } from "@/components/ui/radio-group";
import {
	Select,
	SelectContent,
	SelectGroup,
	SelectItem,
	SelectTrigger,
	SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useCurrentLocale } from "@/locales/client";

type FieldType = "select" | "radio" | "date" | "default";
interface GenericFieldProps<T extends FieldValues> {
	label?: string;
	description?: string;
	placeholder?: string;
	type?: string;
	name: FieldPath<T>;
	control: Control<T>;
	datas?: { label: string; value: string }[];
	fieldType?: FieldType;
	className?: string;
}
export default function GenericField<T extends FieldValues>({
	label,
	description,
	placeholder,
	type,
	name,
	control,
	datas,
	fieldType = "default",
	className,
}: GenericFieldProps<T>) {
	const locale = useCurrentLocale();
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				if (fieldType === "radio") {
					return (
						<FormItem>
							{label && <FormLabel>{label}</FormLabel>}
							<FormControl>
								<RadioGroup
									onValueChange={field.onChange}
									value={field.value}
									className={cn(className, "")}
								>
									{datas?.map((item: { label: string; value: string }) => (
										<FormItem
											className="flex items-center gap-1"
											key={item.value}
										>
											<FormControl>
												<RadioGroupItem value={item.value} />
											</FormControl>
											<FormLabel>{item.label}</FormLabel>
										</FormItem>
									))}
								</RadioGroup>
							</FormControl>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</FormItem>
					);
				} else if (fieldType === "date") {
					return (
						<FormItem>
							{label && <FormLabel>{label}</FormLabel>}
							<Popover>
								<PopoverTrigger asChild>
									<FormControl>
										<Button
											variant="outline"
											type="button"
											className="w-full text-start font-normal text-muted-foreground"
										>
											<span>
												{field.value ? format(field.value, "yyyy-MM-dd") : ""}
											</span>
											<CalendarIcon className="ms-auto h-4 w-4 opacity-50" />
										</Button>
									</FormControl>
								</PopoverTrigger>
								<PopoverContent className="w-auto p-0">
									<Calendar
										mode="single"
										locale={locale === "fr" ? fr : enUS}
										selected={field.value}
										onSelect={field.onChange}
										className="rounded-md border mx-auto"
										captionLayout="dropdown"
									/>
								</PopoverContent>
							</Popover>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</FormItem>
					);
				} else if (fieldType === "select") {
					return (
						<FormItem>
							{label && <FormLabel>{label}</FormLabel>}
							<FormControl>
								<Select onValueChange={field.onChange} value={field.value}>
									<SelectTrigger className={cn(className, "")}>
										<SelectValue placeholder={placeholder} />
									</SelectTrigger>
									<SelectContent>
										<SelectGroup>
											{datas?.map((item) => (
												<SelectItem key={item.value} value={item.value}>
													{item.label}
												</SelectItem>
											))}
										</SelectGroup>
									</SelectContent>
								</Select>
							</FormControl>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</FormItem>
					);
				} else {
					return (
						<FormItem>
							{label && <FormLabel>{label}</FormLabel>}
							<FormControl>
								<Input
									placeholder={placeholder}
									type={type}
									{...field}
									className={cn(className)}
								/>
							</FormControl>
							{description && <FormDescription>{description}</FormDescription>}
							<FormMessage />
						</FormItem>
					);
				}
			}}
		/>
	);
}
