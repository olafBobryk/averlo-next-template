"use client";

import { useEffect, useState } from "react";
import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
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
		<main className="h-screen">
			<Section className="h-full" innerClassName="h-full" align={"center"}>
				<div className="max flex h-full flex-col items-center justify-center gap-2">
					<Logo size="md" />
					<Text as="h1" variant="headingXl">
						Something went wrong
					</Text>
					<Text variant="body" tone="muted">
						The page failed to render. You can try again or go back.
					</Text>

					<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
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
						<pre className="mt-4 max-h-48 w-full max-w-xl overflow-auto rounded-lg border border-border/15 bg-surface p-4 text-left text-xs leading-relaxed text-foreground/80">
							{String(error.message || "Unknown error")}
							{error.digest ? `\n\nDigest: ${error.digest}` : ""}
						</pre>
					)}
				</div>
			</Section>
		</main>
	);
}
