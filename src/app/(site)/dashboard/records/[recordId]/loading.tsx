import { Card } from "@/components/ui/primitives/Card";
import { DashboardDetailField } from "../../_components/detail/DashboardDetailField";
import { DashboardPageHeader } from "../../_components/layout/DashboardPageHeader";

export default function DashboardRecordDetailLoading() {
	return (
		<div aria-busy="true" className="grid gap-5" role="status">
			<DashboardPageHeader.Skeleton />
			<Card>
				<Card.Header className="border-b">
					<Card.Title>Record details</Card.Title>
					<Card.Description>
						Loading presentation-owned fields.
					</Card.Description>
				</Card.Header>
				<Card.Content>
					<dl className="grid gap-5 sm:grid-cols-2 lg:grid-cols-4">
						<DashboardDetailField.Skeleton
							label="Slug"
							value="reference-record"
						/>
						<DashboardDetailField.Skeleton
							label="Status"
							value="Record status"
						/>
						<DashboardDetailField.Skeleton
							label="Owner"
							value="Example member"
						/>
						<DashboardDetailField.Skeleton
							label="Updated"
							value="Jul 20, 2026"
						/>
					</dl>
				</Card.Content>
			</Card>
		</div>
	);
}
