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
			richColors
			position={position}
			toastOptions={{
				className: "border border-border bg-background text-foreground",
			}}
		/>
	);
}
