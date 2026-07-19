"use client";

import { Toaster, type ToasterProps } from "sonner";

type ToastHostProps = {
	position?: ToasterProps["position"];
};

export default function ToastHost({
	position = "bottom-right",
}: ToastHostProps) {
	return (
		<Toaster
			closeButton
			position={position}
			toastOptions={{
				className:
					"rounded-xl border border-border bg-surface text-foreground shadow-lg",
			}}
		/>
	);
}
