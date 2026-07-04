"use client";

import Image from "next/image";
import { type JSX, type Ref, useRef, useState } from "react";
import Logo from "@/components/branding/Logo";
import { MarkdownRenderer } from "@/components/composites/markdown";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { useIconRegistry } from "@/components/ui/icons/iconRegistry";
import { ComboboxMultiSelectInput } from "@/components/ui/input/ComboboxMultiSelectInput";
import { ComboboxTextInput } from "@/components/ui/input/ComboboxTextInput";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import {
	ChoiceIndicatorMulti,
	ChoiceIndicatorRadio,
	ChoiceIndicatorToggle,
} from "@/components/ui/input/choice/ChoiceIndicators";
import { DateRangeInput } from "@/components/ui/input/DateRangeInput";
import { EditableTextInput } from "@/components/ui/input/EditableTextInput";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { FileUploadInput } from "@/components/ui/input/files/FileUploadInput";
import { MultiselectInput } from "@/components/ui/input/MultiselectInput";
import { NumberInput } from "@/components/ui/input/NumberInput";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { PhoneInput } from "@/components/ui/input/PhoneInput";
import { ProfilePictureInput } from "@/components/ui/input/ProfilePictureInput";
import { RadioInput } from "@/components/ui/input/RadioInput";
import { SelectInput } from "@/components/ui/input/SelectInput";
import {
	SignaturePad,
	type SignaturePadHandle,
} from "@/components/ui/input/SignaturePad";
import { SliderInput } from "@/components/ui/input/SliderInput";
import { TextAreaInput } from "@/components/ui/input/TextAreaInput";
import { TextInput } from "@/components/ui/input/TextInput";
import { ToggleInput } from "@/components/ui/input/ToggleInput";
import { UnitNumberInput } from "@/components/ui/input/UnitNumberInput";
import { Accordion } from "@/components/ui/misc/Accordion";
import { Chip } from "@/components/ui/misc/Chip";
import { CopyField } from "@/components/ui/misc/CopyField";
import { FileGallery } from "@/components/ui/misc/FileGallery";
import {
	FilePreview,
	type FilePreviewItem,
} from "@/components/ui/misc/FilePreview";
import { HealthCheckIndicator } from "@/components/ui/misc/HealthCheckIndicator";
import {
	ImageSwitcher,
	type ImageSwitcherImage,
} from "@/components/ui/misc/ImageSwitcher";
import { InspectableImage } from "@/components/ui/misc/InspectableImage";
import { Loader } from "@/components/ui/misc/Loader";
import { MoreMenuDropdown } from "@/components/ui/misc/MoreMenuDropdown";
import { PaginationControls } from "@/components/ui/misc/PaginationControls";
import { Pill } from "@/components/ui/misc/Pill";
import { ProfilePicture } from "@/components/ui/misc/ProfilePicture";
import { ScrollBorders } from "@/components/ui/misc/ScrollBorders";
import { SegmentedControl } from "@/components/ui/misc/SegmentedControl";
import { Skeleton } from "@/components/ui/misc/Skeleton";
import { SuspenseBoundary } from "@/components/ui/misc/SuspenseBoundary";
import { ErrorState } from "@/components/ui/misc/state/ErrorState";
import { IdleState } from "@/components/ui/misc/state/IdleState";
import { StateIndicator } from "@/components/ui/misc/state/State";
import { Tooltip } from "@/components/ui/misc/Tooltip";
import { Warning } from "@/components/ui/misc/Warning";
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
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import { useImageInspectModal } from "@/components/ui/overlays/modal/useImageInspectModal";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import Portal from "@/components/ui/overlays/Portal";
import { Button } from "@/components/ui/primitives/Button";
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
import {
	type ApiError,
	checkHealth,
	createApiClient,
	createMockFetch,
} from "@/lib/api";
import { showToast } from "@/lib/feedback";

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

export type DemoUsageItem = DemoItemBase & {
	kind: "usage";
	snippet: string;
};

