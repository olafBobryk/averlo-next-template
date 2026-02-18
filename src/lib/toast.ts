// lib/toast.ts
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

type ToastEvent =
	| {
			action: "add" | "update";
			id: string;
			message: string;
			type: ToastType;
			title?: string;
			durationMs?: number;
	  }
	| {
			action: "dismiss";
			id?: string;
	  };

const EVENT_NAME = "app-toast";
const DEFAULT_DURATION = 3000;

const createId = () =>
	`${Date.now()}-${Math.random().toString(36).slice(2)}`;

const dispatchToast = (detail: ToastEvent) => {
	if (typeof window === "undefined") return;
	window.dispatchEvent(new CustomEvent(EVENT_NAME, { detail }));
};

export const showToast = {
	success: (message: string, options?: ToastOptions) => {
		const id = createId();
		dispatchToast({
			action: "add",
			id,
			message,
			type: "success",
			title: options?.title,
			durationMs: options?.durationMs,
		});
		return id;
	},
	error: (message: string, options?: ToastOptions) => {
		const id = createId();
		dispatchToast({
			action: "add",
			id,
			message,
			type: "error",
			title: options?.title,
			durationMs: options?.durationMs,
		});
		return id;
	},
	info: (message: string, options?: ToastOptions) => {
		const id = createId();
		dispatchToast({
			action: "add",
			id,
			message,
			type: "info",
			title: options?.title,
			durationMs: options?.durationMs,
		});
		return id;
	},
	loading: (message: string, options?: ToastOptions) => {
		const id = createId();
		dispatchToast({
			action: "add",
			id,
			message,
			type: "loading",
			title: options?.title,
			durationMs: options?.durationMs,
		});
		return id;
	},
	dismiss: (id?: string) => {
		dispatchToast({ action: "dismiss", id });
	},
	promise: async <T,>(
		promise: Promise<T>,
		messages: { loading: string; success: string; error: string },
		options?: ToastPromiseOptions,
	) => {
		const id = showToast.loading(messages.loading, {
			title: options?.loadingTitle,
		});
		try {
			const result = await promise;
			dispatchToast({
				action: "update",
				id,
				message: messages.success,
				type: "success",
				title: options?.successTitle,
				durationMs: options?.durationMs ?? DEFAULT_DURATION,
			});
			return result;
		} catch (error) {
			dispatchToast({
				action: "update",
				id,
				message: messages.error,
				type: "error",
				title: options?.errorTitle,
				durationMs: options?.durationMs ?? DEFAULT_DURATION,
			});
			throw error;
		}
	},
};
