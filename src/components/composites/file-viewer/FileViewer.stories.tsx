import type { Meta, StoryObj } from "@storybook/nextjs-vite";
import { useEffect, useRef, useState } from "react";
import { expect, fn, userEvent, waitFor, within } from "storybook/test";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { FileInput } from "@/components/ui/input/files/FileInput";
import { Button } from "@/components/ui/primitives/Button";
import { FileViewer } from "./FileViewer";
import { catalogContract, samplePdf } from "./FileViewer.catalog";
import { FileViewerLayout } from "./FileViewerLayout";
import type { FileViewerSource } from "./source";

const meta = {
	id: "composites-file-viewer",
	title: "Composites/Files/FileViewer",
	component: FileViewer,
	tags: ["autodocs"],
	parameters: {
		catalogContract,
		layout: "fullscreen",
		a11y: { test: "error" },
		docs: {
			description: {
				component:
					"FileViewer takes source and onClose. Source contains name, type, and file (File/Blob) or url; optional resolveUrl(signal) refreshes access for every open/retry. Mount FileViewerLayout around the page toolbar and content together. The page input uses the shared 28px xs frame. Overflow uses one trigger and a Dropdown.Menu with compact control rows: compact Page and Zoom groups remain open while adjusting, with 24px controls inside 28px rows and normal Tab navigation. It is not a command menu and contains no interactive controls nested inside menu items. Panel width is direct layout, with no interpolation: the right edge is fixed and the page meets the panel on every resize frame. The viewer toolbar uses the shell surface and its canvas uses the page background; never mount the split below the page toolbar or give the canvas its own card surface. Page entry commits on Enter or blur and Escape cancels editing. FileViewerLayout hosts descendants with optional resetKey; it delegates FileInput previews, reserves 300px of content, and uses ModalShell below 768px of available width. onPreview on FileInput overrides provider delegation. URLs must be HTTP(S), relative, or blob URLs. PDF.js assets are prepared locally by postinstall. Preview limit: 100 MB. Unsupported formats remain downloadable/openable. This is read-only inspection, not document editing.",
			},
		},
	},
	args: { source: samplePdf, onClose: fn() },
	decorators: [
		(Story) => (
			<div className="h-[640px] w-full">
				<Story />
			</div>
		),
	],
} satisfies Meta<typeof FileViewer>;
export default meta;
type Story = StoryObj<typeof meta>;
export const Pdf: Story = {
	play: async ({ canvas, args }) => {
		await expect(
			await canvas.findByRole(
				"img",
				{ name: "Project brief.pdf, page 1 of 2" },
				{ timeout: 20000 },
			),
		).toBeVisible();
		// At story widths the source toolbar may put complete groups in overflow.
		const next = canvas.queryByRole("button", { name: "Next page" });
		if (next) await userEvent.click(next);
		else {
			await userEvent.click(
				canvas.getByRole("button", { name: "More preview controls" }),
			);
			await userEvent.click(
				within(document.body).getByRole("button", { name: "Next page" }),
			);
		}
		await expect(
			await canvas.findByRole("img", {
				name: "Project brief.pdf, page 2 of 2",
			}),
		).toBeVisible();
		const pageField = canvas.queryByRole("spinbutton", { name: "Page" });
		if (pageField) {
			await userEvent.clear(pageField);
			await userEvent.type(pageField, "1");
			await expect(
				canvas.getByRole("img", { name: "Project brief.pdf, page 2 of 2" }),
			).toBeVisible();
			await userEvent.keyboard("{Enter}");
			await expect(
				await canvas.findByRole("img", {
					name: "Project brief.pdf, page 1 of 2",
				}),
			).toBeVisible();
			await userEvent.clear(pageField);
			await userEvent.type(pageField, "999{Enter}");
			await expect(pageField).toHaveValue(2);
		}
		await userEvent.click(
			canvas.getByRole("button", { name: "Close file preview" }),
		);
		await expect(args.onClose).toHaveBeenCalled();
	},
};
export const Image: Story = {
	args: {
		source: {
			name: "Landscape.jpg",
			type: "image/jpeg",
			url: "/test/placeholder-square.jpg",
		},
	},
	play: async ({ canvas }) => {
		await expect(
			await canvas.findByRole("img", { name: "Landscape.jpg" }),
		).toBeVisible();
	},
};
export const Dark: Story = { ...Image, globals: { theme: "dark" } };
export const Unsupported: Story = {
	args: {
		source: {
			name: "Budget.xlsx",
			type: "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet",
			url: "/test/file-viewer.pdf",
		},
	},
	play: async ({ canvas }) => {
		await expect(await canvas.findByRole("alert")).toHaveTextContent(
			"Preview is available for PDFs",
		);
	},
};
export const Corrupt: Story = {
	args: {
		source: {
			name: "Corrupt.pdf",
			file: new Blob(["not a PDF"], { type: "application/pdf" }),
		},
	},
	play: async ({ canvas }) => {
		await expect(
			await canvas.findByRole("alert", {}, { timeout: 20000 }),
		).toHaveTextContent("couldn’t be previewed");
	},
};
export const Loading: Story = {
	args: {
		source: {
			...samplePdf,
			resolveUrl: (signal) =>
				new Promise((_resolve, reject) =>
					signal.addEventListener("abort", () => reject(signal.reason), {
						once: true,
					}),
				),
		},
	},
};
function RetryExample() {
	const [source] = useState<FileViewerSource>(() => {
		let attempts = 0;
		return {
			...samplePdf,
			resolveUrl: async () => {
				if (++attempts === 1) throw new Error("This file is unavailable.");
				return "/test/file-viewer.pdf";
			},
		};
	});
	return <FileViewer source={source} onClose={() => {}} />;
}
export const Retry: Story = {
	render: () => <RetryExample />,
	play: async ({ canvas }) => {
		await canvas.findByRole("alert");
		await userEvent.click(canvas.getByRole("button", { name: "Try again" }));
		await expect(
			await canvas.findByRole(
				"img",
				{ name: "Project brief.pdf, page 1 of 2" },
				{ timeout: 20000 },
			),
		).toBeVisible();
	},
};
function LayoutExample({ narrow = false }: { narrow?: boolean }) {
	return (
		<div style={{ width: narrow ? 600 : 1100, maxWidth: "100%", height: 600 }}>
			<FileViewerLayout>
				<div className="flex h-full flex-col bg-surface">
					<header
						data-testid="page-toolbar"
						className="flex h-12 shrink-0 items-center bg-surface px-5 text-sm"
					>
						Current page
					</header>
					<div
						data-dashboard-workspace
						className="min-h-0 flex-1 rounded-xl bg-background p-5"
					>
						<FileInput
							label="Attachments"
							mode="read"
							items={[{ ...samplePdf, status: "uploaded" }]}
							onItemsChange={() => {}}
						/>
					</div>
				</div>
			</FileViewerLayout>
		</div>
	);
}
export const DashboardPanel: Story = {
	render: () => <LayoutExample />,
	play: async ({ canvas, canvasElement }) => {
		await userEvent.click(
			canvas.getByRole("button", { name: "Open Project brief.pdf" }),
		);
		const separator = await canvas.findByRole("separator", {
			name: "Resize file preview",
		});
		const toolbar = canvasElement.querySelector("[data-file-viewer-toolbar]");
		const pageToolbar = canvas.getByTestId("page-toolbar");
		const content = canvas.getByRole("region", { name: "File content" });
		const pageContent = canvasElement.querySelector(
			"[data-dashboard-workspace]",
		);
		if (!toolbar || !pageContent)
			throw new Error("Missing split layout surfaces");
		await waitFor(() => {
			expect(toolbar.getBoundingClientRect().top).toBe(
				pageToolbar.getBoundingClientRect().top,
			);
			expect(content.getBoundingClientRect().top).toBe(
				pageContent.getBoundingClientRect().top,
			);
			expect(getComputedStyle(content).backgroundColor).toBe(
				getComputedStyle(pageContent).backgroundColor,
			);
			expect(getComputedStyle(toolbar).backgroundColor).toBe(
				getComputedStyle(pageToolbar).backgroundColor,
			);
		});
		const viewer = canvas.getByRole("region", {
			name: "File preview: Project brief.pdf",
		});
		const right = viewer.getBoundingClientRect().right;
		await userEvent.click(separator);
		await userEvent.keyboard("{ArrowLeft}");
		// Check both edges on every frame; a fixed outer edge alone can hide a gap.
		for (let frame = 0; frame < 12; frame++) {
			await new Promise<void>((resolve) =>
				requestAnimationFrame(() => resolve()),
			);
			await expect(
				Math.abs(viewer.getBoundingClientRect().right - right),
			).toBeLessThan(1);
			await expect(
				Math.abs(
					viewer.getBoundingClientRect().left -
						pageContent.getBoundingClientRect().right,
				),
			).toBeLessThan(1);
		}
		// Reverse rapidly as well: there must be no delayed reserved width.
		await userEvent.keyboard("{ArrowRight}{ArrowRight}{ArrowLeft}");
		await expect(
			Math.abs(
				viewer.getBoundingClientRect().left -
					pageContent.getBoundingClientRect().right,
			),
		).toBeLessThan(1);
		await userEvent.keyboard("{ArrowLeft}");

		await expect(separator).toHaveAttribute("aria-valuenow", "464");
		await userEvent.click(
			canvas.getByRole("button", { name: "Close file preview" }),
		);
		await waitFor(() =>
			expect(
				canvas.queryByRole("region", {
					name: "File preview: Project brief.pdf",
				}),
			).not.toBeInTheDocument(),
		);
	},
};
export const Narrow: Story = {
	render: () => <LayoutExample narrow />,
	play: async ({ canvas }) => {
		const trigger = canvas.getByRole("button", {
			name: "Open Project brief.pdf",
		});
		await userEvent.click(trigger);
		const body = within(document.body);
		await waitFor(() => expect(body.getByRole("dialog")).toBeVisible());
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(body.queryByRole("dialog")).not.toBeInTheDocument(),
		);
		await expect(trigger).toHaveFocus();
	},
};

