"use client";

import Image from "next/image";
import {
	type FormEvent,
	type JSX,
	type ReactNode,
	type Ref,
	useState,
} from "react";
import Logo from "@/components/branding/Logo";
import {
	MarkdownEditor,
	MarkdownRenderer,
} from "@/components/composites/markdown";
import type { AppearancePreference } from "@/components/ui/foundations/appearance";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { useIconRegistry } from "@/components/ui/icons/iconRegistry";
import { ButtonMultiSelectInput } from "@/components/ui/input/ButtonMultiSelectInput";
import { ColorInput } from "@/components/ui/input/ColorInput";
import {
	ColorSwatchInput,
	SEMANTIC_COLOR_SWATCH_PRESETS,
} from "@/components/ui/input/ColorSwatchInput";
import { ComboboxMultiSelectInput } from "@/components/ui/input/ComboboxMultiSelectInput";
import { ComboboxTextInput } from "@/components/ui/input/ComboboxTextInput";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import {
	ChoiceIndicatorMulti,
	ChoiceIndicatorRadio,
	ChoiceIndicatorToggle,
} from "@/components/ui/input/choice/ChoiceIndicators";
import {
	DateInput,
	DateRangeInput,
	type DateRangeValue,
} from "@/components/ui/input/date";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { EditableTextField } from "@/components/ui/input/editable";
import {
	FileInput,
	type FileInputItem,
} from "@/components/ui/input/files/FileInput";
import { MultiselectInput } from "@/components/ui/input/MultiselectInput";
import { NumberInput } from "@/components/ui/input/NumberInput";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { PhoneInput } from "@/components/ui/input/PhoneInput";
import { ProfilePictureInput } from "@/components/ui/input/ProfilePictureInput";
import { RadioInput } from "@/components/ui/input/RadioInput";
import { SelectInput } from "@/components/ui/input/SelectInput";
import { SignatureInput } from "@/components/ui/input/SignatureInput";
import { SliderInput } from "@/components/ui/input/SliderInput";
import { TextAreaInput } from "@/components/ui/input/TextAreaInput";
import { TextInput } from "@/components/ui/input/TextInput";
import { ToggleInput } from "@/components/ui/input/ToggleInput";
import { UnitNumberInput } from "@/components/ui/input/UnitNumberInput";
import { Accordion } from "@/components/ui/misc/Accordion";
import { Chip } from "@/components/ui/misc/Chip";
import { CopyField } from "@/components/ui/misc/CopyField";
import { HealthCheckIndicator } from "@/components/ui/misc/HealthCheckIndicator";
import {
	ImageSwitcher,
	type ImageSwitcherImage,
} from "@/components/ui/misc/ImageSwitcher";
import { InspectableImage } from "@/components/ui/misc/InspectableImage";
import { Loader } from "@/components/ui/misc/Loader";
import { PaginationControls } from "@/components/ui/misc/PaginationControls";
import {
	ProfilePicture,
	ProfilePictureStack,
} from "@/components/ui/misc/ProfilePicture";
import { ScrollBorders } from "@/components/ui/misc/ScrollBorders";
import { SegmentedControl } from "@/components/ui/misc/SegmentedControl";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { SocialLinks } from "@/components/ui/misc/SocialLinks";
import { StepIndicator } from "@/components/ui/misc/StepIndicator";
import { SuspenseBoundary } from "@/components/ui/misc/SuspenseBoundary";
import { ErrorState } from "@/components/ui/misc/state/ErrorState";
import { IdleState } from "@/components/ui/misc/state/IdleState";
import { StateIndicator } from "@/components/ui/misc/state/State";
import { Tooltip } from "@/components/ui/misc/Tooltip";
import { Reveal } from "@/components/ui/motion";
import {
	ActiveStageHost,
	useActiveStage,
} from "@/components/ui/motion/ActiveStageHost";
import { LetterWave } from "@/components/ui/motion/LetterWave";
import { MotionScene } from "@/components/ui/motion/MotionScene";
import { ScrollHighlightText } from "@/components/ui/motion/ScrollHighlightText";
import { ScrollLag } from "@/components/ui/motion/ScrollLag";
import { ScrollParallax } from "@/components/ui/motion/ScrollParallax";
import { ScrollWidth } from "@/components/ui/motion/ScrollWidth";
import { ModalForm } from "@/components/ui/overlays/modal/ModalForm";
import {
	ModalContent,
	ModalDescription,
	ModalFooter,
	ModalHeader,
	ModalTitle,
	useModalSubmission,
} from "@/components/ui/overlays/modal/ModalShell";
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import { useImageInspectModal } from "@/components/ui/overlays/modal/useImageInspectModal";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import Portal from "@/components/ui/overlays/Portal";
import { Button } from "@/components/ui/primitives/Button";
import {
	Card,
	CardContent,
	CardDescription,
	CardHeader,
	CardTitle,
} from "@/components/ui/primitives/Card";
import Divider from "@/components/ui/primitives/Divider";
import { Dropdown } from "@/components/ui/primitives/Dropdown";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";
import { Listbox } from "@/components/ui/primitives/Listbox";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { DateAgo } from "@/components/ui/time/DateAgo";
import { DateIndicator } from "@/components/ui/time/DateIndicator";
import { useTouchScreen } from "@/hooks/useTouchScreen";
import {
	type ApiError,
	checkHealth,
	createApiClient,
	createMockFetch,
} from "@/lib/api";
import { showToast } from "@/lib/feedback";

function AsyncMutationModalDemo({
	onCancel,
	onSaved,
}: {
	onCancel: () => void;
	onSaved: () => void;
}) {
	const { beginSubmission, endSubmission, isSubmitting } = useModalSubmission();

	async function handleSubmit(event: FormEvent<HTMLFormElement>) {
		event.preventDefault();
		if (!beginSubmission()) return;
		let shouldEndSubmission = true;
		try {
			await new Promise((resolve) => window.setTimeout(resolve, 2500));
			shouldEndSubmission = false;
			onSaved();
		} finally {
			if (shouldEndSubmission) endSubmission();
		}
	}

	return (
		<>
			<ModalHeader leadingIcon={<Icon name="pencil" size="sm" />}>
				<ModalTitle>Async mutation</ModalTitle>
				<ModalDescription>
					Submitting locks dismissal and conflicting actions.
				</ModalDescription>
			</ModalHeader>
			<ModalForm
				footer={
					<>
						<Button
							disabled={isSubmitting}
							onClick={onCancel}
							type="button"
							variant="ghost"
						>
							Cancel
						</Button>
						<Button loading={isSubmitting} type="submit">
							Save
						</Button>
					</>
				}
				onSubmit={handleSubmit}
			>
				<TextInput defaultValue="Async mutation" label="Title" name="title" />
			</ModalForm>
		</>
	);
}

export type RelatedInfo = { uses: string[]; usedIn: string[] };

export type DemoItemBase = {
	id: string;
	name: string;
	label: string;
	related?: RelatedInfo;
	className?: string;
};

export type DemoSkeletonItem = {
	name?: string;
	label?: string;
	className?: string;
	related?: RelatedInfo;
	Render: () => JSX.Element;
};

export type DemoComponentItem = DemoItemBase & {
	kind: "component";
	Render: () => JSX.Element;
	skeleton?: DemoSkeletonItem;
};

export type DemoItem = DemoComponentItem;

export type DemoGroup = {
	id: string;
	title: string;
	description?: string;
	columns?: string;
	items: DemoItem[];
};

export type DemoPage = {
	id: string;
	slug: string[];
	title: string;
	description?: string;
	visibility?: "public" | "dev-only";
	groups: DemoGroup[];
};

const LISTBOX_OPTIONS = [
	{ value: "alpha", content: "Alpha" },
	{ value: "beta", content: "Beta" },
	{ value: "gamma", content: "Gamma" },
	{ value: "delta", content: "Delta" },
];

function AppearanceSettingsDemo() {
	const settings = useSettingsContext();
	if (!settings)
		return <Text tone="muted">Settings provider unavailable.</Text>;
	return (
		<div className="grid gap-3">
			<SegmentedControl<AppearancePreference>
				ariaLabel="Demo application appearance"
				columns={3}
				layout="columns"
				onChange={settings.setAppearance}
				options={[
					{ label: "System", value: "system" },
					{ label: "Light", value: "light" },
					{ label: "Dark", value: "dark" },
				]}
				value={settings.appearance}
			/>
			<Text tone="muted" variant="caption">
				Resolved appearance: {settings.resolvedAppearance}
			</Text>
		</div>
	);
}

const mockHealthSuccessClient = createApiClient({
	baseUrl: "https://demo.api.local",
	fetcher: createMockFetch([
		{
			matcher: "/",
			method: "GET",
			response: {
				delayMs: 600,
				body: { message: "Service is healthy." },
			},
		},
	]),
});

const mockHealthErrorClient = createApiClient({
	baseUrl: "https://demo.api.local",
	fetcher: createMockFetch([
		{
			matcher: "/",
			method: "GET",
			response: {
				delayMs: 600,
				status: 503,
				body: {
					message: "Service is unavailable.",
					retryAfterSeconds: 30,
				},
			},
		},
	]),
});

const imageSwitcherDemoImages = [
	{
		src: "/test/mercury.png",
		alt: "Mercury-like abstract surface",
		blurDataURL:
			"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyMCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIGZpbGw9IiNkOGQ4ZDAiLz48Y2lyY2xlIGN4PSIxNCIgY3k9IjYiIHI9IjUiIGZpbGw9IiNhZWE4OTgiLz48L3N2Zz4=",
	},
	{
		src: "/test/blob.png",
		alt: "Soft abstract blob",
		blurDataURL:
			"data:image/svg+xml;base64,PHN2ZyB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIHZpZXdCb3g9IjAgMCAyMCAxMiIgeG1sbnM9Imh0dHA6Ly93d3cudzMub3JnLzIwMDAvc3ZnIj48cmVjdCB3aWR0aD0iMjAiIGhlaWdodD0iMTIiIGZpbGw9IiNmMWY1ZjkiLz48Y2lyY2xlIGN4PSI4IiBjeT0iNiIgcj0iNSIgZmlsbD0iIzk0YTNmNyIvPjwvc3ZnPg==",
	},
] satisfies ImageSwitcherImage[];

const MARKDOWN_RENDERER_DEMO_MARKDOWN = [
	"# Markdown Renderer",
	"",
	"This renderer maps plain markdown onto the template design system and supports [internal links](/internal/demo), [external links](https://example.com), **strong copy**, _emphasis_, ~~deleted text~~, <u>underlined text</u>, and `inlineCode`.",
	"",
	"::button[Open Reference]{href=/internal/reference variant=primary size=md}",
	"",
	"::button[Small Ghost Action]{href=/internal/demo variant=ghost size=sm}",
	"",
	"## Lists",
	"",
	"- Unordered item",
	"- Another item with **bold copy**",
	"- [x] Completed task",
	"- [ ] Incomplete task",
	"",
	"1. Ordered item",
	"2. Another ordered item",
	"",
	"## Quote",
	"",
	"> Markdown should stay compact while still rendering through the design system.",
	"",
	"## Code",
	"",
	"```tsx",
	"type MarkdownButton = {",
	"  label: string;",
	"  href: string;",
	'  variant?: "primary" | "secondary" | "ghost" | "inverse";',
	'  tone?: "default" | "danger";',
	'  size?: "sm" | "md" | "lg" | "xl";',
	"};",
	"```",
	"",
	"## Image",
	"",
	"![Soft abstract blob](/test/blob.png)",
	"",
	"## Table",
	"",
	"| Element | Covered |",
	"| --- | ---: |",
	"| Headings | yes |",
	"| Tables | yes |",
	"| Button directive | yes |",
	"",
	"Raw HTML remains escaped text: &lt;unsafe-component&gt;blocked&lt;/unsafe-component&gt;",
].join("\n");

const MARKDOWN_EDITOR_DEMO_MARKDOWN = [
	"## Project note",
	"",
	"Draft **rich content**, _emphasis_, ~~revisions~~, and `inline code` through the application toolbar.",
	"",
	"> The rich canvas and rendered output share the same stored Markdown string.",
	"",
	"- Ordinary bullet",
	"- Another ordinary bullet",
	"",
	"Checklist:",
	"",
	"- [x] Confirm the source-owned toolbar",
	"- [ ] Review the current-system adaptations",
	"",
	"```ts",
	"const density = 'shared';",
	"```",
	"",
	"| Surface | State |",
	"| --- | --- |",
	"| Editor | Populated |",
	"| Renderer | Synchronized |",
	"",
	"::button[Open Reference]{href=/internal/reference variant=primary tone=default size=md}",
].join("\n");

const MARKDOWN_EDITOR_INVALID_MARKDOWN = [
	"## Source fallback",
	"",
	"<unclosed-component",
].join("\n");

const activeStageDemoItems = [
	{
		title: "Brief",
		description: "Gather the highest-risk user need before motion begins.",
	},
	{
		title: "Sequence",
		description: "Cycle through stages after app readiness or a scene gate.",
	},
	{
		title: "Refine",
		description: "Pause on hover or focus so users can inspect one state.",
	},
];

const revealNumericStartStage = "demo-stats-numeric-start";
const scrollHighlightBaseColor = "rgb(var(--color-foreground-rgb) / 0.45)";
const scrollHighlightTargetColor = "rgb(var(--color-primary-rgb) / 1)";

const revealNumericStats = [
	{
		value: "128+",
		label: "Signals grouped",
	},
	{
		value: "5x",
		label: "Iteration speed",
	},
	{
		value: "300%",
		label: "Coverage range",
	},
	{
		value: "24/7",
		label: "Review window",
	},
];

function ActiveStageHostDemo() {
	return (
		<ActiveStageHost
			count={activeStageDemoItems.length}
			intervalMs={1800}
			className="grid gap-3"
		>
			<ActiveStageHostDemoContent />
		</ActiveStageHost>
	);
}

function RevealNumericStatsDemo() {
	return (
		<Reveal.Root>
			<Reveal.Scene>
				<Reveal.List
					className="grid gap-3 sm:grid-cols-2"
					stagger={0.12}
					unlockOnStartStage={revealNumericStartStage}
					viewportAmount={0.08}
				>
					{revealNumericStats.map((stat) => (
						<Reveal.Item key={stat.label}>
							<Panel
								background="surface"
								border="subtle"
								padding="sm"
								radius="sm"
								shadow="none"
								className="flex min-h-32 flex-col justify-between"
							>
								<Reveal.Numeric
									animation="countUp"
									as="p"
									className="m-0 text-4xl font-semibold leading-none tracking-normal tabular-nums text-foreground sm:text-5xl"
									data-demo-numeric-value={stat.value}
									text={stat.value}
									useViewport={false}
									waitFor={revealNumericStartStage}
								/>
								<Text variant="caption" tone="muted" className="mt-3 block">
									{stat.label}
								</Text>
							</Panel>
						</Reveal.Item>
					))}
				</Reveal.List>
			</Reveal.Scene>
		</Reveal.Root>
	);
}

function TouchScreenStatusDemo() {
	const isTouchScreen = useTouchScreen();

	return (
		<Panel
			background="surface"
			border="subtle"
			padding="sm"
			radius="sm"
			shadow="none"
		>
			<Text variant="bodyStrong">
				{isTouchScreen ? "Touch / coarse pointer" : "Hover / fine pointer"}
			</Text>
			<Text variant="caption" tone="muted" className="mt-2 block">
				{isTouchScreen
					? "Use this branch for touch-safe controls and hover fallbacks."
					: "Use this branch for hover previews and pointer-rich controls."}
			</Text>
		</Panel>
	);
}

