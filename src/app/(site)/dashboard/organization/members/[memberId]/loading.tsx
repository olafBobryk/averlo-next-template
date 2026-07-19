import { Card } from "@/components/ui/primitives/Card";
import { DashboardDetailField } from "../../../_components/detail/DashboardDetailField";
import { MemberIdentity } from "../../../_components/entities/member/MemberIdentity";
import { DashboardPageHeader } from "../../../_components/layout/DashboardPageHeader";

export default function DashboardMemberDetailLoading() {
	return (
		<div aria-busy="true" className="grid gap-5" role="status">
			<DashboardPageHeader.Skeleton />
			<Card>
				<Card.Header className="border-b">
					<MemberIdentity.Skeleton variant="profile" />
				</Card.Header>
				<Card.Content>
					<dl className="grid gap-5 sm:grid-cols-2">
						<DashboardDetailField.Skeleton
							label="Email"
							value="member@example.com"
						/>
						<DashboardDetailField.Skeleton
							label="Role"
							value="Organization member"
						/>
						<DashboardDetailField.Skeleton label="Joined" value="Jan 1, 2026" />
						<DashboardDetailField.Skeleton
							label="Mention"
							value="@Example member"
						/>
					</dl>
				</Card.Content>
			</Card>
		</div>
	);
}
