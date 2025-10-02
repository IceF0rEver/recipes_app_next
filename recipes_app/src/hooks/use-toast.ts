"use client";

import { useEffect, useRef } from "react";
import { toast } from "sonner";

interface ToastState {
	success?: boolean;
	message?: string;
}

interface UseToastOptions {
	loadingMessage?: string;
	successMessage: string;
	errorMessage: string;
	onSuccess?: () => void;
	onPending?: () => void;
	onError?: () => void;
}

export function useToast(
	state: ToastState,
	isPending: boolean,
	options: UseToastOptions,
) {
	const toastRef = useRef<string | number | null>(null);

	useEffect(() => {
		if (state.success) {
			if (toastRef.current) {
				toast.dismiss(toastRef.current);
				toastRef.current = null;
			}
			toast.success(options.successMessage);
			options.onSuccess?.();
		} else if (state.message && !state.success) {
			if (toastRef.current) {
				toast.dismiss(toastRef.current);
				toastRef.current = null;
			}
			toast.error(options.errorMessage);
			options.onError?.();
		}
	}, [state, options]);

	useEffect(() => {
		if (isPending && options.loadingMessage !== undefined) {
			toastRef.current = toast.loading(options.loadingMessage);
			options.onPending?.();
		} else if (toastRef.current) {
			toast.dismiss(toastRef.current);
			toastRef.current = null;
		}
	}, [isPending, options]);
}
