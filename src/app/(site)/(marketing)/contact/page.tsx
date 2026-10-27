import type { Metadata } from "next";
import { Section } from "@/components/ui/primitives/Section";
import { Panel } from "@/components/ui/primitives/surfaces";
import { Text } from "@/components/ui/primitives/Text";
import { createStaticMarketingPageMetadata } from "@/lib/metadata";
import { ContactForm } from "./_components/ContactForm";

export const metadata: Metadata =
	createStaticMarketingPageMetadata("marketing.contact");

export default function ContactPage() {
	return (
		<Section className="min-h-[70vh]" padding="default">
			<div className="mx-auto flex w-full max-w-2xl flex-col gap-8">
				<div className="flex flex-col gap-3">
					<Text as="h1" variant="headingXl">
						Contact
					</Text>
					<Text as="p" variant="body" tone="muted">
						Try the template’s contact form with sample details.
					</Text>
				</div>
				<Panel display="flex" gap="sm" padding="md">
					<Text as="h2" variant="headingSm">
						Contact form demo
					</Text>
					<ContactForm />
				</Panel>
			</div>
		</Section>
	);
}