function ShareReportDemo({ skeleton = false }: { skeleton?: boolean }) {
	return (
		<Card size="sm">
			<Card.Header className="border-b">
				{skeleton ? (
					<>
						<Text.Skeleton as="h3" variant="headingSm">
							Share report
						</Text.Skeleton>
						<Text.Skeleton variant="body">
							Copy this link and send it to your team.
						</Text.Skeleton>
					</>
				) : (
					<>
						<Card.Title as="h3">Share report</Card.Title>
						<Card.Description>
							Copy this link and send it to your team.
						</Card.Description>
					</>
				)}
			</Card.Header>
			<Card.Content>
				{skeleton ? (
					<CopyField.Skeleton placeholder="https://example.com/reports/q1-summary" />
				) : (
					<CopyField value="https://example.com/reports/q1-summary" />
				)}
			</Card.Content>
			<Card.Footer className="justify-end">
				{skeleton ? (
					<Button.Skeleton variant="primary">Continue</Button.Skeleton>
				) : (
					<Button variant="primary">Continue</Button>
				)}
			</Card.Footer>
		</Card>
	);
}

function DemoMediaFrame({ children }: { children: ReactNode }) {
	return (
		<Panel
			background="surface"
			border="subtle"
			overflow="hidden"
			padding="none"
			radius="lg"
			shadow="none"
		>
			{children}
		</Panel>
	);
}

function ActiveStageHostDemoContent() {
	const { activeIndex, getItemProps, stageProgress } = useActiveStage();

	return (
		<div className="grid gap-3">
			<div className="h-1 overflow-hidden rounded-full bg-foreground/10">
				<div
					className="h-full rounded-full bg-primary"
					style={{ width: `${Math.round(stageProgress * 100)}%` }}
				/>
			</div>
			<div className="grid gap-2 sm:grid-cols-3">
				{activeStageDemoItems.map((item, index) => (
					<Button
						key={item.title}
						type="button"
						size="none"
						variant="secondary"
						align="left"
						className="w-full rounded-lg p-3 data-[active=true]:bg-primary/10 data-[active=true]:text-primary"
						contentClassName="flex-col items-start gap-1"
						{...getItemProps(index)}
					>
						<Text variant="bodyStrong">{item.title}</Text>
						<Text variant="caption" tone="muted">
							{item.description}
						</Text>
					</Button>
				))}
			</div>
			<Text variant="caption" tone="muted">
				Active index: {activeIndex + 1} / {activeStageDemoItems.length}
			</Text>
		</div>
	);
}

const relatedMap: Record<string, RelatedInfo> = {
	Logo: { uses: [], usedIn: ["Footer", "HeaderCompact", "HeaderFull"] },
	Header: { uses: ["HeaderCompact", "HeaderFull"], usedIn: [] },
	HeaderFull: {
		uses: ["Button", "HeaderMenuContent", "IconSwap", "Logo"],
		usedIn: ["Header"],
	},
	HeaderCompact: {
		uses: ["Button", "HeaderMenuContent", "Logo", "ScrollBorders"],
		usedIn: ["Header"],
	},
	HeaderMenuContent: {
		uses: ["Button", "Icon", "InputFrame", "Text"],
		usedIn: ["HeaderCompact", "HeaderFull"],
	},
	MarketingContentSearch: {
		uses: ["ContentSearch"],
		usedIn: [],
	},
	ContentSearch: {
		uses: ["ComboboxTextInput"],
		usedIn: ["MarketingContentSearch"],
	},
	MarkdownRenderer: {
		uses: ["Button", "ChoiceIndicatorMulti", "Text", "focus"],
		usedIn: [],
	},
	Footer: { uses: ["Button", "Logo", "Text"], usedIn: [] },
	FormValidationClientMount: { uses: [], usedIn: [] },
	ModalClientMount: { uses: ["ModalHost"], usedIn: [] },
	ToastClientMount: { uses: ["ToastHost"], usedIn: [] },
	IconSwap: {
		uses: [],
		usedIn: [
			"Accordion",
			"CopyField",
			"CopyStatusIcon",
			"PasswordInput",
			"PhoneInput",
			"ToastHost",
		],
	},
	Icon: {
		uses: ["customRegistry", "iconRegistry"],
		usedIn: [
			"Accordion",
			"Button",
			"ChoiceIndicatorMulti",
			"ChoiceIndicatorRadio",
			"ChoiceIndicatorToggle",
			"ComboboxMultiSelectInput",
			"CopyStatusIcon",
			"CopyField",
			"DateRangeInput",
			"Dropdown",
			"ErrorState",
			"HeaderCompact",
			"Loader",
			"PasswordInput",
			"PhoneInput",
			"ProfilePictureInput",
			"SegmentedControl",
			"SelectInput",
			"SocialLinks",
			"StateIndicator",
			"ToastHost",
		],
	},
	customRegistry: { uses: [], usedIn: ["Button", "Icon", "iconRegistry"] },
	iconRegistry: {
		uses: ["customRegistry"],
		usedIn: ["Icon", "phosphorRegistry"],
	},
	phosphorRegistry: { uses: ["iconRegistry"], usedIn: [] },
	Text: {
		uses: ["Skeleton"],
		usedIn: [
			"Accordion",
			"Button",
			"ChoiceField",
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"ConfirmationModal",
			"CopyField",
			"DateAgo",
			"DateIndicator",
			"DateRangeInput",
			"EditableTextField",
			"Field",
			"Footer",
			"Listbox",
			"MarkdownRenderer",
			"PhoneInput",
			"ProfilePicture",
			"SegmentedControl",
			"SelectInput",
			"StateIndicator",
			"ToastHost",
			"FileInput",
		],
	},
	Button: {
		uses: ["Icon", "Loader", "Skeleton", "Text", "focus", "customRegistry"],
		usedIn: [
			"Accordion",
			"ButtonMultiSelectInput",
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"ConfirmationModal",
			"CopyField",
			"EditableTextField",
			"FileInput",
			"Footer",
			"HeaderCompact",
			"HeaderFull",
			"ImageInspectModal",
			"InspectableImage",
			"Listbox",
			"MarkdownRenderer",
			"PasswordInput",
			"PhoneInput",
			"ProfilePictureInput",
			"SegmentedControl",
			"SelectInput",
			"SocialLinks",
			"StateIndicator",
			"ToastHost",
			"FileInput",
		],
	},
	Chip: {
		uses: ["Icon", "Skeleton", "focus"],
		usedIn: ["FilePreview", "HealthCheckIndicator", "ProfilePicture"],
	},
	InputFrame: {
		uses: ["focus"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"DateRangeInput",
			"EditableTextField",
			"EmailInput",
			"NumberInput",
			"PasswordInput",
			"PhoneInput",
			"SelectInput",
			"SliderInput",
			"TextAreaInput",
			"TextInput",
		],
	},
	Dropdown: {
		uses: ["Button", "Icon", "Listbox", "Portal"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"DateRangeInput",
			"PhoneInput",
			"SelectInput",
		],
	},
	Card: { uses: ["Panel"], usedIn: [] },
	Panel: { uses: [], usedIn: ["Card", "ModalShell", "ToastHost"] },
	Divider: { uses: [], usedIn: [] },
	Section: { uses: [], usedIn: [] },
	Field: {
		uses: ["Text"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"EditableTextField",
			"EmailInput",
			"ButtonMultiSelectInput",
			"MultiselectInput",
			"NumberInput",
			"PasswordInput",
			"PhoneInput",
			"ProfilePictureInput",
			"RadioInput",
			"SelectInput",
			"SliderInput",
			"TextAreaInput",
			"TextInput",
			"ToggleInput",
		],
	},
	Listbox: {
		uses: ["Button", "Text", "dropdownStyles"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"DateRangeInput",
			"PhoneInput",
			"SelectInput",
		],
	},
	dropdownStyles: {
		uses: [],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"Listbox",
			"PhoneInput",
			"SelectInput",
		],
	},
	DateAgo: { uses: ["Text"], usedIn: [] },
	DateIndicator: { uses: ["Text"], usedIn: [] },
	SettingsProvider: { uses: [], usedIn: [] },
	useSettingsContext: { uses: [], usedIn: [] },
	focus: {
		uses: [],
		usedIn: [
			"Button",
			"ChoiceIndicatorMulti",
			"ChoiceIndicatorRadio",
			"ChoiceIndicatorToggle",
			"DateRangeInput",
			"InputFrame",
			"MarkdownRenderer",
		],
	},
	spring: { uses: [], usedIn: ["Accordion", "SegmentedControl", "ToastHost"] },
	motionTiming: { uses: [], usedIn: ["SuspenseBoundary", "Reveal.Scramble"] },
	createApiClient: { uses: [], usedIn: ["checkHealth"] },
	createMockFetch: { uses: [], usedIn: [] },
	checkHealth: { uses: ["createApiClient"], usedIn: [] },
	MotionScene: {
		uses: ["Reveal.Root", "Reveal.List", "Reveal.Image", "Reveal.Scramble"],
		usedIn: [],
	},
	ActiveStageHost: { uses: ["MotionScene"], usedIn: [] },
	"Reveal.Root": { uses: [], usedIn: [] },
	"Reveal.List": { uses: ["Reveal.Item"], usedIn: [] },
	"Reveal.Item": { uses: [], usedIn: ["Reveal.List"] },
	"Reveal.Image": {
		uses: ["Reveal.Item", "Skeleton", "motionTiming"],
		usedIn: ["ImageInspectModal"],
	},
	"Reveal.Text": { uses: ["Reveal.Item"], usedIn: [] },
	"Reveal.HighlightText": { uses: ["Reveal.Item", "motionTiming"], usedIn: [] },
	"Reveal.Numeric": { uses: ["MotionScene", "spring"], usedIn: [] },
	LetterWave: { uses: ["Text"], usedIn: [] },
	"Reveal.Scramble": { uses: ["motionTiming"], usedIn: [] },
	ScrollHighlightText: { uses: ["spring"], usedIn: [] },
	ScrollLag: { uses: [], usedIn: [] },
	ScrollParallax: { uses: [], usedIn: [] },
	ScrollWidth: { uses: ["spring"], usedIn: [] },
	useTouchScreen: { uses: [], usedIn: [] },
	MultiselectInput: {
		uses: [
			"ChoiceField",
			"ChoiceIndicatorMulti",
			"ChoiceIndicatorRadio",
			"ChoiceIndicatorToggle",
			"Field",
		],
		usedIn: [],
	},
	ButtonMultiSelectInput: {
		uses: ["Button", "ChoiceIndicatorMulti", "Field"],
		usedIn: [],
	},
	ToggleInput: {
		uses: [
			"ChoiceField",
			"ChoiceIndicatorMulti",
			"ChoiceIndicatorRadio",
			"ChoiceIndicatorToggle",
			"Field",
		],
		usedIn: [],
	},
	NumberInput: { uses: ["Field", "InputFrame"], usedIn: ["UnitNumberInput"] },
	SliderInput: { uses: ["Field", "InputFrame"], usedIn: [] },
	UnitNumberInput: { uses: ["NumberInput"], usedIn: [] },
	PasswordInput: {
		uses: ["Button", "Field", "Icon", "IconSwap", "InputFrame"],
		usedIn: [],
	},
	ComboboxTextInput: {
		uses: [
			"Button",
			"Dropdown",
			"Field",
			"InputFrame",
			"Listbox",
			"Text",
			"dropdownStyles",
		],
		usedIn: [],
	},
	TextAreaInput: { uses: ["Field", "InputFrame"], usedIn: [] },
	TextInput: { uses: ["Field", "InputFrame"], usedIn: [] },
	EditableTextField: {
		uses: ["Button", "Field", "InputFrame", "Text"],
		usedIn: [],
	},
	EmailInput: { uses: ["Field", "InputFrame"], usedIn: [] },
	RadioInput: {
		uses: [
			"ChoiceField",
			"ChoiceIndicatorMulti",
			"ChoiceIndicatorRadio",
			"ChoiceIndicatorToggle",
			"Field",
		],
		usedIn: [],
	},
	DateRangeInput: {
		uses: [
			"Button",
			"CalendarPopover",
			"Dropdown.Panel",
			"Field",
			"InputFrame",
		],
		usedIn: [],
	},
	DateInput: {
		uses: ["CalendarPopover", "Dropdown.Panel", "Field", "InputFrame"],
		usedIn: [],
	},
	SignatureInput: {
		uses: ["Button", "Field", "InputFrame"],
		usedIn: [],
	},
	PhoneInput: {
		uses: [
			"Button",
			"Dropdown",
			"Field",
			"Icon",
			"IconSwap",
			"InputFrame",
			"Listbox",
			"Text",
			"dropdownStyles",
		],
		usedIn: [],
	},
	ProfilePictureInput: {
		uses: ["Button", "Field", "Icon", "ProfilePicture"],
		usedIn: [],
	},
	SelectInput: {
		uses: [
			"Button",
			"Dropdown",
			"Field",
			"Icon",
			"InputFrame",
			"Listbox",
			"Text",
			"dropdownStyles",
		],
		usedIn: [],
	},
	ComboboxMultiSelectInput: {
		uses: [
			"Button",
			"ChoiceIndicatorMulti",
			"ChoiceIndicatorRadio",
			"ChoiceIndicatorToggle",
			"Dropdown",
			"Field",
			"Icon",
			"InputFrame",
			"Listbox",
			"Text",
			"dropdownStyles",
		],
		usedIn: [],
	},
	ChoiceIndicatorRadio: {
		uses: ["Icon", "focus"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"MultiselectInput",
			"RadioInput",
			"ToggleInput",
		],
	},
	ChoiceIndicatorMulti: {
		uses: ["Icon", "focus"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"MultiselectInput",
			"RadioInput",
			"ToggleInput",
		],
	},
	ChoiceIndicatorToggle: {
		uses: ["Icon", "focus"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"MultiselectInput",
			"RadioInput",
			"ToggleInput",
		],
	},
	ChoiceField: {
		uses: ["Text"],
		usedIn: ["MultiselectInput", "RadioInput", "ToggleInput"],
	},
	FileInput: {
		uses: ["Button", "Field", "FilePreview", "IdleState"],
		usedIn: [],
	},
	Skeleton: { uses: [], usedIn: ["Button", "ProfilePicture", "Text"] },
	SegmentedControl: {
		uses: ["Button", "Icon", "Text", "spring"],
		usedIn: [],
	},
	SocialLinks: {
		uses: ["Button", "Icon", "iconRegistry"],
		usedIn: ["Footer"],
	},
	CopyStatusIcon: {
		uses: ["Icon", "IconSwap"],
		usedIn: [
			"CopyField",
			"EmailInput",
			"PasswordInput",
			"TextInput",
			"useCopyAction",
		],
	},
	useCopyAction: {
		uses: ["CopyStatusIcon", "showToast"],
		usedIn: ["CopyField", "EmailInput", "PasswordInput", "TextInput"],
	},
	CopyField: {
		uses: ["Button", "CopyStatusIcon", "Text", "useCopyAction"],
		usedIn: [],
	},
	IdleState: { uses: ["StateIndicator"], usedIn: [] },
	StateIndicator: {
		uses: ["Button", "Icon", "Text"],
		usedIn: ["ErrorState", "IdleState"],
	},
	ErrorState: {
		uses: ["Icon", "StateIndicator"],
		usedIn: ["SuspenseBoundary"],
	},
	Accordion: {
		uses: ["Button", "Card", "Icon", "Text", "spring"],
		usedIn: [],
	},
	SuspenseBoundary: {
		uses: ["ErrorState", "Loader", "motionTiming"],
		usedIn: [],
	},
	ImageSwitcher: {
		uses: ["Image", "PaginationControls", "motionTiming"],
		usedIn: [],
	},
	PaginationControls: {
		uses: ["Button", "Icon", "Text"],
		usedIn: ["ImageSwitcher"],
	},
	ScrollBorders: {
		uses: ["Button", "focus", "motionTiming"],
		usedIn: [],
	},
	Tooltip: {
		uses: ["Dropdown", "Text"],
		usedIn: [],
	},
	Loader: {
		uses: ["Icon"],
		usedIn: [
			"Button",
			"HealthCheckIndicator",
			"ImageInspectModal",
			"SuspenseBoundary",
		],
	},
	HealthCheckIndicator: {
		uses: ["Button", "Chip", "Loader", "Text"],
		usedIn: [],
	},
	ProfilePicture: {
		uses: ["Chip", "Skeleton", "Text"],
		usedIn: ["ProfilePictureInput"],
	},
	FilePreview: {
		uses: [
			"Button",
			"FileInspectModal",
			"InspectableImage",
			"Chip",
			"Text",
			"useConfirmationModal",
			"useModal",
		],
		usedIn: ["FileInput"],
	},
	FileInspectModal: {
		uses: ["Button", "Text"],
		usedIn: ["FilePreview"],
	},
	InspectableImage: {
		uses: ["Button", "useImageInspectModal"],
		usedIn: ["FilePreview"],
	},
	Portal: { uses: [], usedIn: ["Dropdown", "ModalShell", "ToastHost"] },
	ConfirmationModal: {
		uses: ["Button", "Text"],
		usedIn: ["useConfirmationModal"],
	},
	useConfirmationModal: {
		uses: ["ConfirmationModal", "useModal"],
		usedIn: ["FilePreview"],
	},
	ModalShell: {
		uses: ["Portal"],
		usedIn: ["ModalHost"],
	},
	ModalCard: {
		uses: ["Card"],
		usedIn: ["ModalHost", "DashboardCommandProvider"],
	},
	useImageInspectModal: {
		uses: ["ImageInspectModal", "useModal"],
		usedIn: ["InspectableImage"],
	},
	ModalHost: {
		uses: ["ModalCard", "ModalShell"],
		usedIn: ["ModalClientMount"],
	},
	useModal: {
		uses: [],
		usedIn: ["useConfirmationModal", "useImageInspectModal"],
	},
	ImageInspectModal: {
		uses: ["Button", "Loader", "Reveal.Image"],
		usedIn: ["useImageInspectModal"],
	},
	ToastHost: {
		uses: ["Button", "Icon", "IconSwap", "Card", "Portal", "Text", "spring"],
		usedIn: ["ToastClientMount"],
	},
	showToast: {
		uses: [],
		usedIn: ["CopyField", "ImageInspectModal", "ToastHost"],
	},
};

