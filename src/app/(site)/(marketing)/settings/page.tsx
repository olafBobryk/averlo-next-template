"use client";

import * as React from "react";
import Divider from "@/components/ui/primitives/Divider";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { useMarketingSettingsContext } from "../_components/providers/MarketingSettingsProvider";

export default function MarketingSettingsPage() {
	const { sharedSections, marketingSections } = useMarketingSettingsContext();
	const sections = [...sharedSections, ...marketingSections];

	return (
		<Section
			padding="hero"
			height={"hero"}
			maxWidth="narrow"
			innerClassName="flex flex-col gap-6"
		>
			<header className="flex flex-col gap-2">
				<Text as="h1" variant="headingLg">
					Settings
				</Text>
				<Text variant="body" tone="muted">
					Appearance and accessibility preferences are stored locally and
					applied across the application.
				</Text>
			</header>
			<Divider />

			{sections.map((section) => (
				<React.Fragment key={section.id}>{section.content}</React.Fragment>
			))}
		</Section>
	);
}
