import { Icon } from "@/components/ui/icons/Icon";
import { Chip } from "@/components/ui/misc";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { DashboardDetailField } from "../_components/detail/DashboardDetailField";
import { AccountIdentity } from "../_components/entities/account/AccountIdentity";
import { DashboardSection } from "../_components/layout/DashboardSection";

export default function DashboardProfileLoading() {
	return (
		<div aria-busy="true" aria-label="Loading profile" role="status">
			<DashboardSection
				actions={
					<Button.Skeleton size="sm" variant="primary">
						Account settings
					</Button.Skeleton>
				}
				contentClassName="grid gap-5"
				title="Profile"
			>
				<Card>
					<Card.Header className="border-b">
						<Card.Title className="inline-flex items-center gap-2">
							<Icon className="text-muted-foreground" name="user" size="sm" />
							Account identity
						</Card.Title>
						<Card.Description>
							The profile shown across the application.
						</Card.Description>
					</Card.Header>
					<Card.Content className="grid gap-5">
						<AccountIdentity.Skeleton />
						<dl className="grid gap-4 border-t border-border/70 pt-5 sm:grid-cols-2">
							<DashboardDetailField.Skeleton
								copyable
								icon={<Icon name="mail" size="sm" />}
								label="Email"
								value="account@example.com"
							/>
							<DashboardDetailField.Skeleton
								icon={<Icon name="calendar" size="sm" />}
								label="Joined"
								value="20 Jul 2026"
							/>
						</dl>
					</Card.Content>
				</Card>
				<Card>
					<Card.Header className="border-b">
						<Card.Title className="inline-flex items-center gap-2">
							<Icon className="text-muted-foreground" name="shield" size="sm" />
							Organization access
						</Card.Title>
						<Card.Description>
							Access resolved for the active organization.
						</Card.Description>
					</Card.Header>
					<Card.Content>
						<dl className="grid gap-4 sm:grid-cols-2">
							<DashboardDetailField.Skeleton
								icon={<Icon name="building" size="sm" />}
								label="Organization"
								value="Averlo Template"
							/>
							<DashboardDetailField.Skeleton
								icon={<Icon name="shield" size="sm" />}
								label="Organization role"
								truncateValue={false}
							>
								<Chip.Skeleton>Owner</Chip.Skeleton>
							</DashboardDetailField.Skeleton>
							<DashboardDetailField.Skeleton
								className="sm:col-span-2"
								icon={<Icon name="check" size="sm" />}
								label="Permissions"
								truncateValue={false}
							>
								<span className="flex flex-wrap gap-2">
									<Chip.Skeleton>Dashboard</Chip.Skeleton>
									<Chip.Skeleton>Manage organization</Chip.Skeleton>
									<Chip.Skeleton>Manage records</Chip.Skeleton>
								</span>
							</DashboardDetailField.Skeleton>
						</dl>
					</Card.Content>
				</Card>
			</DashboardSection>
		</div>
	);
}
