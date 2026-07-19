"use client";

import { toast } from "sonner";

export type ToastType = "success" | "error" | "loading" | "info";

type ToastOptions = {
	durationMs?: number;
	title?: string;
};

type ToastPromiseOptions = {
	durationMs?: number;
	loadingTitle?: string;
	successTitle?: string;
	errorTitle?: string;
};

function messageWithTitle(message: string, title?: string) {
	return title ? `${title}: ${message}` : message;
}

export const showToast = {
	success: (message: string, options?: ToastOptions) =>
		toast.success(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	error: (message: string, options?: ToastOptions) =>
		toast.error(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	info: (message: string, options?: ToastOptions) =>
		toast.info(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	loading: (message: string, options?: ToastOptions) =>
		toast.loading(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	dismiss: (id?: string | number) => toast.dismiss(id),
	promise: async <T>(
		promise: Promise<T>,
		messages: { loading: string; success: string; error: string },
		options?: ToastPromiseOptions,
	) => {
		toast.promise(promise, {
			loading: messageWithTitle(messages.loading, options?.loadingTitle),
			success: messageWithTitle(messages.success, options?.successTitle),
			error: messageWithTitle(messages.error, options?.errorTitle),
			duration: options?.durationMs,
		});
		return promise;
	},
};
