"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Button } from "@/components/ui/primitives/Button";
import { Card } from "@/components/ui/primitives/Card";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { getVisibleDemoPages } from "../content";

const NAV_PADDING_BASE = 12;

function buildPath(slug: string[]) {
	return `/internal/demo/${slug.join("/")}`;
}

export type DemoShellProps = {
	children: React.ReactNode;
};

export function DemoShell({ children }: DemoShellProps) {
	const pathname = usePathname();
	const visiblePages = getVisibleDemoPages();

	return (
		<Section innerClassName="flex flex-row w-full gap-8">
			<aside className="w-64 shrink-0">
				<div className="sticky top-24 flex flex-col gap-4">
					<Card display="flex" padding="sm" gap="sm" shadow="none">
						<div className="flex flex-col gap-2">
							<Text as="h2" variant="headingXs">
								Demo Index
							</Text>
							<Text variant="caption" tone="muted" className="text-xs">
								UI system showcase derived from a single content map.
							</Text>
							<Button href="/internal/demo" size="sm" variant="outline">
								Overview
							</Button>
						</div>
					</Card>
					<Card display="flex" padding="sm" gap="sm" shadow="none">
						<nav className="flex flex-col gap-1">
							{visiblePages.map((page) => {
								const href = buildPath(page.slug);
								const active = pathname === href;
								const paddingLeft = (page.slug.length - 1) * NAV_PADDING_BASE;

								return (
									<Link
										key={page.id}
										href={href}
										className={[
											"rounded-lg px-2 py-1 text-sm transition-colors motion-interactive",
											active
												? "bg-primary/10 text-primary"
												: "text-foreground/80 hover:text-foreground",
										].join(" ")}
										style={{ paddingLeft: 8 + paddingLeft }}
									>
										{page.title}
									</Link>
								);
							})}
						</nav>
					</Card>
				</div>
			</aside>
			<main className="min-w-0 flex-1">{children}</main>
		</Section>
	);
}