type OverviewLink = {
	href: string;
	label: string;
};

function OverviewLinks({ links }: { links: OverviewLink[] }) {
	return (
		<div className="flex flex-wrap gap-2">
			{links.map((link) => (
				<Button key={link.href} href={link.href} size="sm" variant="secondary">
					{link.label}
				</Button>
			))}
		</div>
	);
}

function updateChoiceIndicatorLabValues(
	current: string[],
	value: string,
	checked: boolean,
) {
	return checked
		? Array.from(new Set([...current, value]))
		: current.filter((item) => item !== value);
}
function LockedChoiceIndicatorLab() {
	const [radio, setRadio] = useState("team");
	const [multi, setMulti] = useState(["mentions"]);
	const [toggles, setToggles] = useState(["motion"]);

	return (
		<div className="grid gap-5">
			<Text tone="muted" variant="caption">
				The production indicators: solid radio and checkbox, plus the muted
				contrast toggle. All rows remain standard ChoiceField instances.
			</Text>

			<div className="grid gap-3">
				<Text variant="bodyStrong">Radio</Text>
				{[
					["team", "Team workspace"],
					["private", "Private drafts"],
				].map(([value, label]) => (
					<ChoiceField
						checked={radio === value}
						description={
							value === "team"
								? "Shared with your team."
								: "Visible only to you."
						}
						id={`indicator-lab-solid-radio-${value}`}
						indicator={<ChoiceIndicatorRadio checked={radio === value} />}
						key={value}
						label={label}
						name="indicator-lab-solid-radio"
						onChange={setRadio}
						value={value}
					/>
				))}
			</div>

			<Divider />

			<div className="grid gap-3">
				<Text variant="bodyStrong">Checkbox</Text>
				{[
					["mentions", "Mentions", false],
					["digest", "Weekly digest", false],
					["sms", "SMS alerts", true],
				].map(([value, label, disabled]) => {
					const checked = multi.includes(String(value));
					return (
						<ChoiceField
							checked={checked}
							disabled={Boolean(disabled)}
							id={`indicator-lab-solid-multi-${value}`}
							indicator={
								<ChoiceIndicatorMulti
									checked={checked}
									disabled={Boolean(disabled)}
								/>
							}
							inputType="checkbox"
							key={String(value)}
							label={String(label)}
							name="indicator-lab-solid-multi"
							onChange={(next, nextChecked) =>
								setMulti((current) =>
									updateChoiceIndicatorLabValues(current, next, nextChecked),
								)
							}
							value={String(value)}
						/>
					);
				})}
			</div>

			<Divider />

			<div className="grid gap-3">
				<Text variant="bodyStrong">Toggle</Text>
				{[
					["motion", "Reduced motion"],
					["scroll", "Smooth scrolling"],
				].map(([value, label]) => {
					const checked = toggles.includes(value);
					return (
						<ChoiceField
							checked={checked}
							id={`indicator-lab-toggle-muted-${value}`}
							indicator={<ChoiceIndicatorToggle checked={checked} />}
							inputType="checkbox"
							key={value}
							label={label}
							name="indicator-lab-toggle-muted"
							onChange={(next, nextChecked) =>
								setToggles((current) =>
									updateChoiceIndicatorLabValues(current, next, nextChecked),
								)
							}
							value={value}
						/>
					);
				})}
			</div>
		</div>
	);
}