export type DemoItem = DemoComponentItem | DemoUsageItem;

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
	"This renderer maps plain markdown onto the template design system and supports [internal links](/internal/demo), [external links](https://example.com), **strong copy**, _emphasis_, ~~deleted text~~, and `inlineCode`.",
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
	'  variant?: "primary" | "outline";',
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
	'Raw HTML remains escaped text: <script>alert("blocked")</script>',
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
					<button
						key={item.title}
						type="button"
						className="rounded-lg border border-border bg-surface p-3 text-left transition-colors motion-interactive data-[active=true]:border-primary/40 data-[active=true]:bg-primary/10"
						{...getItemProps(index)}
					>
						<Text variant="bodyStrong">{item.title}</Text>
						<Text variant="caption" tone="muted" className="mt-1 block">
							{item.description}
						</Text>
					</button>
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
			"CopyField",
			"DateRangeInput",
			"Dropdown",
			"ErrorState",
			"HeaderCompact",
			"Loader",
			"MoreMenuDropdown",
			"PasswordInput",
			"PhoneInput",
			"ProfilePictureInput",
			"SegmentedControl",
			"SelectInput",
			"StateIndicator",
			"ToastHost",
			"Warning",
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
			"EditableTextInput",
			"Field",
			// "FilePreview",
			"Footer",
			"Listbox",
			"MarkdownRenderer",
			"PhoneInput",
			"ProfilePicture",
			"SegmentedControl",
			"SelectInput",
			"StateIndicator",
			"ToastHost",
			"FileUploadInput",
			"Warning",
		],
	},
	Button: {
		uses: ["Icon", "Loader", "Skeleton", "Text", "focus", "customRegistry"],
		usedIn: [
			"Accordion",
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"ConfirmationModal",
			"CopyField",
			"EditableTextInput",
			"FilePreview",
			"Footer",
			"HeaderCompact",
			"HeaderFull",
			"ImageInspectModal",
			"InspectableImage",
			"Listbox",
			"MarkdownRenderer",
			"MoreMenuDropdown",
			"PasswordInput",
			"PhoneInput",
			"ProfilePictureInput",
			"SegmentedControl",
			"SelectInput",
			"StateIndicator",
			"ToastHost",
			"FileGallery",
		],
	},
	Chip: { uses: ["Icon", "Skeleton", "focus"], usedIn: ["GraphMap"] },
	InputFrame: {
		uses: ["focus"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"DateRangeInput",
			"EditableTextInput",
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
		uses: ["Icon", "Portal"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"DateRangeInput",
			"MoreMenuDropdown",
			"PhoneInput",
			"SelectInput",
		],
	},
	Panel: { uses: [], usedIn: ["ModalShell", "ToastHost"] },
	Divider: { uses: [], usedIn: [] },
	Section: { uses: [], usedIn: [] },
	Field: {
		uses: ["Text"],
		usedIn: [
			"ComboboxMultiSelectInput",
			"ComboboxTextInput",
			"EditableTextInput",
			"EmailInput",
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
			"MoreMenuDropdown",
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
	LetterWave: { uses: ["Text"], usedIn: [] },
	"Reveal.Scramble": { uses: ["motionTiming"], usedIn: [] },
	ScrollHighlightText: { uses: [], usedIn: [] },
	ScrollLag: { uses: [], usedIn: [] },
	ScrollParallax: { uses: [], usedIn: [] },
	ScrollWidth: { uses: ["spring"], usedIn: [] },
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
	EditableTextInput: {
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
		uses: ["Dropdown", "Icon", "InputFrame", "Listbox", "Text", "focus"],
		usedIn: [],
	},
	SignaturePad: { uses: [], usedIn: [] },
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
	FileUploadInput: {
		uses: ["Button", "Field", "InputFrame", "Text"],
		usedIn: [],
	},
	FileGallery: { uses: ["FilePreview", "IdleState"], usedIn: [] },
	Skeleton: { uses: [], usedIn: ["Button", "ProfilePicture", "Text"] },
	SegmentedControl: {
		uses: ["Button", "Icon", "Text", "spring"],
		usedIn: [],
	},
	CopyField: { uses: ["Button", "Icon", "IconSwap", "Text"], usedIn: [] },
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
		uses: ["Button", "Icon", "IconSwap", "Text", "spring"],
		usedIn: [],
	},
	SuspenseBoundary: {
		uses: ["ErrorState", "Loader", "motionTiming"],
		usedIn: [],
	},
	MoreMenuDropdown: {
		uses: ["Button", "Dropdown", "Icon", "Listbox"],
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
	Warning: { uses: ["Icon", "Text"], usedIn: [] },
	HealthCheckIndicator: {
		uses: ["Button", "Loader", "Pill", "Text"],
		usedIn: [],
	},
	Pill: {
		uses: [],
		usedIn: ["FilePreview", "HealthCheckIndicator", "ProfilePicture"],
	},
	ProfilePicture: {
		uses: ["Pill", "Skeleton", "Text"],
		usedIn: ["ProfilePictureInput"],
	},
	FilePreview: {
		uses: [
			"Button",
			"FileInspectModal",
			"InspectableImage",
			"Pill",
			"Text",
			"useConfirmationModal",
			"useModal",
		],
		usedIn: ["FileGallery"],
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
		uses: ["Panel", "Portal"],
		usedIn: ["ModalHost"],
	},
	useImageInspectModal: {
		uses: ["ImageInspectModal", "useModal"],
		usedIn: ["InspectableImage"],
	},
	ModalHost: { uses: ["ModalShell"], usedIn: ["ModalClientMount"] },
	useModal: {
		uses: [],
		usedIn: ["useConfirmationModal", "useImageInspectModal"],
	},
	ImageInspectModal: {
		uses: ["Button", "Loader", "Reveal.Image"],
		usedIn: ["useImageInspectModal"],
	},
	ToastHost: {
		uses: ["Button", "Icon", "IconSwap", "Panel", "Portal", "Text", "spring"],
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
				<Button key={link.href} href={link.href} size="sm" variant="outline">
					{link.label}
				</Button>
			))}
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
		id: "layout",
		slug: ["layout"],
		title: "Layout",
		description: "Shell + navigation structure",
		groups: [
			{
				id: "layout-links",
				title: "Layout Sections",
				description: "Navigate header and footer demos",
				items: [
					{
						id: "layout-links-card",
						kind: "component",
						name: "Layout Links",
						label: "Jump to section",
						Render() {
							return (
								<OverviewLinks
									links={[
										{ href: "/internal/demo/layout/header", label: "Header" },
										{ href: "/internal/demo/layout/footer", label: "Footer" },
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
		id: "layout-header",
		slug: ["layout", "header"],
		title: "Layout: Header",
		description: "Header variants and usage",
		groups: [
			{
				id: "layout-header-usage",
				title: "Header Components",
				description: "Usage-only cards",
				items: [
					{
						id: "header",
						kind: "usage",
						name: "Header",
						label: "Responsive header wrapper",
						snippet: "<Header layout={siteLayout.header} />",
						related: relatedMap.Header,
					},
					{
						id: "header-full",
						kind: "usage",
						name: "HeaderFull",
						label: "Desktop grouped header",
						snippet:
							"<HeaderFull isScrolled={false} layout={siteLayout.header} />",
						related: relatedMap.HeaderFull,
					},
					{
						id: "header-compact",
						kind: "usage",
						name: "HeaderCompact",
						label: "Mobile grouped header",
						snippet:
							"<HeaderCompact isScrolled={false} layout={siteLayout.header} />",
						related: relatedMap.HeaderCompact,
					},
					{
						id: "header-menu-content",
						kind: "usage",
						name: "HeaderMenuContent",
						label: "Grouped menu and search primitives",
						snippet:
							"<HeaderMenuGrid groups={siteLayout.header.menuGroups} columnCount={6} />",
						related: relatedMap.HeaderMenuContent,
					},
					{
						id: "marketing-content-search",
						kind: "usage",
						name: "MarketingContentSearch",
						label: "Marketing route search adapter",
						snippet:
							"<MarketingContentSearch navLinks={siteLayout.header.navLinks} />",
						related: relatedMap.MarketingContentSearch,
					},
					{
						id: "content-search",
						kind: "usage",
						name: "ContentSearch",
						label: "Shared route search",
						snippet:
							'<ContentSearch entries={[{ id: "settings", label: "Settings", href: "/settings" }]} input={{ className: "w-[16rem]", size: "sm" }} />',
						related: relatedMap.ContentSearch,
					},
				],
			},
		],
	},
	{
		id: "layout-footer",
		slug: ["layout", "footer"],
		title: "Layout: Footer",
		description: "Footer shell usage",
		groups: [
			{
				id: "layout-footer-usage",
				title: "Footer",
				description: "Usage-only cards",
				items: [
					{
						id: "footer",
						kind: "usage",
						name: "Footer",
						label: "Footer shell",
						snippet: "<Footer />",
						related: relatedMap.Footer,
					},
				],
			},
		],
	},
	{
		id: "mount",
		slug: ["mount"],
		title: "Mount",
		description: "Client mounts for shared app systems",
		groups: [
			{
				id: "mount-usage",
				title: "Client Mounts",
				description: "Usage-only cards",
				items: [
					{
						id: "modal-client-mount",
						kind: "usage",
						name: "ModalClientMount",
						label: "Mounts modal host",
						snippet: "<ModalClientMount />",
						related: relatedMap.ModalClientMount,
					},
					{
						id: "form-validation-client-mount",
						kind: "usage",
						name: "FormValidationClientMount",
						label: "Disables native form validation UI",
						snippet: "<FormValidationClientMount />",
						related: relatedMap.FormValidationClientMount,
					},
					{
						id: "toast-client-mount",
						kind: "usage",
						name: "ToastClientMount",
						label: "Mounts toast host",
						snippet: "<ToastClientMount />",
						related: relatedMap.ToastClientMount,
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
					"Plain markdown rendered through Text, Button, focus, table, code, image, and list styles.",
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
						id: "markdown-renderer-usage",
						kind: "usage",
						name: "MarkdownRenderer",
						label: "Button directive",
						related: relatedMap.MarkdownRenderer,
						snippet:
							'<MarkdownRenderer markdown={"# Title\\n\\n::button[Open Reference]{href=/internal/reference variant=primary size=md}"} />',
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
						label: "Compact metadata label",
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
										<Button variant="outline">Outline</Button>
										<Button variant="solid">Solid</Button>
										<Button variant="danger">Danger</Button>
										<Button variant="primaryDark">Dark</Button>
										<Button variant="ghost">Ghost</Button>
									</div>
									<div className="flex flex-wrap items-center gap-2">
										<Button size="sm">Small</Button>
										<Button size="md">Medium</Button>
										<Button size="lg">Large</Button>
										<Button size="icon" leadingIcon="plus" aria-label="Add" />
										<Button
											dir="rtl"
											variant="outline"
											trailingIcon={{
												name: "arrow-right",
												mirrorInRtl: true,
											}}
										>
											RTL action
										</Button>
										<Button variant="outline" loading>
											Loading
										</Button>
										<Button variant="outline" disabled>
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
											<Button.Skeleton size="md">Primary</Button.Skeleton>
											<Button.Skeleton size="md">Outline</Button.Skeleton>
											<Button.Skeleton size="md">Solid</Button.Skeleton>
											<Button.Skeleton size="md">Danger</Button.Skeleton>
											<Button.Skeleton size="md">Dark</Button.Skeleton>
											<Button.Skeleton size="md" variant={"ghost"}>
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
						id: "panel",
						kind: "component",
						name: "Panel",
						label: "Card container",
						related: relatedMap.Panel,
						Render() {
							return (
								<div className="flex flex-col gap-2">
									<Panel
										display="flex"
										padding="sm"
										gap="sm"
										shadow="none"
										background="white"
										className="border border-border/10"
									>
										<Text variant="bodyStrong">White panel</Text>
										<Text variant="caption" tone="muted">
											Default surface.
										</Text>
									</Panel>
									<Panel
										display="flex"
										padding="md"
										gap="sm"
										shadow="sm"
										background="surface"
										className="border border-border/10"
									>
										<Text variant="bodyStrong">Surface panel</Text>
										<Text variant="caption" tone="muted">
											Softer background.
										</Text>
									</Panel>
								</div>
							);
						},
					},
					{
						id: "section",
						kind: "usage",
						name: "Section",
						label: "Page section",
						snippet: `<Section padding="default" background="surface">
  <Section.Background>
    <img src="/hero.jpg" alt="" className="h-full w-full object-cover" />
  </Section.Background>
  ...
</Section>`,
						related: relatedMap.Section,
					},
					{
						id: "divider",
						kind: "component",
						name: "Divider",
						label: "Content separator",
						related: relatedMap.Divider,
						Render() {
							return <Divider />;
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
													variant="outline"
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
													variant="outline"
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
					{
						id: "dropdown-styles",
						kind: "usage",
						name: "dropdownStyles",
						label: "Shared listbox styles",
						snippet:
							"import { dropdownListClassName } from '@/components/ui/primitives/dropdownStyles'",
						related: relatedMap.dropdownStyles,
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
										variant="outline"
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
											<div
												key={name}
												className="flex items-center gap-3 rounded-xl border border-border/10 bg-background/60 px-3 py-2"
											>
												<Icon name={name as IconName} size="md" />
												<span className="text-[11px] font-medium text-foreground/70">
													{name}
												</span>
											</div>
										))}
									</div>
									<div className="flex flex-wrap gap-2">
										<div className="flex items-center gap-3 rounded-xl border border-border/10 bg-background/60 px-3 py-2">
											<Icon name="arrow-right" size="md" mirrorInRtl />
											<span className="text-[11px] font-medium text-foreground/70">
												LTR mirrored icon
											</span>
										</div>
										<div
											dir="rtl"
											className="flex items-center gap-3 rounded-xl border border-border/10 bg-background/60 px-3 py-2"
										>
											<Icon name="arrow-right" size="md" mirrorInRtl />
											<span className="text-[11px] font-medium text-foreground/70">
												RTL mirrored icon
											</span>
										</div>
									</div>
								</div>
							);
						},
					},
					{
						id: "icon-map",
						kind: "usage",
						name: "customRegistry",
						label: "Icon data map",
						snippet:
							"import { customRegistry } from '@/components/ui/icons/customRegistry'",
						related: relatedMap.customRegistry,
					},
					{
						id: "icon-registry",
						kind: "usage",
						name: "iconRegistry",
						label: "Registry helper",
						snippet:
							"import { registerIcons } from '@/components/ui/icons/iconRegistry'",
						related: relatedMap.iconRegistry,
					},
					{
						id: "phosphor-registry",
						kind: "usage",
						name: "phosphorRegistry",
						label: "Phosphor wiring",
						snippet:
							"import { phosphorRegistry } from '@/components/ui/icons/phosphorRegistry'",
						related: relatedMap.phosphorRegistry,
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
						id: "editable-text-input",
						kind: "component",
						name: "EditableTextInput",
						label: "Inline edit",
						related: relatedMap.EditableTextInput,
						Render() {
							const [title, setTitle] = useState("Template dashboard");

							return (
								<div className="flex max-w-sm flex-col items-start gap-3">
									<EditableTextInput
										value={title}
										onSubmit={async (nextTitle) => setTitle(nextTitle)}
										validate={(nextTitle) =>
											nextTitle ? null : "Enter a title."
										}
										ariaLabel={`Rename ${title}`}
										editAriaLabel="Title"
										submitAriaLabel="Save title"
										cancelAriaLabel="Cancel rename"
										displayButtonVariant="ghost"
										displayTextVariant="body"
										displayTextTone="muted"
										displayTrailingIcon="pencil"
										displayClassName="min-w-0 max-w-full"
										displayContentClassName="min-w-0 max-w-full"
										displayTextClassName="truncate"
										formClassName="w-full"
										fieldClassName="gap-1"
										frameClassName="bg-background! shadow-none"
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
								<div className="flex max-w-sm flex-col gap-2">
									<ProfilePictureInput
										label="Profile picture"
										description="JPG, PNG, or WebP up to 25 MB."
										name="Ada Lovelace"
										onChange={(file) => setSelectedFileName(file?.name ?? null)}
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
						id: "profile-picture-input-usage",
						kind: "usage",
						name: "ProfilePictureInput",
						label: "Usage",
						related: relatedMap.ProfilePictureInput,
						snippet: `<ProfilePictureInput
  name={user.name}
  currentUrl={user.profilePictureUrl}
  onChange={(file) => setProfilePictureFile(file)}
/>`,
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
							const [resetSignal, setResetSignal] = useState(0);

							return (
								<div className="flex flex-col gap-2">
									<DateRangeInput onChange={() => {}} />
									<div className="flex flex-wrap items-center gap-2">
										<DateRangeInput
											resetSignal={resetSignal}
											resetTo="last_7_days"
											onChange={() => {}}
										/>
										<Button
											size="sm"
											variant="outline"
											onClick={() => setResetSignal((value) => value + 1)}
										>
											Reset to last 7 days
										</Button>
									</div>
								</div>
							);
						},
					},
					{
						id: "signature-pad",
						kind: "component",
						name: "SignaturePad",
						label: "Canvas signature",
						related: relatedMap.SignaturePad,
						Render() {
							const signatureRef = useRef<SignaturePadHandle>(null);

							return (
								<div className="flex w-full flex-col gap-2">
									<SignaturePad
										ref={signatureRef}
										className="h-24 w-full rounded-lg border border-border/15"
									/>
									<Button
										variant="outline"
										size="sm"
										onClick={() => signatureRef.current?.clear()}
									>
										Clear
									</Button>
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
					{
						id: "editable-text-input-usage",
						kind: "usage",
						name: "EditableTextInput",
						label: "Optimistic title edit",
						related: relatedMap.EditableTextInput,
						snippet:
							'<EditableTextInput value={title} onSubmit={saveTitle} ariaLabel="Rename dashboard" displayButtonVariant="ghost" displayTrailingIcon="pencil" />',
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
						id: "thin-start-choice-usage",
						kind: "usage",
						name: "Choice inputs",
						label: "Thin-start usage",
						related: relatedMap.RadioInput,
						snippet:
							'const options = [{ value: "fast", label: "Fast" }, { value: "steady", label: "Steady" }];\\n\\n<RadioInput label="Mode" options={options} value={mode} onChange={setMode} />\\n<MultiselectInput label="Channels" options={options} value={channels} onChange={setChannels} />\\n<ToggleInput label="Preferences" options={options} value={preferences} onChange={setPreferences} />',
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
						id: "file-upload-input",
						kind: "component",
						name: "FileUploadInput",
						label: "File picker",
						related: relatedMap.FileUploadInput,
						Render() {
							const [files, setFiles] = useState<File[]>([]);

							return (
								<div className="flex w-full flex-col gap-2">
									<FileUploadInput
										files={files}
										onFilesChange={setFiles}
										label="Attachments"
										description="Select images or PDFs for this workflow."
										dropTitle="Drop signed files here"
										dropDescription="PDFs and images appear below before they are saved."
										pendingFilesLabel={(count) =>
											`${count} ready ${count === 1 ? "file" : "files"}`
										}
									/>
								</div>
							);
						},
					},
					{
						id: "file-gallery",
						kind: "component",
						name: "FileGallery",
						label: "File gallery",
						related: relatedMap.FileGallery,
						Render() {
							const [urls, setUrls] = useState([
								"/test/mercury.png",
								"https://example.com/report.pdf",
							]);

							return (
								<FileGallery
									uploadedUrls={urls}
									labels={{
										uploaded: "Saved",
										removeTitle: "Remove attachment",
										removeConfirmLabel: "Remove attachment",
									}}
									onRemoveUploaded={(url) =>
										setUrls((current) => current.filter((item) => item !== url))
									}
								/>
							);
						},
					},
					{
						id: "file-preview",
						kind: "component",
						name: "FilePreview",
						label: "Preview cards",
						related: relatedMap.FilePreview,
						Render() {
							const [files, setFiles] = useState<FilePreviewItem[]>([
								{
									key: "img-1",
									status: "uploaded",
									url: "/test/mercury.png",
									name: "mercury.png",
								},
								{
									key: "pending-1",
									status: "pending",
									type: "image/png",
									url: "/test/blob.png",
									name: "blob.png",
								},
							]);

							return (
								<div className="flex flex-wrap gap-2">
									{files.map((file, index) => (
										<FilePreview
											key={file.key}
											item={file}
											index={index}
											urlLooksLikeImage={(url) => url.endsWith(".png")}
											isDisabled={false}
											onRemovePending={(url) =>
												setFiles((prev) => prev.filter((f) => f.url !== url))
											}
											onRemoveUploaded={(url) =>
												setFiles((prev) => prev.filter((f) => f.url !== url))
											}
										/>
									))}
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
							return (
								<div className="flex flex-col gap-2">
									<Accordion title="Accordion title">
										This is accordion body content.
									</Accordion>
									<Accordion title="Open by default" defaultOpen>
										Default open content.
									</Accordion>
									<Accordion title="Disabled" disabled>
										Disabled content.
									</Accordion>
								</div>
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
						id: "more-menu-dropdown",
						kind: "component",
						name: "MoreMenuDropdown",
						label: "Overflow menu",
						related: relatedMap.MoreMenuDropdown,
						Render() {
							return (
								<MoreMenuDropdown
									options={[
										{ label: "Edit", href: "/" },
										{ label: "Duplicate", onClick: () => {} },
										{ label: "Archive", onClick: () => {} },
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
						id: "pagination-controls-usage",
						kind: "usage",
						name: "PaginationControls",
						label: "Usage",
						snippet: `<PaginationControls
  current={page}
  total={totalPages}
  onPrev={() => setPage((value) => Math.max(1, value - 1))}
  onNext={() => setPage((value) => Math.min(totalPages, value + 1))}
  disablePrev={page <= 1}
  disableNext={page >= totalPages}
/>`,
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
						id: "image-switcher-usage",
						kind: "usage",
						name: "ImageSwitcher",
						label: "Usage",
						snippet: `<ImageSwitcher
  images={[
    { src: "/test/mercury.png", alt: "Mercury-like abstract surface" },
    { src: "/test/blob.png", alt: "Soft abstract blob" },
  ]}
  frameClassName="h-64 max-w-xl"
  controlsClassName="justify-center"
  sizes="(min-width: 768px) 36rem, 100vw"
/>`,
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
											<div
												key={`scroll-borders-demo-${sectionNumber}`}
												className="rounded-md border border-border/10 bg-background px-3 py-2"
											>
												<Text as="p" variant="bodyStrong">
													Section {sectionNumber}
												</Text>
												<Text as="p" variant="body" tone="muted">
													Keep longer scroll regions readable without inventing
													page-local chrome.
												</Text>
											</div>
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
												<div
													key={`scroll-borders-skeleton-${sectionNumber}`}
													className="rounded-md border border-border/10 bg-background px-3 py-2"
												>
													<Text.Skeleton as="p" variant="bodyStrong">
														Section {sectionNumber}
													</Text.Skeleton>
													<Text.Skeleton as="p" variant="body">
														Keep longer scroll regions readable without
														inventing page-local chrome.
													</Text.Skeleton>
												</div>
											))}
										</div>
									</ScrollBorders.Skeleton>
								);
							},
						},
					},
					{
						id: "scroll-borders-usage",
						kind: "usage",
						name: "ScrollBorders",
						label: "Usage",
						related: relatedMap.ScrollBorders,
						snippet: `<ScrollBorders className="h-40 overflow-y-auto rounded-lg bg-surface px-4 py-3">
  <div className="flex flex-col gap-3">{children}</div>
</ScrollBorders>`,
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
									<Button size="sm" variant="outline">
										Library tip
									</Button>
								</Tooltip>
							);
						},
					},
					{
						id: "tooltip-usage",
						kind: "usage",
						name: "Tooltip",
						label: "Usage",
						snippet: `<Tooltip content="Search the shared component library.">
  <Button size="sm" variant="outline">Library tip</Button>
</Tooltip>`,
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
						id: "warning",
						kind: "component",
						name: "Warning",
						label: "Inline warning",
						related: relatedMap.Warning,
						Render() {
							return <Warning message="Heads up: warning helper." />;
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
						id: "health-check-indicator-usage",
						kind: "usage",
						name: "HealthCheckIndicator",
						label: "Usage",
						related: relatedMap.HealthCheckIndicator,
						snippet: `<HealthCheckIndicator label="Supabase" endpoint="/api/health" />`,
					},
					{
						id: "profile-picture",
						kind: "component",
						name: "ProfilePicture",
						label: "Avatar display",
						related: relatedMap.ProfilePicture,
						Render() {
							return (
								<div className="flex flex-wrap items-center gap-3">
									<ProfilePicture name="Ada Lovelace" size="sm" />
									<ProfilePicture name="Grace Hopper" />
									<ProfilePicture name="Unknown user" />
									<ProfilePicture size="lg" />
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
									</div>
								);
							},
						},
					},
					{
						id: "profile-picture-usage",
						kind: "usage",
						name: "ProfilePicture",
						label: "Usage",
						related: relatedMap.ProfilePicture,
						snippet: `<ProfilePicture
  name={user.name}
  src={user.profilePictureUrl}
  size="md"
/>`,
					},
					{
						id: "pill",
						kind: "component",
						name: "Pill",
						label: "Status badge",
						related: relatedMap.Pill,
						Render() {
							return (
								<div className="flex flex-wrap gap-2">
									<Pill tone="plain" className="px-3 py-1 text-xs">
										Plain
									</Pill>
									<Pill tone="neutral" className="px-3 py-1 text-xs">
										Neutral
									</Pill>
									<Pill tone="primary" className="px-3 py-1 text-xs">
										Primary
									</Pill>
									<Pill tone="success" className="px-3 py-1 text-xs">
										Success
									</Pill>
									<Pill tone="warning" className="px-3 py-1 text-xs">
										Warning
									</Pill>
									<Pill tone="danger" className="px-3 py-1 text-xs">
										Danger
									</Pill>
									<Pill
										tone="helper"
										helperIndex={3}
										className="px-3 py-1 text-xs"
									>
										Helper
									</Pill>
								</div>
							);
						},
					},
					{
						id: "pill-usage",
						kind: "usage",
						name: "Pill",
						label: "Usage",
						related: relatedMap.Pill,
						snippet: `<Pill tone="success" className="px-3 py-1 text-xs">Operational</Pill>`,
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
											variant="outline"
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
												<div className="rounded-lg border border-border/10 bg-surface px-4 py-4">
													<div className="flex flex-col gap-3">
														<Text as="h3" variant="headingSm">
															Share report
														</Text>
														<Text variant="body" tone="muted">
															Copy this link and send it to your team.
														</Text>
														<CopyField value="https://example.com/reports/q1-summary" />
														<div className="flex justify-end">
															<Button variant="primary">Continue</Button>
														</div>
													</div>
												</div>
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
												fallback={
													<div className="rounded-lg border border-border/10 bg-surface px-4 py-4">
														<div className="flex flex-col gap-3">
															<Text.Skeleton as="h3" variant="headingSm">
																Share report
															</Text.Skeleton>
															<Text.Skeleton variant="body">
																Copy this link and send it to your team.
															</Text.Skeleton>
															<CopyField.Skeleton placeholder="https://example.com/reports/q1-summary" />
															<div className="flex justify-end">
																<Button.Skeleton variant="primary">
																	Continue
																</Button.Skeleton>
															</div>
														</div>
													</div>
												}
											>
												<div className="rounded-lg border border-border/10 bg-surface px-4 py-4">
													<div className="flex flex-col gap-3">
														<Text as="h3" variant="headingSm">
															Share report
														</Text>
														<Text variant="body" tone="muted">
															Copy this link and send it to your team.
														</Text>
														<CopyField value="https://example.com/reports/q1-summary" />
														<div className="flex justify-end">
															<Button variant="primary">Continue</Button>
														</div>
													</div>
												</div>
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
								<InspectableImage
									src="/test/blob.png"
									alt="Preview"
									width={120}
									height={80}
									className="rounded-lg overflow-hidden border border-border/10"
								/>
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
								<StateIndicator
									title="Offline"
									description="Check your connection"
									iconName="warning"
								/>
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
								<div className="grid gap-3 md:grid-cols-2">
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Default: ignores image load
										</Text>
										<Reveal.Image
											src="/test/blob.png"
											alt="Abstract blob"
											fill
											useViewport={false}
											className="w-full"
											contentClassName="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/10 bg-surface"
											imageClassName="object-cover"
										/>
									</div>
									<div className="flex flex-col gap-2">
										<Text variant="caption" tone="muted">
											Opt-in: waits for image load
										</Text>
										<Reveal.Image
											src="/test/mercury.png"
											alt="Mercury-like abstract surface"
											fill
											useViewport={false}
											loadStrategy="wait-for-load"
											placeholder="blur"
											blurDataURL={imageSwitcherDemoImages[0].blurDataURL}
											className="w-full"
											contentClassName="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/10 bg-surface"
											imageClassName="object-cover"
											fallback={<Skeleton className="h-full w-full" />}
										/>
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
						id: "active-stage-host-usage",
						kind: "usage",
						name: "ActiveStageHost",
						label: "Active stage usage",
						related: relatedMap.ActiveStageHost,
						snippet: `import { ActiveStageHost, useActiveStage } from "@/components/ui/motion/ActiveStageHost";

<ActiveStageHost count={items.length} cycleWhen="inView">
	<YourStageList />
</ActiveStageHost>`,
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
											variant="outline"
											onClick={() => setImageSrc("/test/mercury.png")}
										>
											Mercury
										</Button>
									</div>
									<Reveal.Image
										key={imageSrc}
										src={imageSrc}
										alt="Image-driven reveal"
										fill
										useViewport={false}
										className="w-full"
										contentClassName="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/10 bg-surface"
										imageClassName="object-cover"
										onRevealStateChange={setImageReady}
									/>
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
											variant="outline"
											onClick={() => setImageSrc("/test/mercury.png")}
										>
											Mercury
										</Button>
									</div>
									<MotionScene key={imageSrc}>
										<div className="flex flex-col gap-3">
											<Reveal.Image
												src={imageSrc}
												alt="Motion scene image"
												fill
												useViewport={false}
												loadStrategy="wait-for-load"
												after="app"
												unlock="media"
												className="w-full"
												contentClassName="aspect-[4/3] w-full overflow-hidden rounded-2xl border border-border/10 bg-surface"
												imageClassName="object-cover"
											/>
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
												<Reveal.Item className="rounded-full border border-border/10 bg-surface px-3 py-1">
													<Text variant="caption">Scene</Text>
												</Reveal.Item>
												<Reveal.Item className="rounded-full border border-border/10 bg-surface px-3 py-1">
													<Text variant="caption">Unlocked</Text>
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
						id: "motion-scene-usage",
						kind: "usage",
						name: "MotionScene",
						label: "Staged usage",
						related: relatedMap.MotionScene,
						snippet: `import { Reveal } from "@/components/ui/motion";
import { MotionScene } from "@/components/ui/motion/MotionScene";

<Reveal.Root>
	<MotionScene>
		<Reveal.Image loadStrategy="wait-for-load" after="app" unlock="media" {...imageProps} />
		<Reveal.List after="media" unlock="content">
			<Reveal.Item>...</Reveal.Item>
		</Reveal.List>
		<Reveal.Scramble after="content" text="..." maintainSpace />
	</MotionScene>
</Reveal.Root>`,
					},
					{
						id: "scroll-highlight-text",
						kind: "component",
						name: "ScrollHighlightText",
						label: "Scroll-driven text emphasis",
						related: relatedMap.ScrollHighlightText,
						Render() {
							return (
								<div className="space-y-3">
									<Text variant="body" tone="muted">
										Scroll until the headline enters the viewport.
									</Text>
									<Text variant="headingSm" as="h3">
										<ScrollHighlightText className="text-foreground">
											Clarity arrives as the section lands.
										</ScrollHighlightText>
									</Text>
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
								<ScrollLag className="rounded-lg border border-border/10 bg-surface px-3 py-2">
									<Text variant="bodyStrong">ScrollLag</Text>
								</ScrollLag>
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
													Use it for panels or media where the frame should open
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
								<ScrollParallax
									className="rounded-lg border border-border/10 bg-surface px-3 py-2"
									magnitude={50}
								>
									<Text variant="bodyStrong">Parallax</Text>
								</ScrollParallax>
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
									<div
										id="portal-demo-target"
										className="rounded-lg border border-dashed border-border/20 p-2 text-xs text-muted-foreground"
									>
										Portal target
									</div>
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
											openModal(({ close }) => (
												<div className="flex flex-col gap-3">
													<Text as="h3" variant="headingMd">
														Modal content
													</Text>
													<Text variant="body" tone="muted">
														Opened via useModal.
													</Text>
													<Button onClick={close}>Close</Button>
												</div>
											))
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
									variant="outline"
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
									variant="outline"
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
					{
						id: "modal-shell",
						kind: "usage",
						name: "ModalShell",
						label: "Modal shell",
						snippet: "<ModalShell onClose={close}>...</ModalShell>",
						related: relatedMap.ModalShell,
					},
					{
						id: "modal-host",
						kind: "usage",
						name: "ModalHost",
						label: "Modal host",
						snippet: "<ModalHost />",
						related: relatedMap.ModalHost,
					},
					{
						id: "confirmation-modal",
						kind: "usage",
						name: "ConfirmationModal",
						label: "Modal content",
						snippet: "<ConfirmationModal {...props} />",
						related: relatedMap.ConfirmationModal,
					},
					{
						id: "image-inspect-modal",
						kind: "usage",
						name: "ImageInspectModal",
						label: "Modal content",
						snippet: "<ImageInspectModal {...props} />",
						related: relatedMap.ImageInspectModal,
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
										variant="outline"
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
										variant="outline"
										onClick={runStackedToasts}
									>
										Stacked toasts
									</Button>
								</div>
							);
						},
					},
					{
						id: "show-toast-usage",
						kind: "usage",
						name: "showToast.promise",
						label: "Async toast helper",
						snippet:
							"showToast.success('Saved.', { title: 'Success' })\nawait showToast.promise(savePromise, { loading: 'Saving...', success: 'Saved.', error: 'Failed.' }, { loadingTitle: 'Request', successTitle: 'Success', errorTitle: 'Failed' })",
						related: relatedMap.showToast,
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
						id: "settings-provider",
						kind: "usage",
						name: "SettingsProvider",
						label: "Motion settings provider",
						snippet:
							"<SettingsProvider defaultMotionDisabled={false}>...</SettingsProvider>",
						related: relatedMap.SettingsProvider,
					},
					{
						id: "use-settings-context",
						kind: "usage",
						name: "useSettingsContext",
						label: "Settings hook",
						snippet: "const settings = useSettingsContext()",
						related: relatedMap.useSettingsContext,
					},
					{
						id: "focus",
						kind: "usage",
						name: "focus",
						label: "Focus ring tokens",
						snippet:
							"import { focusRing } from '@/components/ui/foundations/focus'",
						related: relatedMap.focus,
					},
					{
						id: "spring",
						kind: "usage",
						name: "spring",
						label: "Motion springs",
						snippet:
							"import { springs } from '@/components/ui/foundations/spring'",
						related: relatedMap.spring,
					},
					{
						id: "motion-timing",
						kind: "usage",
						name: "motionTiming",
						label: "Timing tokens",
						snippet:
							"import { motionTiming } from '@/components/ui/foundations/motionTiming'",
						related: relatedMap.motionTiming,
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
								<Section
									padding="soft"
									background="surface"
									className="min-h-[240px] rounded-2xl border border-border/15"
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
											The background spans the full section while the copy stays
											inside the normal max-width wrapper.
										</Text>
									</div>
									<div className="flex flex-wrap gap-2">
										<Button variant="primary" size="sm">
											Primary action
										</Button>
										<Button variant="outline" size="sm">
											Secondary
										</Button>
									</div>
								</Section>
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
								<Section
									padding="soft"
									background="foreground"
									className="min-h-[240px] rounded-2xl border border-border/10 text-background"
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
											Patterns, gradients, ambient shapes, and layered media can
											live behind the section without changing foreground
											layout.
										</Text>
									</div>
									<Panel
										display="flex"
										padding="sm"
										gap="sm"
										shadow="none"
										background="transparent"
										className="max-w-md border border-white/15 text-background"
									>
										<Text variant="bodyStrong" className="text-background">
											Same foreground structure
										</Text>
										<Text variant="caption" className="text-background/80">
											The section API still controls spacing and width.
										</Text>
									</Panel>
								</Section>
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
								<Section
									padding="soft"
									background="surface"
									className="min-h-[240px] rounded-2xl border border-border/15"
									innerClassName="flex h-full flex-col gap-4"
								>
									<Section.Background interactive>
										<div className="h-full w-full bg-linear-to-br from-primary/10 via-transparent to-foreground/5" />
										<Button
											size="sm"
											variant="outline"
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
											pointer events. Set <code>interactive</code> only when the
											background needs real controls.
										</Text>
									</div>
									<Panel
										display="flex"
										padding="sm"
										gap="sm"
										shadow="none"
										className="max-w-md border border-border/15"
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
							);
						},
					},
					{
						id: "section-background-usage",
						kind: "usage",
						name: "Section.Background",
						label: "Usage snippet",
						related: relatedMap.Section,
						snippet: `<Section padding="default" background="surface" className="rounded-2xl overflow-hidden">
  <Section.Background className="opacity-70">
    <img src="/hero.jpg" alt="" className="h-full w-full object-cover" />
  </Section.Background>
  <Text as="h2" variant="headingLg">Section content</Text>
</Section>`,
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
											variant="outline"
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
					{
						id: "create-api-client",
						kind: "usage",
						name: "createApiClient",
						label: "Reusable request factory",
						snippet:
							"const api = createApiClient({ baseUrl: process.env.NEXT_PUBLIC_BACKEND_API_URL! })",
						related: relatedMap.createApiClient,
					},
					{
						id: "create-mock-fetch",
						kind: "usage",
						name: "createMockFetch",
						label: "Fake transport for demos and tests",
						snippet:
							"const mockFetch = createMockFetch([{ matcher: '/', method: 'GET', response: { body: { message: 'OK' } } }])",
						related: relatedMap.createMockFetch,
					},
					{
						id: "check-health",
						kind: "usage",
						name: "checkHealth",
						label: "Endpoint wrapper",
						snippet: "const health = await checkHealth(api.request)",
						related: relatedMap.checkHealth,
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