function MotionOffExample() {
	const settings = useSettingsContext();
	const original = useRef(settings?.motionDisabled ?? false);
	useEffect(() => {
		settings?.setMotionDisabled(true);
		return () => settings?.setMotionDisabled(original.current);
	}, [settings?.setMotionDisabled]);
	return <LayoutExample />;
}
export const MotionOff: Story = {
	...DashboardPanel,
	render: () => <MotionOffExample />,
};
export const ReducedMotion: Story = {
	...DashboardPanel,
	beforeEach: () => {
		const native = window.matchMedia;
		window.matchMedia = (query) => {
			const media = native.call(window, query);
			if (query === "(prefers-reduced-motion: reduce)")
				Object.defineProperty(media, "matches", { value: true });
			return media;
		};
		return () => {
			window.matchMedia = native;
		};
	},
};

const cancelledLoad = fn();
function LifecycleExample() {
	const [source, setSource] = useState<FileViewerSource | null>(null);
	const slow = () =>
		setSource({
			...samplePdf,
			resolveUrl: (signal) =>
				new Promise((_resolve, reject) => {
					signal.addEventListener(
						"abort",
						() => {
							cancelledLoad();
							reject(signal.reason);
						},
						{ once: true },
					);
				}),
		});
	return (
		<div className="flex h-full flex-col">
			<div className="flex gap-2 p-2">
				<Button onClick={slow}>Load delayed file</Button>
				<Button onClick={() => setSource(samplePdf)}>Load PDF</Button>
			</div>
			<div className="min-h-0 flex-1">
				{source && (
					<FileViewer source={source} onClose={() => setSource(null)} />
				)}
			</div>
		</div>
	);
}
export const InterruptedLoading: Story = {
	render: () => <LifecycleExample />,
	play: async ({ canvas }) => {
		cancelledLoad.mockClear();
		await userEvent.click(
			canvas.getByRole("button", { name: "Load delayed file" }),
		);
		await expect(await canvas.findByText("Opening preview…")).toBeVisible();
		await userEvent.click(canvas.getByRole("button", { name: "Load PDF" }));
		await waitFor(() => expect(cancelledLoad).toHaveBeenCalledTimes(1));
		await expect(
			await canvas.findByRole(
				"img",
				{ name: "Project brief.pdf, page 1 of 2" },
				{ timeout: 20000 },
			),
		).toBeVisible();
		const zoom = canvas.getByRole("status", { name: "Zoom level" });
		const before = zoom.textContent;
		await userEvent.click(canvas.getByRole("button", { name: "Zoom in" }));
		await waitFor(() => expect(zoom.textContent).not.toBe(before));
		await userEvent.click(
			canvas.getByRole("button", { name: "Load delayed file" }),
		);
		await userEvent.click(
			canvas.getByRole("button", { name: "Close file preview" }),
		);
		await waitFor(() => expect(cancelledLoad).toHaveBeenCalledTimes(2));
		await expect(
			canvas.queryByRole("region", { name: "File content" }),
		).not.toBeInTheDocument();
	},
};