export const demoPages: DemoPage[] = [
	{
		id: "branding",
		slug: ["branding"],
		title: "Branding",
		description: "Identity atoms",
		groups: [
			{
				id: "branding-core",
				title: "Branding",
				description: "Identity atoms",
				items: [
					{
						id: "async-mutation-modal",
						kind: "component",
						name: "useModalSubmission",
						label: "Async mutation modal",
						Render() {
							const { openModal } = useModal();

							return (
								<div className="grid gap-3">
									<Button
										size="sm"
										variant="secondary"
										onClick={() =>
											openModal(
												({ close }) => (
													<AsyncMutationModalDemo
														onCancel={close}
														onSaved={() => {
															showToast.success("Saved demo mutation.");
															close();
														}}
													/>
												),
												{
													ariaLabel: "Async mutation",
													id: "async-mutation-demo",
												},
											)
										}
									>
										Open async mutation modal
									</Button>
									<pre className="overflow-x-auto rounded-md border border-border/70 bg-muted/40 p-3 text-xs text-muted-foreground">
										<code>{`const { beginSubmission, endSubmission, isSubmitting } =
  useModalSubmission();

if (!beginSubmission()) return;
let shouldEndSubmission = true;
try {
  await saveAction(formData);
  shouldEndSubmission = false;
  close();
} finally {
  if (shouldEndSubmission) endSubmission();
}`}</code>
									</pre>
								</div>
							);
						},
					},
					{
						id: "logo",
						kind: "component",
						name: "Logo",
						label: "Wordmark + mark",
						related: relatedMap.Logo,
						Render() {
							return (
								<div className="flex flex-col gap-3">
									<div className="flex items-center gap-3">
										<Logo size="sm" />
										<Logo size="md" />
										<Logo size="lg" />
									</div>
									<div className="flex items-center gap-3">
										<Logo size="sm" variant="mark" />
										<Logo size="md" variant="mark" />
										<Logo size="lg" variant="mark" />
									</div>
									<div className="flex items-center gap-3 rounded-lg bg-foreground px-3 py-2">
										<Logo size="sm" tone="light" />
										<Logo size="sm" variant="mark" tone="light" />
									</div>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "composites",
		slug: ["composites"],
		title: "Composites",
		description: "Reusable components composed from design-system primitives",
		groups: [
			{
				id: "composite-links",
				title: "Composite Components",
				description: "Shared above-primitive components below route shells",
				items: [
					{
						id: "composite-links-card",
						kind: "component",
						name: "Composite Links",
						label: "Jump to component",
						Render() {
							return (
								<OverviewLinks
									links={[
										{
											href: "/internal/demo/composites/markdown",
											label: "Markdown",
										},
									]}
								/>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "composites-markdown",
		slug: ["composites", "markdown"],
		title: "Composites: Markdown",
		description: "Design-system markdown rendering with a button directive",
		groups: [
			{
				id: "markdown-renderer",
				title: "Markdown Renderer",
				description:
					"Default document and compact dashboard densities share the same authored-content contract in rendered and editable modes.",
				columns: "grid-cols-1",
				items: [
					{
						id: "markdown-renderer-live",
						kind: "component",
						name: "MarkdownRenderer",
						label: "Broad markdown coverage",
						related: relatedMap.MarkdownRenderer,
						Render() {
							return (
								<div className="max-w-3xl">
									<MarkdownRenderer
										markdown={MARKDOWN_RENDERER_DEMO_MARKDOWN}
									/>
								</div>
							);
						},
					},
					{
						id: "markdown-editor-live",
						kind: "component",
						name: "MarkdownEditor",
						label: "Full authoring and synchronized output",
						Render() {
							const [markdown, setMarkdown] = useState(
								MARKDOWN_EDITOR_DEMO_MARKDOWN,
							);
							return (
								<div className="grid max-w-3xl gap-4">
									<MarkdownEditor
										ariaLabel="Project note"
										defaultMarkdown={markdown}
										density="default"
										mentions={[
											{
												id: "4b533f14-6dd0-4dbf-9f73-212be08f5211",
												label: "Ada Lovelace",
											},
										]}
										onChange={setMarkdown}
									/>
									<div className="grid gap-2">
										<Text as="h4" tone="muted" variant="caption">
											Rendered output
										</Text>
										<MarkdownRenderer
											density="default"
											markdown={markdown}
											resolveUserMention={() => (
												<Chip color="info">@Ada Lovelace</Chip>
											)}
											variant="result"
										/>
									</div>
								</div>
							);
						},
					},
					{
						id: "markdown-editor-responsive",
						kind: "component",
						name: "MarkdownEditor",
						label: "Compact dashboard authoring and synchronized output",
						Render() {
							const [markdown, setMarkdown] = useState(
								MARKDOWN_EDITOR_DEMO_MARKDOWN,
							);
							return (
								<div className="grid max-w-3xl gap-4">
									<MarkdownEditor
										ariaLabel="Compact project note"
										defaultMarkdown={markdown}
										density="compact"
										mentions={[
											{
												id: "4b533f14-6dd0-4dbf-9f73-212be08f5211",
												label: "Ada Lovelace",
											},
										]}
										onChange={setMarkdown}
									/>
									<div className="grid gap-2">
										<Text as="h4" tone="muted" variant="caption">
											Rendered output
										</Text>
										<MarkdownRenderer
											density="compact"
											markdown={markdown}
											variant="result"
										/>
									</div>
								</div>
							);
						},
					},
					{
						id: "markdown-editor-invalid-source",
						kind: "component",
						name: "MarkdownEditor",
						label: "Invalid Markdown source mode",
						Render() {
							return (
								<div className="max-w-3xl">
									<MarkdownEditor
										ariaLabel="Invalid Markdown source mode"
										defaultMarkdown={MARKDOWN_EDITOR_INVALID_MARKDOWN}
									/>
								</div>
							);
						},
					},
					{
						id: "markdown-editor-disabled",
						kind: "component",
						name: "MarkdownEditor",
						label: "Disabled state",
						Render() {
							return (
								<div className="max-w-3xl">
									<MarkdownEditor
										ariaLabel="Disabled Markdown editor"
										defaultMarkdown={
											"## Read only\n\nDisabled editors retain their document geometry.\n\n- [x] Completed read-only task"
										}
										density="compact"
										disabled
									/>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui",
		slug: ["ui"],
		title: "UI Overview",
		description: "Core UI system areas",
		groups: [
			{
				id: "ui-links",
				title: "UI Sections",
				description: "Jump to a UI category",
				items: [
					{
						id: "ui-links-card",
						kind: "component",
						name: "UI Links",
						label: "Quick navigation",
						Render() {
							return (
								<OverviewLinks
									links={[
										{
											href: "/internal/demo/ui/primitives",
											label: "Primitives",
										},
										{ href: "/internal/demo/ui/helpers", label: "Helpers" },
										{ href: "/internal/demo/ui/icons", label: "Icons" },
										{ href: "/internal/demo/ui/input", label: "Input" },
										{ href: "/internal/demo/ui/misc", label: "Misc" },
										{ href: "/internal/demo/ui/motion", label: "Motion" },
										{ href: "/internal/demo/ui/overlays", label: "Overlays" },
										{ href: "/internal/demo/ui/time", label: "Time" },
										{
											href: "/internal/demo/ui/foundations",
											label: "Foundations",
										},
									]}
								/>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-primitives",
		slug: ["ui", "primitives"],
		title: "UI Primitives",
		description: "Typography, buttons, layout",
		groups: [
			{
				id: "ui-primitives-core",
				title: "UI Primitives",
				description: "Typography, buttons, layout",
				items: [
					{
						id: "text",
						kind: "component",
						name: "Text",
						label: "Typography variants",
						related: relatedMap.Text,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Text as="h3" variant="headingLg">
										Heading LG
									</Text>
									<Text as="h4" variant="headingMd">
										Heading MD
									</Text>
									<Text as="h5" variant="headingSm">
										Heading SM
									</Text>
									<Text as="h6" variant="headingXs">
										Heading XS
									</Text>
									<Text variant="bodyStrong">Body strong</Text>
									<Text variant="body">Body text</Text>
									<Text variant="body" tone="muted">
										Muted text
									</Text>
									<Text variant="caption" tone="muted">
										Caption muted
									</Text>
									<div className="rounded-lg bg-foreground px-4 py-3">
										<Text
											variant="body"
											theme="light"
											tone="muted"
											interactive={false}
										>
											Muted light text
										</Text>
									</div>
								</div>
							);
						},
						skeleton: {
							name: "Text.Skeleton",
							Render() {
								return (
									<div className="flex flex-col gap-2">
										<Text.Skeleton as="h3" variant="headingLg">
											Heading LG
										</Text.Skeleton>
										<Text.Skeleton as="h4" variant="headingMd">
											Heading MD
										</Text.Skeleton>
										<Text.Skeleton as="h5" variant="headingSm">
											Heading SM
										</Text.Skeleton>
										<Text.Skeleton as="h6" variant="headingXs">
											Heading XS
										</Text.Skeleton>
										<Text.Skeleton variant="bodyStrong">
											Body strong
										</Text.Skeleton>
										<Text.Skeleton variant="body">Body text</Text.Skeleton>
										<Text.Skeleton variant="body" tone="muted">
											Muted text
										</Text.Skeleton>
										<Text.Skeleton variant="caption" tone="muted">
											Caption muted
										</Text.Skeleton>
									</div>
								);
							},
						},
					},
					{
						id: "chip",
						kind: "component",
						name: "Chip",
						label: "Borderless compact metadata label",
						related: relatedMap.Chip,
						Render() {
							return (
								<div className="flex flex-wrap gap-2">
									<Chip leadingIcon="home" tone="helper" helperIndex={5}>
										Individual
									</Chip>
									<Chip leadingIcon="gear" tone="helper" helperIndex={2}>
										Company
									</Chip>
									<Chip href="/internal/demo" trailingIcon="arrow-right">
										Linked chip
									</Chip>
									<Chip color="success">Ready</Chip>
									<Chip color="warning">Needs review</Chip>
									<Chip color="#9C46BF">Custom</Chip>
								</div>
							);
						},
						skeleton: {
							name: "Chip.Skeleton",
							Render() {
								return (
									<div className="flex flex-wrap gap-2">
										<Chip.Skeleton leadingIcon>Individual</Chip.Skeleton>
										<Chip.Skeleton>Linked chip</Chip.Skeleton>
									</div>
								);
							},
						},
					},
					{
						id: "button",
						kind: "component",
						name: "Button",
						label: "Variants + loading",
						related: relatedMap.Button,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<div className="flex flex-wrap gap-2">
										<Button variant="primary">Primary</Button>
										<Button>Secondary default</Button>
										<Button variant="ghost">Ghost</Button>
										<Button variant="inverse">Inverse</Button>
										<Button tone="danger">Danger</Button>
										<Button variant="primary" tone="danger">
											Danger primary
										</Button>
										<Button variant="ghost" tone="danger">
											Danger ghost
										</Button>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<Button size="sm">Small</Button>
										<Button size="md">Medium</Button>
										<Button size="lg">Large</Button>
										<Button size="xl">Extra large</Button>
										<Button
											variant="ghost"
											size="none"
											className="text-sm font-medium"
										>
											Ghost none
										</Button>
										<Button size="icon" leadingIcon="plus" aria-label="Add" />
										<Button
											dir="rtl"
											variant="secondary"
											trailingIcon={{
												name: "arrow-right",
												mirrorInRtl: true,
											}}
										>
											RTL action
										</Button>
										<Button variant="secondary" loading>
											Loading
										</Button>
										<Button variant="secondary" disabled>
											Disabled
										</Button>
									</div>
								</div>
							);
						},
						skeleton: {
							name: "Button.Skeleton",
							Render() {
								return (
									<div className="flex flex-col gap-2">
										<div className="flex flex-wrap items-center gap-2">
											<Button.Skeleton size="md" variant="primary">
												Primary
											</Button.Skeleton>
											<Button.Skeleton size="md">Secondary</Button.Skeleton>
											<Button.Skeleton size="md" variant="inverse">
												Inverse
											</Button.Skeleton>
											<Button.Skeleton size="md" tone="danger">
												Danger
											</Button.Skeleton>
											<Button.Skeleton size="md" variant="ghost">
												Ghost
											</Button.Skeleton>
										</div>
										<div className="flex flex-wrap items-center gap-2">
											<Button.Skeleton size="sm">Small</Button.Skeleton>
											<Button.Skeleton size="md">Medium</Button.Skeleton>
											<Button.Skeleton size="lg">Large</Button.Skeleton>
											<Button.Skeleton size="icon" leadingIcon />
											<Button.Skeleton size="md">Loading</Button.Skeleton>
											<Button.Skeleton size="md">Disabled</Button.Skeleton>
										</div>
									</div>
								);
							},
						},
					},
					{
						id: "card",
						kind: "component",
						name: "Card",
						label: "Slot container",
						related: relatedMap.Card,
						Render() {
							return (
								<Card>
									<CardHeader className="border-b">
										<div className="flex items-center gap-2">
											<Icon
												name="cards"
												size="sm"
												className="text-muted-foreground"
											/>
											<CardTitle as="h4">Project</CardTitle>
										</div>
										<CardDescription>
											Structured card with an informative header.
										</CardDescription>
									</CardHeader>
									<CardContent>
										<Button size="sm" variant="secondary">
											Open details
										</Button>
									</CardContent>
								</Card>
							);
						},
					},
					{
						id: "divider",
						kind: "component",
						name: "Divider",
						label: "Content separator",
						related: relatedMap.Divider,
						Render() {
							return (
								<div className="grid gap-4">
									<Divider />
									<Panel background="surface" padding="sm" radius="xs">
										<Divider>Surface-neutral label</Divider>
									</Panel>
								</div>
							);
						},
					},
					{
						id: "field",
						kind: "component",
						name: "Field",
						label: "Label + message",
						related: relatedMap.Field,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Field
										label="Label"
										description="Helper text"
										message="Error message"
										tone="error"
										required
									>
										<InputFrame fullWidth>
											<input
												className={inputVariants({
													size: "md",
												})}
												placeholder="Error state"
											/>
										</InputFrame>
									</Field>
									<Field
										label="Success label"
										description="Helper text"
										message="Looks good"
										tone="success"
									>
										<InputFrame fullWidth>
											<input
												className={inputVariants({ size: "md" })}
												placeholder="Success state"
											/>
										</InputFrame>
									</Field>
								</div>
							);
						},
					},
					{
						id: "input-frame",
						kind: "component",
						name: "InputFrame",
						label: "Input shell",
						related: relatedMap.InputFrame,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<InputFrame
										start={<Icon name="search" size="sm" />}
										end={
											<Text variant="caption" tone="muted">
												Cmd+K
											</Text>
										}
										fullWidth
									>
										<input
											className={inputVariants({
												size: "md",
												hasStart: true,
												hasEnd: true,
											})}
											placeholder="Search"
										/>
									</InputFrame>
									<InputFrame
										start={<Icon name="search" size="sm" />}
										fullWidth
										disabled
										size="sm"
									>
										<input
											className={inputVariants({
												size: "sm",
												disabled: true,
												hasStart: true,
											})}
											placeholder="Disabled"
											disabled
										/>
									</InputFrame>
								</div>
							);
						},
					},
					{
						id: "listbox",
						kind: "component",
						name: "Listbox",
						label: "List selection",
						related: relatedMap.Listbox,
						Render() {
							const [listboxActive, setListboxActive] = useState(0);
							const [listboxSelected, setListboxSelected] = useState("alpha");

							return (
								<Listbox
									options={LISTBOX_OPTIONS.map((opt) => ({
										value: opt.value,
										content: opt.content,
										selected: listboxSelected === opt.value,
									}))}
									activeIndex={listboxActive}
									onActiveIndexChange={setListboxActive}
									onSelect={(option) =>
										setListboxSelected(String(option.value))
									}
									className="!border-border/10"
								/>
							);
						},
					},
					{
						id: "dropdown",
						kind: "component",
						name: "Dropdown",
						label: "Fixed + absolute positioning",
						related: relatedMap.Dropdown,
						Render() {
							return (
								<div className="grid gap-3 pb-44 md:grid-cols-2">
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Fixed follow
										</Text>
										<Dropdown
											positionStrategy="fixed"
											renderTrigger={({ ref, onRightClick, chevronIcon }) => (
												<Button
													ref={ref as Ref<HTMLElement>}
													variant="secondary"
													className="w-full"
													onClick={onRightClick}
												>
													<span className="flex w-full items-center justify-between gap-2">
														<span>Fixed menu</span>
														{chevronIcon}
													</span>
												</Button>
											)}
											renderMenu={({ close }) => (
												<Listbox
													options={LISTBOX_OPTIONS.map((opt) => ({
														value: opt.value,
														content: opt.content,
													}))}
													onSelect={() => close()}
												/>
											)}
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Absolute static
										</Text>
										<Dropdown
											positionStrategy="absolute"
											renderTrigger={({ ref, onRightClick, chevronIcon }) => (
												<Button
													ref={ref as Ref<HTMLElement>}
													variant="secondary"
													className="w-full"
													onClick={onRightClick}
												>
													<span className="flex w-full items-center justify-between gap-2">
														<span>Absolute menu</span>
														{chevronIcon}
													</span>
												</Button>
											)}
											renderMenu={({ close }) => (
												<Listbox
													options={LISTBOX_OPTIONS.map((opt) => ({
														value: opt.value,
														content: opt.content,
													}))}
													onSelect={() => close()}
												/>
											)}
										/>
									</div>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-helpers",
		slug: ["ui", "helpers"],
		title: "UI Helpers",
		description: "Utilities and helpers",
		groups: [
			{
				id: "ui-helpers-core",
				title: "Helpers",
				description: "Composable helpers",
				items: [
					{
						id: "icon-swap",
						kind: "component",
						name: "IconSwap",
						label: "Animated icon swap",
						related: relatedMap.IconSwap,
						Render() {
							const [iconSwapIndex, setIconSwapIndex] = useState(0);

							return (
								<div className="flex flex-col gap-2">
									<div className="flex items-center gap-3">
										<IconSwap
											size="sm"
											items={[
												{ icon: <Icon name="eye" /> },
												{ icon: <Icon name="eye-closed" /> },
											]}
											activeIndex={iconSwapIndex}
										/>
										<IconSwap
											size="md"
											items={[
												{ icon: <Icon name="eye" /> },
												{ icon: <Icon name="eye-closed" /> },
											]}
											activeIndex={iconSwapIndex}
										/>
										<IconSwap
											size="lg"
											items={[
												{ icon: <Icon name="eye" /> },
												{ icon: <Icon name="eye-closed" /> },
											]}
											activeIndex={iconSwapIndex}
										/>
									</div>
									<Button
										size="sm"
										variant="secondary"
										onClick={() => setIconSwapIndex((i) => (i === 0 ? 1 : 0))}
									>
										Toggle
									</Button>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-icons",
		slug: ["ui", "icons"],
		title: "UI Icons",
		description: "Glyphs + registry",
		groups: [
			{
				id: "ui-icons-core",
				title: "Icons",
				description: "Glyphs + icon utilities",
				items: [
					{
						id: "icon",
						kind: "component",
						name: "Icon",
						label: "Named icon glyph",
						related: relatedMap.Icon,
						Render() {
							const registry = useIconRegistry();
							const iconNames = Object.keys(registry).sort();

							return (
								<div className="flex flex-col gap-4">
									<div className="grid gap-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4">
										{iconNames.map((name) => (
											<Panel
												key={name}
												background="background"
												border="subtle"
												display="block"
												padding="xs"
												radius="sm"
												shadow="none"
											>
												<div className="flex items-center gap-3">
													<Icon name={name as IconName} size="md" />
													<span className="text-2xs font-medium text-foreground/70">
														{name}
													</span>
												</div>
											</Panel>
										))}
									</div>
									<div className="flex flex-wrap gap-2">
										<Panel
											background="background"
											border="subtle"
											display="block"
											padding="xs"
											radius="sm"
											shadow="none"
										>
											<div className="flex items-center gap-3">
												<Icon name="arrow-right" size="md" mirrorInRtl />
												<span className="text-2xs font-medium text-foreground/70">
													LTR mirrored icon
												</span>
											</div>
										</Panel>
										<Panel
											dir="rtl"
											background="background"
											border="subtle"
											display="block"
											padding="xs"
											radius="sm"
											shadow="none"
										>
											<div className="flex items-center gap-3">
												<Icon name="arrow-right" size="md" mirrorInRtl />
												<span className="text-2xs font-medium text-foreground/70">
													RTL mirrored icon
												</span>
											</div>
										</Panel>
									</div>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-input",
		slug: ["ui", "input"],
		title: "UI Input",
		description: "Text + composite inputs",
		groups: [
			{
				id: "ui-input-core",
				title: "Inputs",
				description: "Text + composite inputs",
				items: [
					{
						id: "text-input",
						kind: "component",
						name: "TextInput",
						label: "Text input",
						related: relatedMap.TextInput,
						Render() {
							const [name, setName] = useState("");
							const [shortName, setShortName] = useState("Ada");

							return (
								<div className="flex flex-col gap-2">
									<TextInput
										label="Name"
										description="Required field"
										required
										placeholder="Jane Doe"
										value={name}
										onChange={setName}
									/>
									<TextInput
										label="Compact"
										size="sm"
										value={shortName}
										onChange={setShortName}
									/>
									<TextInput
										label="Disabled"
										defaultValue="Read only"
										disabled
									/>
								</div>
							);
						},
					},
					{
						id: "editable-text-field",
						kind: "component",
						name: "EditableTextField",
						label: "Display-to-edit field",
						related: relatedMap.EditableTextField,
						Render() {
							const [fieldTitle, setFieldTitle] =
								useState("Template dashboard");
							const [inlineTitle, setInlineTitle] = useState("Rename inline");

							return (
								<div className="grid w-full max-w-sm gap-4">
									<EditableTextField
										description="Uses one stable field shell while viewing and editing."
										label="Dashboard title"
										onSave={async (nextTitle) => setFieldTitle(nextTitle)}
										validate={(nextTitle) =>
											nextTitle ? null : "Enter a title."
										}
										value={fieldTitle}
									/>
									<EditableTextField
										ariaLabel={`Rename ${inlineTitle}`}
										onSave={async (nextTitle) => setInlineTitle(nextTitle)}
										presentation="inline"
										value={inlineTitle}
									/>
									<EditableTextField.Skeleton
										description="Uses one stable field shell while viewing and editing."
										label="Loading title"
										value="Template dashboard"
									/>
								</div>
							);
						},
					},
					{
						id: "profile-picture-input",
						kind: "component",
						name: "ProfilePictureInput",
						label: "Profile image picker",
						related: relatedMap.ProfilePictureInput,
						Render() {
							const [selectedFileName, setSelectedFileName] = useState<
								string | null
							>(null);

							return (
								<div className="flex max-w-md flex-col gap-5">
									<ProfilePictureInput
										label="Profile picture"
										description="JPG, PNG, or WebP up to 25 MB."
										name="Ada Lovelace"
										onChange={(file) => setSelectedFileName(file?.name ?? null)}
									/>
									<ProfilePictureInput
										description="Source-style modal row."
										label="Profile picture · file row"
										layout="file-row"
										name="Ada Lovelace"
										onChange={(file) => setSelectedFileName(file?.name ?? null)}
									/>
									<ProfilePictureInput
										description="Keeps a domain-owned fallback and color seed."
										label="Profile picture · presentation preview"
										layout="file-row"
										name="Ada Lovelace"
										onChange={(file) => setSelectedFileName(file?.name ?? null)}
										renderPreview={({ className, name, size, src }) => (
											<ProfilePicture
												alt="Ada Lovelace presentation"
												className={className}
												fallback="AL"
												helperIndex={4}
												name={name}
												size={size}
												src={src}
											/>
										)}
									/>
									<Text as="p" variant="caption" tone="muted">
										{selectedFileName
											? `Selected: ${selectedFileName}`
											: "No file selected"}
									</Text>
								</div>
							);
						},
					},
					{
						id: "date-input",
						kind: "component",
						name: "DateInput",
						label: "Calendar date input",
						Render() {
							const [date, setDate] = useState<string | null>("2026-07-19");
							return (
								<div className="grid gap-4">
									<DateInput
										label="Review date"
										value={date}
										onChange={setDate}
									/>
									<DateInput label="Empty date" />
									<DateInput
										dropdownPositionStrategy="fixed"
										label="Constrained date"
										max="2026-07-28"
										min="2026-07-10"
										value="2026-07-22"
									/>
									<DateInput
										disabled
										label="Disabled date"
										value="2026-07-19"
									/>
									<DateInput
										error="Choose a valid date."
										label="Invalid date"
									/>
									<DateInput.Skeleton
										label="Loading date"
										value="Jul 19, 2026"
									/>
								</div>
							);
						},
					},
					{
						id: "color-inputs",
						kind: "component",
						name: "ColorInput",
						label: "Color and semantic swatches",
						Render() {
							const [color, setColor] = useState("#3567EA");
							const [tone, setTone] = useState<
								"neutral" | "info" | "success" | "warning" | "danger"
							>("info");
							return (
								<div className="grid gap-4">
									<ColorInput
										label="Brand color"
										value={color}
										onChange={setColor}
									/>
									<ColorSwatchInput
										label="Status color"
										presets={SEMANTIC_COLOR_SWATCH_PRESETS}
										value={tone}
										onChange={(selection) => setTone(selection.value)}
									/>
								</div>
							);
						},
					},
					{
						id: "email-input",
						kind: "component",
						name: "EmailInput",
						label: "Email validation",
						related: relatedMap.EmailInput,
						Render() {
							const [email, setEmail] = useState("");

							return (
								<div className="flex flex-col gap-2">
									<EmailInput
										label="Email"
										placeholder="you@example.com"
										value={email}
										onChange={setEmail}
										validate={(val) =>
											val && !val.includes("@") ? "Invalid email" : null
										}
									/>
									<EmailInput
										label="Disabled"
										defaultValue="disabled@example.com"
										disabled
										size="sm"
									/>
								</div>
							);
						},
					},
					{
						id: "password-input",
						kind: "component",
						name: "PasswordInput",
						label: "Strength + toggle",
						related: relatedMap.PasswordInput,
						Render() {
							const [password, setPassword] = useState("");

							return (
								<div className="flex flex-col gap-2">
									<PasswordInput
										label="Password"
										placeholder="******"
										value={password}
										onChange={setPassword}
										showStrength
									/>
									<PasswordInput
										label="Disabled"
										placeholder="******"
										defaultValue="disabled"
										disabled
									/>
								</div>
							);
						},
					},
					{
						id: "text-area-input",
						kind: "component",
						name: "TextAreaInput",
						label: "Textarea",
						related: relatedMap.TextAreaInput,
						Render() {
							const [bio, setBio] = useState("");

							return (
								<div className="flex flex-col gap-2">
									<TextAreaInput
										label="Bio"
										placeholder="Short bio"
										value={bio}
										onChange={setBio}
										rows={3}
									/>
									<TextAreaInput
										label="With error"
										defaultValue="Too short"
										error="Add at least 10 characters"
										rows={2}
										size="sm"
									/>
								</div>
							);
						},
					},
					{
						id: "number-input",
						kind: "component",
						name: "NumberInput",
						label: "Numeric input",
						related: relatedMap.NumberInput,
						Render() {
							const [quantity, setQuantity] = useState(2);

							return (
								<div className="flex flex-col gap-2">
									<NumberInput
										label="Quantity"
										value={quantity}
										onChange={(next) => setQuantity(next ?? 0)}
										min={0}
										max={20}
										step={1}
										unit="pcs"
									/>
									<NumberInput
										label="Disabled"
										defaultValue={10}
										unit="pcs"
										disabled
										size="sm"
									/>
								</div>
							);
						},
					},
					{
						id: "unit-number-input",
						kind: "component",
						name: "UnitNumberInput",
						label: "Unit helper",
						related: relatedMap.UnitNumberInput,
						Render() {
							const [unitQuantity, setUnitQuantity] = useState(15);

							return (
								<div className="flex flex-col gap-2">
									<UnitNumberInput
										label="Budget"
										value={unitQuantity}
										unit="USD"
										onChange={(next) => setUnitQuantity(next ?? 0)}
									/>
									<UnitNumberInput
										label="Disabled"
										defaultValue={250}
										unit="USD"
										disabled
										size="sm"
									/>
								</div>
							);
						},
					},
					{
						id: "slider-input",
						kind: "component",
						name: "SliderInput",
						label: "Range + number",
						related: relatedMap.SliderInput,
						Render() {
							const [slider, setSlider] = useState(42);

							return (
								<div className="flex flex-col gap-2">
									<SliderInput
										label="Progress"
										value={slider}
										onChange={(next) => setSlider(next ?? 0)}
										min={0}
										max={100}
										step={1}
										unit="%"
									/>
									<SliderInput
										label="Disabled"
										value={30}
										onChange={() => {}}
										min={0}
										max={100}
										step={5}
										unit="%"
										disabled
										size="sm"
									/>
								</div>
							);
						},
					},
					{
						id: "phone-input",
						kind: "component",
						name: "PhoneInput",
						label: "Dial code input",
						related: relatedMap.PhoneInput,
						Render() {
							const [phone, setPhone] = useState<string | undefined>(undefined);

							return (
								<div className="flex flex-col gap-2">
									<PhoneInput label="Phone" value={phone} onChange={setPhone} />
									<PhoneInput
										label="Disabled"
										value="+1 555 0100"
										onChange={() => {}}
										disabled
										size="sm"
									/>
								</div>
							);
						},
					},
					{
						id: "select-input",
						kind: "component",
						name: "SelectInput",
						label: "Select + search",
						related: relatedMap.SelectInput,
						Render() {
							const [select, setSelect] = useState("alpha");

							return (
								<div className="flex flex-col gap-2">
									<SelectInput
										dropdownPositionStrategy="fixed"
										label="Select"
										placeholder="Select option"
										value={select}
										onChange={setSelect}
										options={LISTBOX_OPTIONS.map((opt) => ({
											value: opt.value,
											label: opt.content,
											symbol: opt.content[0],
										}))}
									/>
									<SelectInput
										label="Disabled"
										value="beta"
										onChange={() => {}}
										disabled
										size="sm"
										options={LISTBOX_OPTIONS.map((opt) => ({
											value: opt.value,
											label: opt.content,
											symbol: opt.content[0],
										}))}
									/>
								</div>
							);
						},
					},
					{
						id: "combobox-text-input",
						kind: "component",
						name: "ComboboxTextInput",
						label: "Combobox",
						related: relatedMap.ComboboxTextInput,
						Render() {
							const [combobox, setCombobox] = useState("Alpha");

							return (
								<div className="flex flex-col gap-2">
									<ComboboxTextInput
										label="Combobox"
										placeholder="Pick option"
										value={combobox}
										onChange={setCombobox}
										options={LISTBOX_OPTIONS.map((opt) => ({
											id: opt.value,
											label: opt.content,
										}))}
									/>
									<ComboboxTextInput
										label="Disabled"
										defaultValue="Gamma"
										disabled
										size="sm"
										options={LISTBOX_OPTIONS.map((opt) => ({
											id: opt.value,
											label: opt.content,
										}))}
									/>
								</div>
							);
						},
					},
					{
						id: "combobox-multi-select-input",
						kind: "component",
						name: "ComboboxMultiSelectInput",
						label: "Combo multiselect",
						related: relatedMap.ComboboxMultiSelectInput,
						Render() {
							const [comboboxMulti, setComboboxMulti] = useState(["alpha"]);

							return (
								<div className="flex flex-col gap-2">
									<ComboboxMultiSelectInput
										label="Combobox multi"
										placeholder="Search options"
										value={comboboxMulti}
										onChange={setComboboxMulti}
										endText={`${comboboxMulti.length} selected`}
										options={LISTBOX_OPTIONS.map((opt) => ({
											value: opt.value,
											label: opt.content,
											symbol: opt.content[0],
										}))}
									/>
									<ComboboxMultiSelectInput
										label="Disabled"
										placeholder="Search options"
										value={["beta"]}
										onChange={() => {}}
										endText="1 selected"
										disabled
										size="sm"
										options={LISTBOX_OPTIONS.map((opt) => ({
											value: opt.value,
											label: opt.content,
											symbol: opt.content[0],
										}))}
									/>
								</div>
							);
						},
					},
					{
						id: "date-range-dropdown",
						kind: "component",
						name: "DateRangeInput",
						label: "Date range",
						related: relatedMap.DateRangeInput,
						Render() {
							const [range, setRange] = useState<DateRangeValue | null>({
								end: "2026-07-15",
								start: "2026-07-10",
							});

							return (
								<div className="grid gap-4">
									<DateRangeInput
										label="Reporting window"
										onChange={setRange}
										value={range}
									/>
									<DateRangeInput label="Empty range" />
									<DateRangeInput
										dropdownPositionStrategy="fixed"
										label="Constrained range"
										max="2026-08-31"
										min="2026-06-01"
									/>
									<DateRangeInput
										disabled
										label="Disabled range"
										value={{ end: "2026-07-22", start: "2026-07-01" }}
									/>
									<DateRangeInput.Skeleton
										label="Loading range"
										value="Jul 10, 2026 - Jul 15, 2026"
									/>
								</div>
							);
						},
					},
					{
						id: "signature-input",
						kind: "component",
						name: "SignatureInput",
						label: "Canvas signature input",
						related: relatedMap.SignatureInput,
						Render() {
							return (
								<div className="grid w-full gap-4">
									<SignatureInput
										description="Draw inside the field."
										height={120}
										label="Signature"
									/>
									<SignatureInput disabled height={96} label="Disabled" />
									<SignatureInput.Skeleton
										height={120}
										label="Loading signature"
									/>
								</div>
							);
						},
					},
				],
			},
			{
				id: "ui-input-copy",
				title: "Copy Inputs",
				description: "Inputs with copy affordances",
				items: [
					{
						id: "text-input-copy",
						kind: "component",
						name: "TextInput",
						label: "Copy enabled",
						related: relatedMap.TextInput,
						Render() {
							const [token, setToken] = useState("invite-8392-AZ");

							return (
								<div className="flex flex-col gap-2">
									<TextInput
										label="Invite code"
										description="Copy and share this code"
										value={token}
										onChange={setToken}
										copy
									/>
									<TextInput
										label="Readonly copy"
										defaultValue="TEAM-ACCESS-2024"
										copy
										copyToastMessage="Access code copied"
									/>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-input-choice",
		slug: ["ui", "input", "choice"],
		title: "UI Input: Choice",
		description: "Radio, checkbox, and toggle inputs included in thin-start",
		groups: [
			{
				id: "choice-inputs",
				title: "Choice Inputs",
				description: "Native choice groups built from Field and indicators",
				items: [
					{
						id: "radio-input",
						kind: "component",
						name: "RadioInput",
						label: "Radio group",
						related: relatedMap.RadioInput,
						Render() {
							const [radio, setRadio] = useState("opt1");

							return (
								<RadioInput
									label="Radio"
									options={[
										{ value: "opt1", label: "Option 1" },
										{ value: "opt2", label: "Option 2" },
										{ value: "opt3", label: "Option 3", disabled: true },
									]}
									value={radio}
									onChange={setRadio}
								/>
							);
						},
					},
					{
						id: "multiselect-input",
						kind: "component",
						name: "MultiselectInput",
						label: "Multi checkbox",
						related: relatedMap.MultiselectInput,
						Render() {
							const [multiselect, setMultiselect] = useState(["opt1"]);

							return (
								<MultiselectInput
									label="Multiselect"
									options={[
										{ value: "opt1", label: "Option 1" },
										{ value: "opt2", label: "Option 2" },
										{ value: "opt3", label: "Option 3", disabled: true },
									]}
									value={multiselect}
									onChange={setMultiselect}
								/>
							);
						},
					},
					{
						id: "button-multiselect-input",
						kind: "component",
						name: "ButtonMultiSelectInput",
						label: "Button multi-select",
						related: relatedMap.ButtonMultiSelectInput,
						Render() {
							const [buttonChoices, setButtonChoices] = useState([
								"design",
								"copy",
							]);

							return (
								<ButtonMultiSelectInput
									label="Review focus"
									description="Compact button choices for filters, tags, and preference pickers."
									options={[
										{ value: "design", label: "Design" },
										{ value: "copy", label: "Copy" },
										{ value: "motion", label: "Motion" },
										{ value: "blocked", label: "Blocked", disabled: true },
									]}
									value={buttonChoices}
									onChange={setButtonChoices}
								/>
							);
						},
					},
					{
						id: "toggle-input",
						kind: "component",
						name: "ToggleInput",
						label: "Toggle list",
						related: relatedMap.ToggleInput,
						Render() {
							const [toggles, setToggles] = useState(["opt2"]);

							return (
								<ToggleInput
									label="Toggles"
									options={[
										{ value: "opt1", label: "Option 1" },
										{ value: "opt2", label: "Option 2" },
										{ value: "opt3", label: "Option 3", disabled: true },
									]}
									value={toggles}
									onChange={setToggles}
								/>
							);
						},
					},
					{
						id: "choice-field",
						kind: "component",
						name: "ChoiceField",
						label: "Accessible choice",
						related: relatedMap.ChoiceField,
						Render() {
							const [choiceDemo, setChoiceDemo] = useState("choice-a");

							return (
								<div className="flex flex-col gap-2">
									<ChoiceField
										id="choice-a"
										label="Choice A"
										value="choice-a"
										checked={choiceDemo === "choice-a"}
										indicator={
											<ChoiceIndicatorRadio
												checked={choiceDemo === "choice-a"}
											/>
										}
										onChange={(value) => setChoiceDemo(value)}
									/>
									<ChoiceField
										id="choice-b"
										label="Choice B"
										value="choice-b"
										checked={choiceDemo === "choice-b"}
										indicator={
											<ChoiceIndicatorRadio
												checked={choiceDemo === "choice-b"}
											/>
										}
										onChange={(value) => setChoiceDemo(value)}
									/>
									<ChoiceField
										id="choice-c"
										label="Choice C (disabled)"
										value="choice-c"
										checked={false}
										disabled
										indicator={<ChoiceIndicatorRadio checked={false} />}
										onChange={(value) => setChoiceDemo(value)}
									/>
								</div>
							);
						},
					},
					{
						id: "choice-indicator-radio",
						kind: "component",
						name: "ChoiceIndicatorRadio",
						label: "Radio indicator",
						related: relatedMap.ChoiceIndicatorRadio,
						Render() {
							return <ChoiceIndicatorRadio checked />;
						},
					},
					{
						id: "choice-indicator-multi",
						kind: "component",
						name: "ChoiceIndicatorMulti",
						label: "Checkbox indicator",
						related: relatedMap.ChoiceIndicatorMulti,
						Render() {
							return <ChoiceIndicatorMulti checked />;
						},
					},
					{
						id: "choice-indicator-toggle",
						kind: "component",
						name: "ChoiceIndicatorToggle",
						label: "Toggle indicator",
						related: relatedMap.ChoiceIndicatorToggle,
						Render() {
							return <ChoiceIndicatorToggle checked />;
						},
					},
				],
			},
		],
	},
	{
		id: "ui-input-choice-lab",
		slug: ["ui", "input", "choice", "lab"],
		title: "Choice Indicator Review",
		description:
			"Locked production treatment for solid radio and checkbox indicators with the muted contrast toggle.",
		visibility: "dev-only",
		groups: [
			{
				id: "choice-indicator-locked",
				title: "Locked choice indicators",
				description:
					"These examples now render the shared production indicators rather than page-local experiments.",
				columns: "grid-cols-1 xl:grid-cols-2",
				items: [
					{
						id: "choice-locked-indicators",
						kind: "component",
						name: "Production indicators",
						label: "Solid + muted contrast",
						related: {
							uses: [
								"ChoiceField",
								"ChoiceIndicatorRadio",
								"ChoiceIndicatorMulti",
								"ChoiceIndicatorToggle",
							],
							usedIn: [],
						},
						Render() {
							return <LockedChoiceIndicatorLab />;
						},
					},
				],
			},
		],
	},
	{
		id: "ui-input-files",
		slug: ["ui", "input", "files"],
		title: "UI Input: Files",
		description: "File selection + previews",
		groups: [
			{
				id: "file-inputs",
				title: "File Inputs",
				description: "File selection + previews",
				columns: "grid-cols-1 lg:grid-cols-2",
				items: [
					{
						id: "file-input",
						kind: "component",
						name: "FileInput",
						label: "Selection + previews",
						related: relatedMap.FileInput,
						className: "lg:col-span-2",
						Render() {
							const [items, setItems] = useState<FileInputItem[]>([
								{
									key: "saved-image",
									name: "mercury.png",
									status: "uploaded",
									type: "image/png",
									url: "/test/mercury.png",
								},
							]);
							const [emptyItems, setEmptyItems] = useState<FileInputItem[]>([]);

							return (
								<div className="grid gap-6">
									<FileInput
										accept="image/*,application/pdf"
										items={items}
										onItemsChange={setItems}
										label="Attachments"
										description="Add, drop, inspect, and remove images or PDFs. Other file types are rejected inline."
										labels={{ uploaded: "Saved" }}
									/>
									<div className="grid gap-4 md:grid-cols-3">
										<FileInput
											items={emptyItems}
											label="Empty editable"
											onItemsChange={setEmptyItems}
										/>
										<FileInput
											items={items}
											label="Read only"
											mode="read"
											onItemsChange={setItems}
										/>
										<FileInput
											disabled
											items={items}
											label="Disabled"
											onItemsChange={setItems}
										/>
									</div>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-misc",
		slug: ["ui", "misc"],
		title: "UI Misc",
		description: "Helpers + states",
		groups: [
			{
				id: "misc-feedback",
				title: "Misc & Feedback",
				description: "Helpers + states",
				items: [
					{
						id: "accordion",
						kind: "component",
						name: "Accordion",
						label: "Disclosure",
						related: relatedMap.Accordion,
						Render() {
							const [cardOpen, setCardOpen] = useState(true);

							return (
								<div className="grid gap-6">
									<div className="grid gap-2">
										<Accordion
											description="Closed without a leading icon."
											title="Compact disclosure"
										>
											This borderless row is closed by default.
										</Accordion>
										<Accordion
											defaultOpen
											description="Open with a leading icon."
											icon={<Icon name="info" size="sm" />}
											title="Open disclosure"
										>
											Open content keeps the same horizontal edge as its
											trigger.
										</Accordion>
										<Accordion title="Disabled disclosure" disabled>
											Disabled content.
										</Accordion>
										<Accordion.Skeleton
											description="Closed without a leading icon."
											title="Compact disclosure"
										/>
										<Accordion.Skeleton
											description="Open with a leading icon."
											leadingIcon
											open
											title="Open disclosure"
										>
											<Text.Skeleton tone="muted" variant="support">
												Open content keeps the same horizontal edge as its
												trigger.
											</Text.Skeleton>
										</Accordion.Skeleton>
										<Accordion.Skeleton
											title="Skeleton without a trailing icon"
											trailingIcon={false}
										/>
									</div>
									<Accordion.Card onOpenChange={setCardOpen} open={cardOpen}>
										<Accordion.Header className="border-b">
											<Accordion.Title>Collapsible Card</Accordion.Title>
											<Accordion.Description>
												Card slots keep their normal geometry while content and
												footer collapse together.
											</Accordion.Description>
											<Accordion.Action>
												<Button size="sm">Review</Button>
											</Accordion.Action>
										</Accordion.Header>
										<Accordion.Content>
											<Text tone="muted" variant="support">
												The chevron alone controls this structured disclosure.
											</Text>
										</Accordion.Content>
										<Accordion.Footer className="justify-end">
											<Button size="sm" variant="primary">
												Continue
											</Button>
										</Accordion.Footer>
									</Accordion.Card>
									<Accordion.Card disabled>
										<Accordion.Header>
											<Accordion.Title>Disabled Card</Accordion.Title>
											<Accordion.Description>
												Its disclosure control remains unavailable.
											</Accordion.Description>
										</Accordion.Header>
										<Accordion.Content>Disabled content.</Accordion.Content>
									</Accordion.Card>
									<Accordion.Card.Skeleton
										action={<Button.Skeleton size="sm">Review</Button.Skeleton>}
										description="Card slots keep their normal geometry while content and footer collapse together."
										footer={
											<Button.Skeleton size="sm" variant="primary">
												Continue
											</Button.Skeleton>
										}
										footerClassName="justify-end"
										headerClassName="border-b"
										open
										title="Collapsible Card"
									/>
									<Accordion.Card.Skeleton
										description="A structural Card skeleton can omit the disclosure icon."
										title="No trailing caret"
										trailingIcon={false}
									/>
								</div>
							);
						},
					},
					{
						id: "step-indicator",
						kind: "component",
						name: "StepIndicator",
						label: "Modal workflow steps",
						Render() {
							const [step, setStep] = useState("details");
							return (
								<StepIndicator
									currentStep={step}
									onStepChange={setStep}
									steps={[
										{ id: "details", label: "Details" },
										{ id: "review", label: "Review" },
										{ id: "finish", label: "Finish" },
									]}
								/>
							);
						},
					},
					{
						id: "segmented-control",
						kind: "component",
						name: "SegmentedControl",
						label: "Segmented control",
						related: relatedMap.SegmentedControl,
						Render() {
							const [segment, setSegment] = useState("overview");
							const [segmentAlt, setSegmentAlt] = useState("alerts");

							return (
								<div className="flex flex-col gap-2">
									<SegmentedControl
										options={[
											{ value: "overview", label: "Overview" },
											{ value: "insights", label: "Insights" },
											{ value: "alerts", label: "Alerts" },
										]}
										value={segment}
										onChange={setSegment}
									/>
									<SegmentedControl
										options={[
											{ value: "overview", label: "Overview" },
											{ value: "insights", label: "Insights" },
											{ value: "alerts", label: "Alerts", disabled: true },
										]}
										value={segmentAlt}
										onChange={setSegmentAlt}
										layout="auto"
										roundedFull
									/>
								</div>
							);
						},
					},
					{
						id: "copy-field",
						kind: "component",
						name: "CopyField",
						label: "Copy helper",
						related: relatedMap.CopyField,
						Render() {
							return (
								<div className="grid gap-2">
									<CopyField value="https://example.com/copy" />
									<CopyField
										value="+31 20 123 4567"
										type="phone"
										showIcon={false}
									/>
								</div>
							);
						},
						skeleton: {
							name: "CopyField.Skeleton",
							Render() {
								return (
									<CopyField.Skeleton placeholder="https://example.com/copy" />
								);
							},
						},
					},
					{
						id: "copy-action",
						kind: "component",
						name: "useCopyAction",
						label: "Copy action hook",
						related: relatedMap.useCopyAction,
						Render() {
							const { copied, handleCopy } = useCopyAction({
								value: "template-copy-value",
								toastMessage: "Copied template value",
							});

							return (
								<div className="flex flex-col gap-2">
									<Button
										size="sm"
										variant="secondary"
										onClick={() => {
											void handleCopy();
										}}
										trailingIcon={<CopyStatusIcon copied={copied} />}
									>
										{copied ? "Copied" : "Copy value"}
									</Button>
									<Text variant="caption" tone="muted">
										Shared hook plus status icon for copy affordances outside
										CopyField.
									</Text>
								</div>
							);
						},
					},
					{
						id: "social-links",
						kind: "component",
						name: "SocialLinks",
						label: "Social links",
						related: relatedMap.SocialLinks,
						Render() {
							const links = [
								{
									href: "https://instagram.com/example",
									label: "Instagram",
								},
								{ href: "https://x.com/example", label: "X" },
								{
									href: "https://linkedin.com/company/example",
									label: "LinkedIn",
								},
								{
									href: "https://youtube.com/@example",
									label: "YouTube",
								},
							];

							return (
								<div className="flex flex-col gap-3">
									<SocialLinks links={links} />
									<SocialLinks links={links.slice(0, 3)} showLabels size="sm" />
								</div>
							);
						},
					},
					{
						id: "dropdown-menu",
						kind: "component",
						name: "Dropdown.Menu",
						label: "Overflow menu",
						related: relatedMap.Dropdown,
						Render() {
							return (
								<Dropdown.Menu
									ariaLabel="Open overflow menu"
									options={[
										{ label: "Edit", href: "/" },
										{ label: "Duplicate", onSelect: () => {} },
										{ label: "Archive", onSelect: () => {} },
									]}
								/>
							);
						},
					},
					{
						id: "pagination-controls",
						kind: "component",
						name: "PaginationControls",
						label: "Compact pager",
						related: relatedMap.PaginationControls,
						Render() {
							const [page, setPage] = useState(3);
							const total = 8;

							return (
								<PaginationControls
									current={page}
									total={total}
									onPrev={() => setPage((value) => Math.max(1, value - 1))}
									onNext={() => setPage((value) => Math.min(total, value + 1))}
									disablePrev={page <= 1}
									disableNext={page >= total}
								/>
							);
						},
					},
					{
						id: "image-switcher",
						kind: "component",
						name: "ImageSwitcher",
						label: "Preloaded image switcher",
						related: relatedMap.ImageSwitcher,
						Render() {
							return (
								<ImageSwitcher
									images={imageSwitcherDemoImages}
									frameClassName="h-64 max-w-xl"
									imageClassName="object-cover"
									controlsClassName="justify-center"
									paginationButtonSize="icon"
									preserveIconDirection
									sizes="(min-width: 768px) 36rem, 100vw"
								/>
							);
						},
					},
					{
						id: "scroll-borders",
						kind: "component",
						name: "ScrollBorders",
						label: "Scrollable edge affordances",
						related: relatedMap.ScrollBorders,
						Render() {
							return (
								<ScrollBorders className="h-40 overflow-y-auto bg-surface px-4 py-3">
									<div className="flex flex-col gap-3">
										{[1, 2, 3, 4, 5, 6, 7, 8, 9, 10].map((sectionNumber) => (
											<Panel
												key={`scroll-borders-demo-${sectionNumber}`}
												background="background"
												border="subtle"
												gap="none"
												padding="xs"
												radius="xs"
												shadow="none"
											>
												<Text as="p" variant="bodyStrong">
													Section {sectionNumber}
												</Text>
												<Text as="p" variant="body" tone="muted">
													Keep longer scroll regions readable without inventing
													page-local chrome.
												</Text>
											</Panel>
										))}
									</div>
								</ScrollBorders>
							);
						},
						skeleton: {
							name: "ScrollBorders.Skeleton",
							related: relatedMap.ScrollBorders,
							Render() {
								return (
									<ScrollBorders.Skeleton className="h-40 rounded-lg bg-surface px-4 py-3">
										<div className="flex flex-col gap-3">
											{[1, 2, 3, 4, 5].map((sectionNumber) => (
												<Panel
													key={`scroll-borders-skeleton-${sectionNumber}`}
													background="background"
													border="subtle"
													gap="none"
													padding="xs"
													radius="xs"
													shadow="none"
												>
													<Text.Skeleton as="p" variant="bodyStrong">
														Section {sectionNumber}
													</Text.Skeleton>
													<Text.Skeleton as="p" variant="body">
														Keep longer scroll regions readable without
														inventing page-local chrome.
													</Text.Skeleton>
												</Panel>
											))}
										</div>
									</ScrollBorders.Skeleton>
								);
							},
						},
					},
					{
						id: "tooltip",
						kind: "component",
						name: "Tooltip",
						label: "Hover helper",
						related: relatedMap.Tooltip,
						Render() {
							return (
								<Tooltip content="Search the shared component library.">
									<Button size="sm" variant="secondary">
										Library tip
									</Button>
								</Tooltip>
							);
						},
					},
					{
						id: "loader",
						kind: "component",
						name: "Loader",
						label: "Spinner",
						related: relatedMap.Loader,
						Render() {
							return (
								<div className="flex gap-2">
									<Loader className="text-primary" />
									<Loader className="text-muted-foreground" />
								</div>
							);
						},
					},
					{
						id: "health-check-indicator",
						kind: "component",
						name: "HealthCheckIndicator",
						label: "Service status",
						related: relatedMap.HealthCheckIndicator,
						Render() {
							return (
								<div className="flex flex-col items-start gap-2">
									<HealthCheckIndicator label="Supabase" />
									<HealthCheckIndicator label="Supabase" variant="sm" />
								</div>
							);
						},
					},
					{
						id: "profile-picture",
						kind: "component",
						name: "ProfilePicture",
						label: "Avatar display",
						related: relatedMap.ProfilePicture,
						Render() {
							return (
								<div className="grid gap-4">
									<div className="flex flex-wrap items-center gap-3">
										<ProfilePicture name="Ada Lovelace" size="sm" />
										<ProfilePicture name="Grace Hopper" />
										<ProfilePicture name="Unknown user" size="lg" />
										<ProfilePicture
											fallback="AL"
											name="Ada Lovelace"
											size="xl"
										/>
										<ProfilePicture size="2xl" />
									</div>
								</div>
							);
						},
						skeleton: {
							name: "ProfilePicture.Skeleton",
							related: relatedMap.ProfilePicture,
							Render() {
								return (
									<div className="flex items-center gap-3">
										<ProfilePicture loading size="sm" />
										<ProfilePicture loading />
										<ProfilePicture loading size="lg" />
										<ProfilePicture loading size="2xl" />
									</div>
								);
							},
						},
					},
					{
						id: "profile-picture-stack",
						kind: "component",
						name: "ProfilePictureStack",
						label: "Collaborator group",
						related: relatedMap.ProfilePicture,
						Render() {
							return (
								<div className="scroll-target" id="profile-picture-stack">
									<ProfilePictureStack
										ariaLabel="Project collaborators"
										items={[
											{
												fallback: "AL",
												helperIndex: 0,
												id: "ada-lovelace",
												name: "Ada Lovelace",
											},
											{
												fallback: "GH",
												helperIndex: 2,
												id: "grace-hopper",
												name: "Grace Hopper",
											},
											{
												fallback: "KJ",
												helperIndex: 4,
												id: "katherine-johnson",
												name: "Katherine Johnson",
											},
											{
												fallback: "HM",
												helperIndex: 6,
												id: "hedy-lamarr",
												name: "Hedy Lamarr",
											},
										]}
									/>
								</div>
							);
						},
					},
					{
						id: "skeleton",
						kind: "component",
						name: "Skeleton",
						label: "Skeleton block",
						related: relatedMap.Skeleton,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Skeleton className="h-6 w-32" />
									<Text.Skeleton variant="body">Skeleton text</Text.Skeleton>
								</div>
							);
						},
					},
					{
						id: "suspense-boundary",
						kind: "component",
						name: "SuspenseBoundary",
						label: "Default + ghost loading",
						related: relatedMap.SuspenseBoundary,
						Render() {
							const [contentState, setContentState] = useState<
								"loading" | "error" | "ready"
							>("ready");

							return (
								<div className="flex flex-col gap-2">
									<div className="flex gap-2">
										<Button
											size="sm"
											onClick={() => setContentState("loading")}
										>
											Loading
										</Button>
										<Button
											size="sm"
											variant="secondary"
											onClick={() => setContentState("error")}
										>
											Error
										</Button>
										<Button
											size="sm"
											variant="ghost"
											onClick={() => setContentState("ready")}
										>
											Ready
										</Button>
									</div>
									<div className="grid gap-3 lg:grid-cols-2">
										<div className="flex flex-col gap-2">
											<Text variant="caption" tone="muted">
												Default fallback
											</Text>
											<SuspenseBoundary
												loading={contentState === "loading"}
												error={contentState === "error"}
												fallback={
													<div className="flex items-center justify-center py-10">
														<Loader />
													</div>
												}
											>
												<ShareReportDemo />
											</SuspenseBoundary>
										</div>
										<div className="flex flex-col gap-2">
											<Text variant="caption" tone="muted">
												Ghost fallback
											</Text>
											<SuspenseBoundary
												loading={contentState === "loading"}
												error={contentState === "error"}
												ghost
												fallback={<ShareReportDemo skeleton />}
											>
												<ShareReportDemo />
											</SuspenseBoundary>
										</div>
									</div>
								</div>
							);
						},
					},
					{
						id: "inspectable-image",
						kind: "component",
						name: "InspectableImage",
						label: "Image inspect",
						related: relatedMap.InspectableImage,
						Render() {
							return (
								<DemoMediaFrame>
									<InspectableImage
										src="/test/blob.png"
										alt="Preview"
										width={120}
										height={80}
									/>
								</DemoMediaFrame>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-misc-state",
		slug: ["ui", "misc", "state"],
		title: "UI Misc: State",
		description: "State helpers",
		groups: [
			{
				id: "misc-state",
				title: "State",
				description: "State helpers",
				items: [
					{
						id: "state-indicator",
						kind: "component",
						name: "StateIndicator",
						label: "State summary",
						related: relatedMap.StateIndicator,
						Render() {
							return (
								<div className="grid gap-4">
									<StateIndicator
										align="center"
										description="This dashboard route is unavailable."
										layout="stacked"
										title="Surface unavailable"
									/>
									<StateIndicator
										align="center"
										description="Create the first record to populate this surface."
										iconClassName="text-muted-foreground"
										iconName="cards"
										layout="stacked"
										title="No records yet"
										variant="framed"
									/>
								</div>
							);
						},
					},
					{
						id: "error-state",
						kind: "component",
						name: "ErrorState",
						label: "Error state",
						related: relatedMap.ErrorState,
						Render() {
							return <ErrorState description="Try again later" />;
						},
					},
					{
						id: "idle-state",
						kind: "component",
						name: "IdleState",
						label: "Idle state",
						related: relatedMap.IdleState,
						Render() {
							return <IdleState description="Nothing here yet" />;
						},
					},
				],
			},
		],
	},
	{
		id: "ui-motion",
		slug: ["ui", "motion"],
		title: "UI Motion",
		description: "Reveal + scroll motion",
		groups: [
			{
				id: "motion",
				title: "Motion",
				description: "Reveal + scroll motion",
				items: [
					{
						id: "reveal-root",
						kind: "component",
						name: "Reveal.Root",
						label: "Visible-item scheduler",
						related: relatedMap["Reveal.Root"],
						Render() {
							return (
								<Reveal.Root>
									<Reveal.Item>
										<Text variant="bodyStrong">Reveal 1</Text>
									</Reveal.Item>
									<Reveal.Item>
										<Text variant="bodyStrong">Reveal 2</Text>
									</Reveal.Item>
								</Reveal.Root>
							);
						},
					},
					{
						id: "reveal-group",
						kind: "component",
						name: "Reveal.List",
						label: "Local stagger boundary",
						related: relatedMap["Reveal.List"],
						Render() {
							return (
								<Reveal.List className="flex flex-col gap-2" stagger={0.16}>
									<Reveal.Item>
										<Text variant="bodyStrong">Scoped reveal 1</Text>
									</Reveal.Item>
									<Reveal.Item>
										<Text variant="bodyStrong">Scoped reveal 2</Text>
									</Reveal.Item>
								</Reveal.List>
							);
						},
					},
					{
						id: "reveal-image",
						kind: "component",
						name: "Reveal.Image",
						label: "Image reveal strategies",
						related: relatedMap["Reveal.Image"],
						Render() {
							return (
								<div className="grid gap-3 md:grid-cols-2 xl:grid-cols-3">
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Default: ignores image load
										</Text>
										<DemoMediaFrame>
											<Reveal.Image
												src="/test/blob.png"
												alt="Abstract blob"
												fill
												sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
												useViewport={false}
												className="w-full"
												contentClassName="aspect-[4/3] w-full overflow-hidden"
												imageClassName="object-cover"
											/>
										</DemoMediaFrame>
									</div>
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Opt-in: waits for image load
										</Text>
										<DemoMediaFrame>
											<Reveal.Image
												src="/test/mercury.png"
												alt="Mercury-like abstract surface"
												fill
												sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
												useViewport={false}
												loadStrategy="wait-for-load"
												placeholder="blur"
												blurDataURL={imageSwitcherDemoImages[0].blurDataURL}
												className="w-full"
												contentClassName="aspect-[4/3] w-full overflow-hidden"
												imageClassName="object-cover"
												fallback={<Skeleton className="h-full w-full" />}
											/>
										</DemoMediaFrame>
									</div>
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Corner clip with overlay
										</Text>
										<DemoMediaFrame>
											<Reveal.Image
												src="/test/blob.png"
												alt="Abstract blob with overlay"
												fill
												sizes="(min-width: 1280px) 33vw, (min-width: 768px) 50vw, 100vw"
												useViewport={false}
												revealVariant="corner-clip"
												revealOrigin="top-left"
												revealFinalRadius={16}
												className="w-full"
												contentClassName="aspect-[4/3] w-full overflow-hidden"
												imageClassName="object-cover"
												overlay={
													<Panel
														background="background"
														border="subtle"
														gap="none"
														padding="xs"
														radius="sm"
														shadow="sm"
														className="absolute inset-x-3 bottom-3 bg-background/85 text-foreground backdrop-blur-sm"
													>
														<Text variant="bodyStrong">Overlay content</Text>
														<Text
															variant="caption"
															tone="muted"
															className="mt-1 block"
														>
															Content stays inside the reveal mask.
														</Text>
													</Panel>
												}
											/>
										</DemoMediaFrame>
									</div>
								</div>
							);
						},
					},
					{
						id: "reveal-text",
						kind: "component",
						name: "Reveal.Text",
						label: "Character stagger text",
						related: relatedMap["Reveal.Text"],
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Reveal.Text as="h3" variant="headingSm">
										Character reveals run as one scheduled reveal item.
									</Reveal.Text>
									<Reveal.Item>
										<Text variant="body" tone="muted">
											Use it for short headlines or callouts that should feel
											more deliberate than a plain line fade.
										</Text>
									</Reveal.Item>
								</div>
							);
						},
					},
					{
						id: "reveal-highlight-text",
						kind: "component",
						name: "Reveal.HighlightText",
						label: "Substring highlight reveal",
						related: relatedMap["Reveal.HighlightText"],
						Render() {
							return (
								<div className="space-y-3">
									<Reveal.HighlightText
										as="h3"
										variant="headingSm"
										highlight="primary signal"
										useViewport={false}
									>
										Reveal one primary signal inside a longer line.
									</Reveal.HighlightText>
									<Reveal.HighlightText
										as="p"
										variant="body"
										tone="muted"
										highlight="LTR + RTL"
										useViewport={false}
									>
										Mixed direction copy keeps LTR + RTL text stable.
									</Reveal.HighlightText>
								</div>
							);
						},
					},
					{
						id: "reveal-numeric",
						kind: "component",
						name: "Reveal.Numeric",
						label: "Stats count-up",
						related: relatedMap["Reveal.Numeric"],
						Render() {
							return <RevealNumericStatsDemo />;
						},
					},
					{
						id: "letter-wave",
						kind: "component",
						name: "LetterWave",
						label: "Hover wave text",
						related: relatedMap.LetterWave,
						Render() {
							return (
								<div className="group w-fit space-y-2">
									<LetterWave as="span" variant="headingXs">
										Hover to send the wave across the label.
									</LetterWave>
									<Text variant="caption" tone="muted">
										Pair it with a parent <code>group</code> container.
									</Text>
								</div>
							);
						},
					},
					{
						id: "active-stage-host",
						kind: "component",
						name: "ActiveStageHost",
						label: "Auto-cycling active stage",
						related: relatedMap.ActiveStageHost,
						Render() {
							return <ActiveStageHostDemo />;
						},
					},
					{
						id: "use-touch-screen",
						kind: "component",
						name: "useTouchScreen",
						label: "Pointer capability hook",
						related: relatedMap.useTouchScreen,
						Render() {
							return <TouchScreenStatusDemo />;
						},
					},
					{
						id: "reveal-image-group",
						kind: "component",
						name: "Reveal.Image + Reveal.List",
						label: "Image-driven stagger",
						related: relatedMap["Reveal.Image"],
						Render() {
							const [imageSrc, setImageSrc] = useState("/test/blob.png");
							const [imageReady, setImageReady] = useState(false);

							return (
								<div className="flex flex-col gap-3">
									<div className="flex flex-wrap gap-2">
										<Button
											size="sm"
											variant="primary"
											onClick={() => setImageSrc("/test/blob.png")}
										>
											Blob
										</Button>
										<Button
											size="sm"
											variant="secondary"
											onClick={() => setImageSrc("/test/mercury.png")}
										>
											Mercury
										</Button>
									</div>
									<DemoMediaFrame>
										<Reveal.Image
											key={imageSrc}
											src={imageSrc}
											alt="Image-driven reveal"
											fill
											sizes="(min-width: 768px) 50vw, 100vw"
											useViewport={false}
											className="w-full"
											contentClassName="aspect-[4/3] w-full overflow-hidden"
											imageClassName="object-cover"
											onRevealStateChange={setImageReady}
										/>
									</DemoMediaFrame>
									<Reveal.List
										active={imageReady}
										className="flex flex-col gap-2"
										stagger={0.16}
									>
										<Reveal.Item>
											<Text variant="bodyStrong">
												Caption appears after reveal
											</Text>
										</Reveal.Item>
										<Reveal.Item>
											<Text variant="body" tone="muted">
												Use <code>onRevealStateChange</code> to gate the next
												stagger explicitly.
											</Text>
										</Reveal.Item>
									</Reveal.List>
								</div>
							);
						},
					},
					{
						id: "motion-scene",
						kind: "component",
						name: "MotionScene",
						label: "Staged scene orchestration",
						related: relatedMap.MotionScene,
						Render() {
							const [imageSrc, setImageSrc] = useState("/test/blob.png");

							return (
								<div className="flex flex-col gap-3">
									<div className="flex flex-wrap gap-2">
										<Button
											size="sm"
											variant="primary"
											onClick={() => setImageSrc("/test/blob.png")}
										>
											Blob
										</Button>
										<Button
											size="sm"
											variant="secondary"
											onClick={() => setImageSrc("/test/mercury.png")}
										>
											Mercury
										</Button>
									</div>
									<MotionScene key={imageSrc}>
										<div className="flex flex-col gap-3">
											<DemoMediaFrame>
												<Reveal.Image
													src={imageSrc}
													alt="Motion scene image"
													fill
													sizes="(min-width: 768px) 50vw, 100vw"
													useViewport={false}
													loadStrategy="wait-for-load"
													after="app"
													unlock="media"
													className="w-full"
													contentClassName="aspect-[4/3] w-full overflow-hidden"
													imageClassName="object-cover"
												/>
											</DemoMediaFrame>
											<Reveal.List
												after="media"
												unlock="content"
												className="flex flex-col gap-2"
												stagger={0.16}
											>
												<Reveal.Item>
													<Text variant="headingSm">
														Content waits for the media reveal to finish.
													</Text>
												</Reveal.Item>
												<Reveal.Item>
													<Text variant="body" tone="muted">
														This keeps the section API declarative instead of
														wiring image state through page-local booleans.
													</Text>
												</Reveal.Item>
											</Reveal.List>
											<Text variant="bodyStrong" as="span">
												<Reveal.Scramble
													text="Accent copy unlocks after the content stage."
													after="content"
													unlock="accent"
													maintainSpace
												/>
											</Text>
											<Reveal.List
												after="accent"
												className="flex gap-2"
												stagger={0.12}
											>
												<Reveal.Item>
													<Chip>Scene</Chip>
												</Reveal.Item>
												<Reveal.Item>
													<Chip>Unlocked</Chip>
												</Reveal.Item>
											</Reveal.List>
										</div>
									</MotionScene>
								</div>
							);
						},
					},
					{
						id: "scramble-reveal",
						kind: "component",
						name: "Reveal.Scramble",
						label: "Text scramble",
						related: relatedMap["Reveal.Scramble"],
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Text variant="bodyStrong" as="span">
										<Reveal.Scramble
											text="Signal decoding in progress"
											maintainSpace
										/>
									</Text>
									<Text variant="body" as="span">
										<Reveal.Scramble
											text="Secondary line with delay"
											delay={0.1}
											maintainSpace
										/>
									</Text>
								</div>
							);
						},
					},
					{
						id: "scroll-highlight-text",
						kind: "component",
						name: "ScrollHighlightText",
						label: "Scroll-driven text emphasis",
						related: relatedMap.ScrollHighlightText,
						Render() {
							return (
								<div className="grid gap-4">
									<div className="space-y-2">
										<Text variant="caption" tone="muted">
											Scroll character emphasis
										</Text>
										<Text variant="headingSm" as="h3">
											<ScrollHighlightText
												className="text-foreground"
												highlightRange={[0.12, 0.9]}
											>
												Clarity arrives as the section lands.
											</ScrollHighlightText>
										</Text>
									</div>
									<div className="space-y-2">
										<Text variant="caption" tone="muted">
											Viewport color emphasis
										</Text>
										<Text variant="headingSm" as="h3">
											<ScrollHighlightText
												baseColor={scrollHighlightBaseColor}
												targetColor={scrollHighlightTargetColor}
												variant="viewport"
												viewportAmount={0.62}
											>
												Viewport state can drive one clean color transition.
											</ScrollHighlightText>
										</Text>
									</div>
								</div>
							);
						},
					},
					{
						id: "scroll-lag",
						kind: "component",
						name: "ScrollLag",
						label: "Scroll lag",
						related: relatedMap.ScrollLag,
						Render() {
							return (
								<Panel
									background="surface"
									border="subtle"
									padding="xs"
									radius="sm"
									shadow="none"
								>
									<ScrollLag>
										<Text variant="bodyStrong">ScrollLag</Text>
									</ScrollLag>
								</Panel>
							);
						},
					},
					{
						id: "scroll-width",
						kind: "component",
						name: "ScrollWidth",
						label: "Scroll-driven frame reveal",
						related: relatedMap.ScrollWidth,
						Render() {
							return (
								<div className="space-y-3">
									<Text variant="body" tone="muted">
										The side masks open up as the card crosses the viewport.
									</Text>
									<div className="min-h-[18rem]">
										<ScrollWidth
											className="h-64 w-full"
											frameClassName="border border-border/10 bg-surface/70"
											contentClassName="rounded-[inherit] bg-linear-to-br from-surface via-surface/90 to-surface-secondary/70"
											coverClassName="bg-background"
											startInset={112}
											endInset={0}
											startRadius={{ tl: 40, tr: 40, br: 24, bl: 24 }}
											endRadius={{ tl: 24, tr: 24, br: 24, bl: 24 }}
											progressRange={[0.1, 0.8]}
										>
											<div className="flex h-full flex-col justify-end gap-2 p-6">
												<Text variant="headingSm">ScrollWidth</Text>
												<Text variant="body" tone="muted">
													Use it for cards or media where the frame should open
													progressively instead of snapping full width.
												</Text>
											</div>
										</ScrollWidth>
									</div>
								</div>
							);
						},
					},
					{
						id: "scroll-parallax",
						kind: "component",
						name: "ScrollParallax",
						label: "Scroll parallax",
						related: relatedMap.ScrollParallax,
						Render() {
							return (
								<Panel
									background="surface"
									border="subtle"
									padding="xs"
									radius="sm"
									shadow="none"
								>
									<ScrollParallax magnitude={50}>
										<Text variant="bodyStrong">Parallax</Text>
									</ScrollParallax>
								</Panel>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-overlays",
		slug: ["ui", "overlays"],
		title: "UI Overlays",
		description: "Portals, modals, toasts",
		groups: [
			{
				id: "overlays",
				title: "Overlays",
				description: "Portals + overlay sections",
				items: [
					{
						id: "overlay-links",
						kind: "component",
						name: "Overlay Links",
						label: "Jump to overlays",
						Render() {
							return (
								<OverviewLinks
									links={[
										{
											href: "/internal/demo/ui/overlays/modal",
											label: "Modal",
										},
										{
											href: "/internal/demo/ui/overlays/toast",
											label: "Toast",
										},
									]}
								/>
							);
						},
					},
					{
						id: "portal",
						kind: "component",
						name: "Portal",
						label: "Portal target",
						related: relatedMap.Portal,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Text variant="caption" tone="muted">
										Portal target
									</Text>
									<Panel
										id="portal-demo-target"
										background="surface"
										border="subtle"
										display="block"
										padding="xs"
										radius="sm"
										shadow="none"
										className="min-h-10 border-dashed text-xs text-muted-foreground"
									/>
									<Portal target="portal-demo-target">
										<Text variant="caption" tone="muted">
											Portaled text
										</Text>
									</Portal>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-overlays-modal",
		slug: ["ui", "overlays", "modal"],
		title: "UI Overlays: Modal",
		description: "Modals + hooks",
		groups: [
			{
				id: "modals",
				title: "Modals",
				description: "Portals, modals, hooks",
				items: [
					{
						id: "use-modal",
						kind: "component",
						name: "useModal",
						label: "Open modal",
						related: relatedMap.useModal,
						Render() {
							const { openModal, closeAll } = useModal();

							return (
								<div className="flex flex-wrap gap-2">
									<Button
										size="sm"
										variant="primary"
										onClick={() =>
											openModal(
												({ close }) => (
													<>
														<ModalHeader
															leadingIcon={<Icon name="cards" size="sm" />}
														>
															<ModalTitle>Modal content</ModalTitle>
														</ModalHeader>
														<ModalContent>
															<Text variant="body" tone="muted">
																Opened via useModal.
															</Text>
														</ModalContent>
														<ModalFooter>
															<Button onClick={close}>Close</Button>
														</ModalFooter>
													</>
												),
												{ ariaLabel: "Modal content" },
											)
										}
									>
										Open modal
									</Button>
									<Button size="sm" variant="ghost" onClick={closeAll}>
										Close all
									</Button>
								</div>
							);
						},
					},
					{
						id: "use-confirmation-modal",
						kind: "component",
						name: "useConfirmationModal",
						label: "Confirmation dialog",
						related: relatedMap.useConfirmationModal,
						Render() {
							const { openConfirmation } = useConfirmationModal();

							return (
								<Button
									size="sm"
									variant="secondary"
									onClick={() =>
										openConfirmation({
											title: "Delete item?",
											description: "This cannot be undone.",
											confirmLabel: "Delete",
											onConfirm: async () => {
												await new Promise((resolve) =>
													setTimeout(resolve, 400),
												);
												showToast.success("Deleted (stub).", {
													title: "Done",
												});
											},
										})
									}
								>
									Open confirmation
								</Button>
							);
						},
					},
					{
						id: "use-image-inspect-modal",
						kind: "component",
						name: "useImageInspectModal",
						label: "Image inspect modal",
						related: relatedMap.useImageInspectModal,
						Render() {
							const { openImageInspect } = useImageInspectModal();

							return (
								<Button
									size="sm"
									variant="secondary"
									onClick={() =>
										openImageInspect({
											src: "/test/blob.png",
											alt: "Preview",
											// onShare: async () => showToast.info("Share clicked"),
										})
									}
								>
									Open image inspect
								</Button>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-overlays-toast",
		slug: ["ui", "overlays", "toast"],
		title: "UI Overlays: Toast",
		description: "Toast actions",
		groups: [
			{
				id: "toasts",
				title: "Toasts",
				description: "Toast actions",
				items: [
					{
						id: "toast-host",
						kind: "component",
						name: "ToastHost",
						label: "Toast actions",
						related: relatedMap.ToastHost,
						Render() {
							return (
								<div className="flex flex-wrap gap-2">
									<Button
										size="sm"
										variant="secondary"
										onClick={() =>
											showToast.success("Settings saved.", {
												title: "Success",
											})
										}
									>
										Show success
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() =>
											showToast.error("Upload failed.", {
												title: "Failed",
											})
										}
									>
										Show error
									</Button>
									<Button
										size="sm"
										variant="ghost"
										onClick={() =>
											showToast.info("Sync will continue in the background.", {
												title: "Info",
											})
										}
									>
										Show info
									</Button>
								</div>
							);
						},
					},
					{
						id: "show-toast-combination",
						kind: "component",
						name: "showToast",
						label: "Promise + stacked actions",
						related: relatedMap.showToast,
						Render() {
							const runPromiseToast = () =>
								showToast.promise(
									new Promise((resolve) =>
										setTimeout(() => resolve("Saved"), 900),
									),
									{
										loading: "Saving changes...",
										success: "Changes saved.",
										error: "Save failed.",
									},
									{
										loadingTitle: "Request",
										successTitle: "Success",
										errorTitle: "Error",
									},
								);

							const runStackedToasts = () => {
								showToast.info("Queued upload started.", {
									title: "Pipeline",
								});
								setTimeout(() => {
									showToast.success("Upload finished.", {
										title: "Pipeline",
									});
								}, 450);
							};

							return (
								<div className="flex flex-wrap gap-2">
									<Button size="sm" onClick={runPromiseToast}>
										Promise toast
									</Button>
									<Button
										size="sm"
										variant="secondary"
										onClick={runStackedToasts}
									>
										Stacked toasts
									</Button>
								</div>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "ui-time",
		slug: ["ui", "time"],
		title: "UI Time",
		description: "Date helpers",
		groups: [
			{
				id: "time",
				title: "Time",
				description: "Date helpers",
				items: [
					{
						id: "date-ago",
						kind: "component",
						name: "DateAgo",
						label: "Relative time",
						related: relatedMap.DateAgo,
						Render() {
							return <DateAgo date={new Date(Date.now() - 1000 * 60 * 90)} />;
						},
					},
					{
						id: "date-indicator",
						kind: "component",
						name: "DateIndicator",
						label: "Formatted date",
						related: relatedMap.DateIndicator,
						Render() {
							return <DateIndicator />;
						},
					},
				],
			},
		],
	},
	{
		id: "ui-foundations",
		slug: ["ui", "foundations"],
		title: "UI Foundations",
		description: "Utilities and providers",
		groups: [
			{
				id: "foundations",
				title: "Foundations",
				description: "Utilities and providers",
				items: [
					{
						id: "appearance-setting",
						kind: "component",
						name: "Appearance setting",
						label: "Atomic application appearance",
						related: relatedMap.SettingsProvider,
						Render: AppearanceSettingsDemo,
					},
				],
			},
		],
	},
	{
		id: "test",
		slug: ["test"],
		title: "Test",
		description: "Playground pages for primitive experiments",
		visibility: "dev-only",
		groups: [
			{
				id: "section-background",
				title: "Section Background",
				description: "Compound background slot experiments",
				columns: "grid-cols-1",
				items: [
					{
						id: "section-background-image",
						kind: "component",
						name: "Section.Background",
						label: "Image background",
						related: relatedMap.Section,
						Render() {
							return (
								<Panel
									background="transparent"
									border="subtle"
									overflow="hidden"
									padding="none"
									radius="lg"
									shadow="none"
								>
									<Section
										padding="soft"
										background="surface"
										className="min-h-[240px]"
										innerClassName="flex h-full flex-col justify-between gap-6"
									>
										<Section.Background className="opacity-70">
											<Image
												src="/test/blob.png"
												alt=""
												fill
												className="object-cover"
												aria-hidden={true}
											/>
											<div className="absolute inset-0 bg-linear-to-br from-background/90 via-background/45 to-transparent" />
										</Section.Background>
										<div className="flex max-w-lg flex-col gap-2">
											<Text as="h3" variant="headingMd">
												Full-bleed media behind bounded content
											</Text>
											<Text variant="body" tone="muted">
												The background spans the full section while the copy
												stays inside the normal max-width wrapper.
											</Text>
										</div>
										<div className="flex flex-wrap gap-2">
											<Button variant="primary" size="sm">
												Primary action
											</Button>
											<Button variant="secondary" size="sm">
												Secondary
											</Button>
										</div>
									</Section>
								</Panel>
							);
						},
					},
					{
						id: "section-background-pattern",
						kind: "component",
						name: "Section.Background",
						label: "Decorative gradient + pattern",
						related: relatedMap.Section,
						Render() {
							return (
								<Panel
									background="transparent"
									border="subtle"
									overflow="hidden"
									padding="none"
									radius="lg"
									shadow="none"
								>
									<Section
										padding="soft"
										background="foreground"
										className="min-h-[240px] text-background"
										innerClassName="flex h-full flex-col justify-between gap-6"
										maxWidth="wide"
									>
										<Section.Background className="opacity-80">
											<div className="h-full w-full bg-linear-to-br from-primary/30 via-transparent to-background/10" />
											<div className="absolute -left-10 top-6 h-40 w-40 rounded-full bg-white/10 blur-3xl" />
											<div className="absolute right-8 top-8 h-24 w-24 rounded-full border border-white/20" />
											<div className="absolute inset-x-0 bottom-0 h-20 bg-[radial-gradient(circle_at_top,rgba(255,255,255,0.18),transparent_55%)]" />
										</Section.Background>
										<div className="flex max-w-xl flex-col gap-3">
											<Text
												as="h3"
												variant="headingMd"
												className="text-background"
											>
												Node backgrounds are not limited to images
											</Text>
											<Text variant="body" className="text-background/80">
												Patterns, gradients, ambient shapes, and layered media
												can live behind the section without changing foreground
												layout.
											</Text>
										</div>
										<Panel
											border="subtle"
											display="flex"
											padding="sm"
											gap="sm"
											shadow="none"
											background="transparent"
											className="max-w-md !border-white/15 text-background"
										>
											<Text variant="bodyStrong" className="text-background">
												Same foreground structure
											</Text>
											<Text variant="caption" className="text-background/80">
												The section API still controls spacing and width.
											</Text>
										</Panel>
									</Section>
								</Panel>
							);
						},
					},
					{
						id: "section-background-interactive",
						kind: "component",
						name: "Section.Background",
						label: "Interactive opt-in background",
						related: relatedMap.Section,
						Render() {
							const [taps, setTaps] = useState(0);

							return (
								<Panel
									background="transparent"
									border="subtle"
									overflow="hidden"
									padding="none"
									radius="lg"
									shadow="none"
								>
									<Section
										padding="soft"
										background="surface"
										className="min-h-[240px]"
										innerClassName="flex h-full flex-col gap-4"
									>
										<Section.Background interactive>
											<div className="h-full w-full bg-linear-to-br from-primary/10 via-transparent to-foreground/5" />
											<Button
												size="sm"
												variant="secondary"
												className="absolute bottom-4 right-4"
												onClick={() => setTaps((value) => value + 1)}
											>
												Background action
											</Button>
										</Section.Background>
										<div className="flex max-w-md flex-col gap-2">
											<Text as="h3" variant="headingMd">
												Interactive backgrounds stay opt-in
											</Text>
											<Text variant="body" tone="muted">
												By default the background is decorative and ignores
												pointer events. Set <code>interactive</code> only when
												the background needs real controls.
											</Text>
										</div>
										<Panel
											border="subtle"
											display="flex"
											padding="sm"
											gap="sm"
											shadow="none"
											className="max-w-md"
										>
											<Text variant="bodyStrong">
												Interactive background taps
											</Text>
											<Text variant="caption" tone="muted">
												{taps} tap{taps === 1 ? "" : "s"} registered from the
												background action.
											</Text>
										</Panel>
									</Section>
								</Panel>
							);
						},
					},
				],
			},
		],
	},
	{
		id: "lib-api",
		slug: ["lib", "api"],
		title: "Lib API",
		description: "Transport helpers, mocks, and endpoint wrappers",
		groups: [
			{
				id: "api",
				title: "API",
				description: "Project and external API helpers",
				items: [
					{
						id: "api-client-demo",
						kind: "component",
						name: "API client",
						label: "Mocked transport with real wrapper",
						related: relatedMap.createApiClient,
						Render() {
							const [status, setStatus] = useState<
								"idle" | "loading" | "success" | "error"
							>("idle");
							const [message, setMessage] = useState(
								"Run the health check against a mocked transport.",
							);

							const runCheck = async (
								requester: typeof mockHealthSuccessClient.request,
							) => {
								setStatus("loading");
								setMessage("Request in flight...");

								try {
									const payload = await checkHealth(requester);
									setStatus("success");
									setMessage(payload.message);
								} catch (error) {
									const apiError = error as ApiError;
									setStatus("error");
									setMessage(apiError.payload?.message ?? apiError.message);
								}
							};

							return (
								<div className="flex flex-col gap-3">
									<div className="flex flex-wrap gap-2">
										<Button
											size="sm"
											onClick={() => runCheck(mockHealthSuccessClient.request)}
										>
											Mock success
										</Button>
										<Button
											size="sm"
											variant="secondary"
											onClick={() => runCheck(mockHealthErrorClient.request)}
										>
											Mock error
										</Button>
									</div>

									<Panel
										padding="sm"
										shadow="none"
										className="border border-border/15"
									>
										<div className="flex flex-col gap-2">
											{status === "loading" ? (
												<div className="flex items-center gap-2">
													<Loader />
													<Text variant="body" tone="muted">
														Request in flight...
													</Text>
												</div>
											) : (
												<Text
													variant="body"
													className={
														status === "error" ? "text-danger" : undefined
													}
												>
													{message}
												</Text>
											)}
											<Text variant="caption" tone="muted">
												Uses <code>checkHealth</code> with{" "}
												<code>
													{"createApiClient({ fetcher: createMockFetch(...) })"}
												</code>
												.
											</Text>
										</div>
									</Panel>
								</div>
							);
						},
					},
				],
			},
		],
	},
];

export function getVisibleDemoPages() {
	const isProduction = process.env.NODE_ENV === "production";

	return demoPages.filter(
		(page) => page.visibility !== "dev-only" || !isProduction,
	);
}
