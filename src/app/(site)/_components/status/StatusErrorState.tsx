"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/primitives/Button";
import { StatusContent } from "./StatusContent";

type StatusErrorStateProps = {
	error: globalThis.Error & { digest?: string };
	reset: () => void;
	href: string;
	hrefLabel: string;
	enableRevealMotion?: boolean;
};

export function StatusErrorState({
	error,
	reset,
	href,
	hrefLabel,
	enableRevealMotion = true,
}: StatusErrorStateProps) {
	const [showDetails, setShowDetails] = useState(false);

	useEffect(() => {
		console.error(error);
	}, [error]);

	return (
		<StatusContent
			heading="Something went wrong"
			body="The page failed to render. You can try again or go back."
			enableRevealMotion={enableRevealMotion}
			actions={
				<>
					<Button variant="primary" onClick={() => reset()}>
						Try again
					</Button>
					<Button variant="outline" href={href}>
						{hrefLabel}
					</Button>
					<Button
						variant="ghost"
						onClick={() => setShowDetails((value) => !value)}
					>
						{showDetails ? "Hide details" : "Show details"}
					</Button>
				</>
			}
			details={
				showDetails ? (
					<pre className="mt-4 max-h-48 w-full overflow-auto rounded-lg border border-border/15 bg-surface p-4 text-left text-xs leading-relaxed text-foreground/80">
						{String(error.message || "Unknown error")}
						{error.digest ? `\n\nDigest: ${error.digest}` : ""}
					</pre>
				) : null
			}
		/>
	);
}