export const ToolbarOverflow: Story = {
	render: (args) => (
		<div className="h-full w-[300px]">
			<FileViewer {...args} />
		</div>
	),
	play: async ({ canvas }) => {
		await canvas.findByRole(
			"img",
			{ name: "Project brief.pdf, page 1 of 2" },
			{ timeout: 20000 },
		);
		const overflow = canvas.getByRole("button", {
			name: "More preview controls",
		});
		await expect(overflow.querySelectorAll("svg")).toHaveLength(1);
		await userEvent.click(overflow);
		const panel = within(
			await within(document.body).findByRole("dialog", {
				name: "More preview controls",
			}),
		);
		await expect(panel.queryByRole("menuitem")).not.toBeInTheDocument();
		for (const group of panel.getAllByRole("group")) {
			await expect(group.getBoundingClientRect().height).toBeCloseTo(28, 2);
		}
		for (const button of panel.getAllByRole("button")) {
			await expect(button.getBoundingClientRect().height).toBeCloseTo(
				button.closest("fieldset") ? 24 : 28,
				2,
			);
		}
		await expect(
			panel
				.getByRole("link", { name: "Open in new tab" })
				.getBoundingClientRect().height,
		).toBeCloseTo(28, 2);
		await userEvent.click(panel.getByRole("button", { name: "Next page" }));
		await expect(
			await canvas.findByRole("img", {
				name: "Project brief.pdf, page 2 of 2",
			}),
		).toBeVisible();
		await expect(panel.getByRole("spinbutton", { name: "Page" })).toHaveValue(
			2,
		);
		const zoom = panel.getByRole("status", { name: "Zoom level" });
		const before = zoom.textContent;
		await userEvent.click(panel.getByRole("button", { name: "Zoom in" }));
		await waitFor(() => expect(zoom.textContent).not.toBe(before));
		await userEvent.click(panel.getByRole("button", { name: "Fit to view" }));
		await expect(panel.getByRole("button", { name: "Zoom out" })).toBeVisible();
		await userEvent.tab();
		await expect(
			panel.getByRole("link", { name: "Open in new tab" }),
		).toHaveFocus();
		await userEvent.keyboard("{Escape}");
		await waitFor(() =>
			expect(
				within(document.body).queryByRole("dialog", {
					name: "More preview controls",
				}),
			).not.toBeInTheDocument(),
		);
		await expect(overflow).toHaveFocus();
	},
};

export const ToolbarOverflowDark: Story = {
	...ToolbarOverflow,
	globals: { theme: "dark" },
};
