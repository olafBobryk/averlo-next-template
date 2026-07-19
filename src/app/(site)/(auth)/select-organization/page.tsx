import { redirect } from "next/navigation";
import { Chip } from "@/components/ui/misc/Chip";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import {
	getSafeContinuationPath,
	withSafeContinuation,
} from "@/lib/auth/continuation";
import { applicationAdapters, resolveCurrentSession } from "@/lib/auth/server";
import { AuthScreen } from "../_components/AuthScreen";
import { selectOrganizationAction } from "../actions";

export default async function SelectOrganizationPage({
	searchParams,
}: {
	searchParams: Promise<{ message?: string; next?: string; switch?: string }>;
}) {
	const query = await searchParams;
	const next = getSafeContinuationPath(query.next);
	const resolution = await resolveCurrentSession();
	if (resolution.status === "anonymous") {
		redirect(withSafeContinuation("/login", next));
	}
	if (resolution.status === "membership-required") {
		redirect(
			`/login?message=membership-required&next=${encodeURIComponent(next)}`,
		);
	}
	if (resolution.status === "resolved" && query.switch !== "1") redirect(next);

	const choices = await Promise.all(
		resolution.memberships.map(async (membership) => ({
			membership,
			organization: await applicationAdapters.organizations.getOrganization(
				membership.organizationId,
			),
		})),
	);

	return (
		<AuthScreen
			description="This account belongs to more than one organization. Choose the context for this session."
			message={query.message}
			title="Choose an organization"
		>
			<div className="grid gap-3">
				{choices.map(({ membership, organization }) => (
					<form action={selectOrganizationAction} key={membership.id}>
						<input name="next" type="hidden" value={next} />
						<input
							name="organizationId"
							type="hidden"
							value={membership.organizationId}
						/>
						<Button
							className="h-auto w-full justify-between px-4 py-3"
							type="submit"
							variant="secondary"
						>
							<span className="grid min-w-0 gap-1 text-left">
								<Text as="span" variant="bodyStrong">
									{organization?.name ?? membership.organizationId}
								</Text>
								<Text as="span" tone="muted" variant="caption">
									{organization?.slug ?? "organization"}
								</Text>
							</span>
							<Chip className="capitalize">{membership.role}</Chip>
						</Button>
					</form>
				))}
			</div>
		</AuthScreen>
	);
}
