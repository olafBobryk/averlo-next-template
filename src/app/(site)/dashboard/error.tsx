"use client";

import { StatusErrorState } from "@/app/(site)/_components/status/StatusErrorState";
import { hrefFor } from "@/lib/routes";

export default function DashboardErrorPage({
	error,
	reset,
}: {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<div className="flex min-h-full flex-1 items-center justify-center py-10">
			<StatusErrorState
				error={error}
				reset={reset}
				href={hrefFor("dashboard")}
				hrefLabel="Go to dashboard"
				enableRevealMotion={false}
			/>
		</div>
	);
}
