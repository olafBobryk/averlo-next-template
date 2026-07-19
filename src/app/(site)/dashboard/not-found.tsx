import { Button } from "@/components/ui/primitives/Button";
import { DashboardStatusFrame } from "./_components/layout/DashboardStatusFrame";

export default function DashboardNotFoundPage() {
	return (
		<DashboardStatusFrame
			action={<Button href="/dashboard">Go to overview</Button>}
			description="This dashboard surface does not exist or is unavailable for the current capability set."
			title="Dashboard page not found"
		/>
	);
}
