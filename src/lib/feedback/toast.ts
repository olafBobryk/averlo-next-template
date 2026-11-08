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
		messages: {
			loading: string;
			success: string;
			error: string;
			/** Shown (as info) instead of `error` when `options.signal` aborted it. */
			cancelled?: string;
		},
		options?: ToastPromiseOptions & { signal?: AbortSignal },
	) => {
		const signal = options?.signal;
		const cancelled = messages.cancelled;
		if (signal && cancelled) {
			// A cancelled request is not a failure: the loading toast turns into
			// a neutral note instead of the error.
			const id = toast.loading(
				messageWithTitle(messages.loading, options?.loadingTitle),
			);
			promise.then(
				() =>
					toast.success(
						messageWithTitle(messages.success, options?.successTitle),
						{ id, duration: options?.durationMs },
					),
				() =>
					signal.aborted
						? toast.info(cancelled, { id, duration: options?.durationMs })
						: toast.error(
								messageWithTitle(messages.error, options?.errorTitle),
								{ id, duration: options?.durationMs },
							),
			);
			return promise;
		}
		toast.promise(promise, {
			loading: messageWithTitle(messages.loading, options?.loadingTitle),
			success: messageWithTitle(messages.success, options?.successTitle),
			error: messageWithTitle(messages.error, options?.errorTitle),
			duration: options?.durationMs,
		});
		return promise;
	},
};
