"use client";

import { StatusErrorState } from "@/app/(site)/_components/status/StatusErrorState";
import { Section } from "@/components/ui/primitives/Section";
import { hrefFor } from "@/lib/routes";

export default function MarketingErrorPage({
	error,
	reset,
}: {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
}) {
	return (
		<main className="min-h-[70vh]">
			<Section
				className="h-full"
				innerClassName="h-full"
				align="center"
				justify={"center"}
			>
				<StatusErrorState
					error={error}
					reset={reset}
					href={hrefFor("home")}
					hrefLabel="Go home"
				/>
			</Section>
		</main>
	);
}
