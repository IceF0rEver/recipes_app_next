"use client";

import { zodResolver } from "@hookform/resolvers/zod";
import type React from "react";
import { useCallback, useEffect, useRef, useState } from "react";
import {
	type DefaultValues,
	type FieldValues,
	type UseFormReturn,
	useForm,
} from "react-hook-form";
import type { z } from "zod";

interface UseGenericFormOptions<T> {
	// biome-ignore lint/suspicious/noExplicitAny: any type
	schema: z.ZodType<T, any, any>;
	defaultValues: DefaultValues<T>;
	onSubmit?: (values: T) => void | Promise<void>;
	resetTrigger?: unknown;
}

interface UseGenericFormReturn<T extends FieldValues> {
	form: UseFormReturn<T>;
	onSubmit: (e?: React.BaseSyntheticEvent) => Promise<void>;
	isPending: boolean;
}

export function useGenericForm<T extends FieldValues>({
	schema,
	defaultValues,
	onSubmit,
	resetTrigger,
}: UseGenericFormOptions<T>): UseGenericFormReturn<T> {
	const form = useForm<T>({
		resolver: zodResolver(schema),
		defaultValues: defaultValues as DefaultValues<T>,
	});

	const [isPending, setIsPending] = useState(false);
	const hasMounted = useRef(false);

	// biome-ignore lint/correctness/useExhaustiveDependencies: form dependencies
	const handleReset = useCallback(() => {
		form.reset(defaultValues);
	}, [defaultValues]);

	useEffect(() => {
		if (hasMounted.current && resetTrigger !== undefined) {
			handleReset();
		}
		hasMounted.current = true;
	}, [resetTrigger, handleReset]);

	const handleSubmit = useCallback(
		async (values: T) => {
			setIsPending(true);
			try {
				await Promise.resolve(onSubmit?.(values));
			} catch (error) {
				console.warn(error);
			} finally {
				setIsPending(false);
			}
		},
		[onSubmit],
	);

	return {
		form,
		onSubmit: form.handleSubmit(handleSubmit),
		isPending,
	};
}
