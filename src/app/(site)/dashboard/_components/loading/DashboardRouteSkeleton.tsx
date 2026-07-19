import { Skeleton } from "@/components/ui/misc/Skeleton";
import { Card } from "@/components/ui/primitives/Card";

const skeletonRowKeys = [
	"alpha",
	"bravo",
	"charlie",
	"delta",
	"echo",
	"foxtrot",
	"golf",
	"hotel",
] as const;

export function DashboardRouteSkeleton({ rows = 4 }: { rows?: number }) {
	return (
		<div
			aria-busy="true"
			aria-label="Loading dashboard page"
			className="grid gap-5"
			role="status"
		>
			<div className="grid gap-2">
				<Skeleton className="h-8 w-48" />
				<Skeleton className="h-4 w-full max-w-lg" />
			</div>
			<Card padding="md" className="grid gap-4">
				{skeletonRowKeys.slice(0, rows).map((rowKey) => (
					<div className="flex items-center gap-3" key={rowKey}>
						<Skeleton className="size-9 rounded-full" />
						<div className="grid flex-1 gap-2">
							<Skeleton className="h-4 w-1/3" />
							<Skeleton className="h-3 w-2/3" />
						</div>
					</div>
				))}
			</Card>
		</div>
	);
}
