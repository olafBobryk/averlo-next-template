"use client";

import { SelectInput, TextAreaInput, TextInput } from "@/components/ui/input";
import { Button } from "@/components/ui/primitives/Button";
import { ContentSection } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { DashboardSection } from "../../_components/layout/DashboardSection";

export function SupportSurfaceSkeletonView() {
	return (
		<div aria-busy="true" aria-label="Loading support" role="status">
			<DashboardSection contentClassName="grid gap-5" title="Support">
				{["Email support", "Contact support"].map((title, index) => (
					<ContentSection key={title}>
						<ContentSection.Heading
							action={
								index === 0 ? (
									<Button.Skeleton size="sm">Open email</Button.Skeleton>
								) : null
							}
							description={
								<Text.Skeleton variant="support">
									Support request description
								</Text.Skeleton>
							}
							title={<Text.Skeleton variant="headingXs">{title}</Text.Skeleton>}
						/>
						<ContentSection.Content className="grid gap-4">
							{index === 0 ? (
								<Text.Skeleton variant="body">
									Email support information
								</Text.Skeleton>
							) : (
								<>
									<div className="grid gap-4 sm:grid-cols-2">
										<TextInput.Skeleton
											description="Authenticated account submitting this request."
											label="Requester"
											value="Template Operator"
										/>
										<SelectInput.Skeleton
											description="Choose the organization context for this request."
											label="Organization"
											value="Demo organization"
										/>
									</div>
									<TextInput.Skeleton
										label="Subject"
										value="How can we help?"
									/>
									<TextAreaInput.Skeleton
										description="Include what you expected, what happened, and the route you were using."
										label="Message"
										value="Describe your question or support request."
									/>
								</>
							)}
						</ContentSection.Content>
					</ContentSection>
				))}
			</DashboardSection>
		</div>
	);
}
