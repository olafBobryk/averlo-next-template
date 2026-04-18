import { StatusContent } from "@/app/(site)/_components/status/StatusContent";
import { Button } from "@/components/ui/primitives/Button";
import { hrefFor } from "@/lib/routes";

export default function DashboardNotFoundPage() {
	return (
		<div className="flex min-h-full flex-1 items-center justify-center py-10">
			<StatusContent
				heading="Dashboard page not found"
				body="This dashboard route doesn’t exist."
				enableRevealMotion={false}
				actions={
					<Button variant="primary" href={hrefFor("dashboard")}>
						Go to dashboard
					</Button>
				}
			/>
		</div>
	);
}
