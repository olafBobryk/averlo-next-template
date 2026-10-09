"use client";
// Native specimen adapted from @/components/ui/primitives/Dropdown.catalog.
import { Dropdown } from "@/components/ui/primitives/dropdown";

const removeMemberAccess = () => undefined;
function ContextualDestructiveActionPreview() {
	return (
		<div className="flex max-w-xl items-center justify-between rounded-xl border border-border bg-card p-4">
			<div className="grid gap-0.5">
				<strong>Avery Chen</strong>
				<span className="text-sm text-muted-foreground">
					Admin · Access active
				</span>
			</div>
			<Dropdown.Menu
				ariaLabel="Manage Avery Chen"
				openOnHover={false}
				options={[
					{ id: "view", label: "View member" },
					{
						id: "remove",
						label: "Remove access",
						onSelect: removeMemberAccess,
						tone: "danger",
					},
				]}
			/>
		</div>
	);
}
export default ContextualDestructiveActionPreview;
