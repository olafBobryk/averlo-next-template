"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { Section } from "@/components/layout/primitives/Section";
import { Button } from "@/components/ui/primitives/Button";
import { Heading } from "@/components/ui/primitives/Heading";
import { Text } from "@/components/ui/primitives/Text";

export default function AppError({
	error,
	reset,
}: {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
}) {
	const [showDetails, setShowDetails] = useState(false);

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<main className="min-h-screen flex items-center justify-center px-4 py-12">
			<Section className="h-full" innerClassName="h-full" align={"center"}>
				<Heading as="h1" size="xl">
					Something went wrong
				</Heading>
				<Text variant="muted">
					The page failed to render. You can try again or go back.
				</Text>

				<div className="mt-4 flex flex-wrap items-center justify-center gap-3">
					<Button variant="primary" onClick={() => reset()}>
						Try again
					</Button>
					<Button variant="outline" href="/">
						Go home
					</Button>
					<Button variant="ghost" onClick={() => setShowDetails((v) => !v)}>
						{showDetails ? "Hide details" : "Show details"}
					</Button>
				</div>

				{showDetails && (
					<pre className="mt-4 max-h-48 overflow-auto rounded-lg border border-border/15 bg-surface p-4 text-left text-xs leading-relaxed text-foreground/80">
						{String(error.message || "Unknown error")}
						{error.digest ? `\n\nDigest: ${error.digest}` : ""}
					</pre>
				)}
			</Section>
		</main>
	);
}
