"use client";

import { useRouter } from "next/navigation";
import { useEffect } from "react";
import { DashboardUnauthenticatedFallback } from "./DashboardAuthFallbacks";

export function DashboardUnauthenticatedRedirect({
	destination,
}: {
	destination: string;
}) {
	const router = useRouter();

	useEffect(() => {
		const animationFrame = window.requestAnimationFrame(() => {
			router.replace(destination);
		});

		return () => window.cancelAnimationFrame(animationFrame);
	}, [destination, router]);

	return <DashboardUnauthenticatedFallback loginHref={destination} />;
}
