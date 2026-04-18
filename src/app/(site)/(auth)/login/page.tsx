"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Logo from "@/components/branding/Logo";
import { fetchSession, login } from "@/lib/api/auth";
import { showToast } from "@/lib/feedback";
import { hrefFor } from "@/lib/routes";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";

export default function LoginPage() {
	const router = useRouter();
	const [checkingSession, setCheckingSession] = useState(true);
	const [submitting, setSubmitting] = useState(false);

	useEffect(() => {
		let active = true;

		void fetchSession().then(({ user }) => {
			if (!active) return;
			if (user) {
				router.replace(hrefFor("dashboard"));
				return;
			}
			setCheckingSession(false);
		});

		return () => {
			active = false;
		};
	}, [router]);

	async function handleSubmit(event: React.FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (submitting) return;

		setSubmitting(true);
		try {
			await showToast.promise(login(), {
				loading: "Connecting dashboard session...",
				success: "Dashboard session ready.",
				error: "Unable to initialize the dashboard session.",
			});
			router.replace(hrefFor("dashboard"));
		} finally {
			setSubmitting(false);
		}
	}

	return (
		<Panel
			as="form"
			display="flex"
			padding="lg"
			gap="md"
			onSubmit={handleSubmit}
			className="mx-auto max-w-lg"
		>
			<div className="flex flex-col gap-3">
				<Logo size="md" className="w-fit" />
				<div className="flex flex-col gap-2">
					<Text as="h1" variant="headingLg">
						Connect to the dashboard template
					</Text>
					<Text variant="body" tone="muted">
						This placeholder auth shell keeps dashboard access separate from the
						marketing shell while the real integration is still undefined.
					</Text>
				</div>
			</div>
			<Text variant="caption" tone="muted">
				The current template uses a mock session stored locally in the browser.
			</Text>
			<div className="flex flex-wrap gap-3">
				<Button
					variant="primary"
					type="submit"
					loading={checkingSession || submitting}
				>
					Continue to dashboard
				</Button>
				<Button variant="outline" href={hrefFor("home")}>
					Back to site
				</Button>
			</div>
		</Panel>
	);
}
