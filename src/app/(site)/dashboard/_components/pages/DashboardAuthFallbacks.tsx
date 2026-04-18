import { Button } from "@/components/ui/primitives/Button";
import { StatusContent } from "@/app/(site)/_components/status/StatusContent";
import { hrefFor } from "@/lib/routes";

export function DashboardLoadingFallback() {
	return (
		<StatusContent
			heading="Checking dashboard access"
			body="Please wait while the template validates the current dashboard session."
			enableRevealMotion={false}
		/>
	);
}

export function DashboardBannedFallback() {
	return (
		<StatusContent
			heading="Dashboard access restricted"
			body="This mock account is marked as restricted. Use another session or return to the site shell."
				enableRevealMotion={false}
			actions={
				<>
					<Button variant="primary" href={hrefFor("login")}>
						Go to login
					</Button>
					<Button variant="outline" href={hrefFor("home")}>
						Back to site
					</Button>
				</>
			}
		/>
	);
}

export function DashboardUnauthenticatedFallback() {
	return (
		<StatusContent
			heading="Redirecting to login"
			body="Dashboard routes require an authenticated session, so the template is sending you to the dedicated auth shell."
			enableRevealMotion={false}
			actions={
				<Button variant="primary" href={hrefFor("login")}>
					Go to login
				</Button>
			}
		/>
	);
}
