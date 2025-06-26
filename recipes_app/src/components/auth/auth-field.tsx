"use client";

import { FormField, FormItem, FormLabel, FormControl, FormDescription, FormMessage } from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import type { FieldValues } from "react-hook-form";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import { X } from "lucide-react";
import { cn } from "@/lib/utils";
import type { AuthFieldProps } from "@/types/auth-types";

async function convertImageToBase64(file: File): Promise<string> {
	return new Promise((resolve, reject) => {
		const reader = new FileReader();
		reader.onloadend = () => resolve(reader.result as string);
		reader.onerror = reject;
		reader.readAsDataURL(file);
	});
}

export default function AuthField<T extends FieldValues>({
	label,
	description,
	placeholder,
	type,
	name,
	control,
	fieldType = "default",
	className,
}: AuthFieldProps<T>) {
	const [imagePreview, setImagePreview] = useState<string | null>(null);
	const fileInputRef = useRef<HTMLInputElement>(null);

	const handleImageChange = async (
		e: React.ChangeEvent<HTMLInputElement>,
		fieldOnChange: (value: string) => void,
	) => {
		const file = e.target.files?.[0];
		if (file) {
			try {
				const base64 = await convertImageToBase64(file);
				setImagePreview(base64);
				fieldOnChange(base64);
			} catch (error) {
				console.error(error);
			}
		}
	};

	const handleRemoveImage = (fieldOnChange: (value: string) => void) => {
		setImagePreview(null);
		fieldOnChange("");
		if (fileInputRef.current) {
			fileInputRef.current.value = "";
		}
	};
	return (
		<FormField
			control={control}
			name={name}
			render={({ field }) => {
				// biome-ignore lint: This hook is being called from a nested function, but all hooks must be called unconditionally from the top-level component.
				useEffect(() => {
					if (fieldType === "image") {
						setImagePreview(field.value);
					}
				}, [field.value]);
				if (fieldType === "image") {
					return (
						<FormItem>
							{label && <FormLabel>{label}</FormLabel>}

							<FormControl>
								<div className={cn("flex items-end gap-2", className)}>
									{fieldType === "image" && imagePreview && (
										<div className="relative w-16 h-16 rounded-sm overflow-hidden">
											<Image
												src={imagePreview}
												alt="Profile preview"
												layout="fill"
												objectFit="cover"
											/>
										</div>
									)}
									<div className="flex gap-2 w-full">
										<Input
											accept="image/*"
											placeholder={placeholder}
											type={type}
											onChange={(e) => handleImageChange(e, field.onChange)}
											ref={fileInputRef}
										/>
										{imagePreview && (
											<X
												className="cursor-pointer my-auto"
												onClick={() => handleRemoveImage(field.onChange)}
											/>
										)}
									</div>
								</div>
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
								<Input placeholder={placeholder} type={type} {...field} className={cn(className)} />
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
