import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { expect } from "storybook/test";
import LoadingScreenMount from "./LoadingScreenMount";

const meta = {
	id: "infrastructure-loading-screen",
	title: "Infrastructure/Loading Screen",
	component: LoadingScreenMount,
	parameters: {
		layout: "fullscreen",
	},
} satisfies Meta<typeof LoadingScreenMount>;

export default meta;
type Story = StoryObj<typeof meta>;

export const InitialDocumentHandoff: Story = {
	tags: ["backport-canonical"],
	parameters: {
		backport: {
			schemaVersion: 1,
			target: "averlo-next-template",
			canonicalStoryId:
				"infrastructure-loading-screen--initial-document-handoff",
			strategy: "adapt",
			rationale:
				"Prevent first-paint flashes, avoid same-document intro replays, and distinguish app readiness from full visibility without importing product branding.",
			source: {
				repository: "abudata/pearl-reif",
				storyId: "infrastructure-loading-screen--initial-document-handoff",
				fingerprint:
					"sha256:f47d3cf6f689f4a5d01cd62efd32275ada71b5f96dcf2c4de0753496faa924a0",
			},
		},
	},
	beforeEach: () => {
		document.documentElement.dataset.loadingBootstrap = "true";
		return () => {
			delete document.documentElement.dataset.loadingBootstrap;
		};
	},
	render: () => (
		<main className="flex min-h-screen items-center justify-center bg-background p-8 text-foreground">
			<div className="max-w-lg text-center">
				<h1 className="text-3xl font-semibold">Application content</h1>
				<p className="mt-3 text-muted-foreground">
					The parser cover hands off to the branded loading mount before this
					content becomes visible.
				</p>
			</div>
			<LoadingScreenMount />
		</main>
	),
	play: async ({ canvas }) => {
		await expect(
			canvas.getByRole("heading", { name: "Application content" }),
		).toBeVisible();
	},
};
