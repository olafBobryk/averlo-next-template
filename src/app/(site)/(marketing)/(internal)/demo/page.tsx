"use client";

import { getVisibleDemoPages } from "@/app/(site)/(marketing)/(internal)/demo/content";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Panel } from "@/components/ui/primitives/Panel";
import { Text } from "@/components/ui/primitives/Text";

function groupPages() {
	const pages = getVisibleDemoPages();
	const sectionOrder: string[] = [];
	const sections = new Map<string, typeof pages>();

	pages.forEach((page) => {
		const root = page.slug[0] ?? "misc";
		if (!sections.has(root)) {
			sections.set(root, []);
			sectionOrder.push(root);
		}
		sections.get(root)?.push(page);
	});

	return sectionOrder.map((key) => ({ key, pages: sections.get(key) ?? [] }));
}

export default function DemoIndexPage() {
	const grouped = groupPages();

	return (
		<div className="w-full space-y-5">
			<header className="flex flex-col gap-2">
				<Text as="h1" variant="headingLg">
					Demo Index
				</Text>
				<Text variant="body" tone="muted">
					Browse the component library demos. All content is driven by
					<code className="ml-1">
						src/app/(site)/(marketing)/(internal)/demo/content.tsx
					</code>
					.
				</Text>
			</header>

			<Panel display="flex" padding="sm" gap="sm" shadow="none">
				<Text variant="body">
					Need to add a demo? Update the content map and it appears everywhere.
				</Text>
				<Button href="/demo/ui/primitives" variant="primary" size="sm">
					Jump to UI Primitives
				</Button>
			</Panel>

			<Divider />

			<div className="grid gap-4">
				{grouped.map((group) => (
					<Panel
						key={group.key}
						display="flex"
						padding="sm"
						gap="sm"
						shadow="none"
					>
						<div className="flex flex-col gap-2">
							<Text as="h2" variant="headingSm">
								{group.key.toUpperCase()}
							</Text>
							<div className="flex flex-wrap gap-2">
								{group.pages.map((page) => (
									<Button
										key={page.id}
										href={`/demo/${page.slug.join("/")}`}
										variant="outline"
										size="sm"
									>
										{page.title}
									</Button>
								))}
							</div>
						</div>
					</Panel>
				))}
			</div>
		</div>
	);
}
