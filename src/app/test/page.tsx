// app/test/page.tsx
// TODO: Remove this route
"use client";

import Image from "next/image";
import { useState } from "react";
import { useSettingsContext } from "@/components/ui/foundations/settingsContext";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { ComboboxMultiSelectInput } from "@/components/ui/input/ComboboxMultiSelectInput";
import { ComboboxTextInput } from "@/components/ui/input/ComboboxTextInput";
import { DateRangeDropdown } from "@/components/ui/input/DateRangeDropDown";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { MultiselectInput } from "@/components/ui/input/MultiselectInput";
import { NumberInput } from "@/components/ui/input/NumberInput";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { PhoneInput } from "@/components/ui/input/PhoneInput";
import { RadioInput } from "@/components/ui/input/RadioInput";
import { SelectInput } from "@/components/ui/input/SelectInput";
import { TextAreaInput } from "@/components/ui/input/TextAreaInput";
import { TextInput } from "@/components/ui/input/TextInput";
import { ToggleInput } from "@/components/ui/input/ToggleInput";
import { Accordion } from "@/components/ui/misc/Accordion";
import { CopyField } from "@/components/ui/misc/CopyField";
import {
	FilePreview,
	type FilePreviewItem,
} from "@/components/ui/misc/FilePreview";
import { Loader } from "@/components/ui/misc/Loader";
import { MoreMenuDropdown } from "@/components/ui/misc/MoreMenuDropdown";
import { SegmentedControl } from "@/components/ui/misc/SegmentedControl";
import { SuspenseBoundary } from "@/components/ui/misc/SuspenseBoundary";
import { Warning } from "@/components/ui/misc/Warning";
import { RevealGroup, RevealItem } from "@/components/ui/motion/Reveal";
import { ScrollLag } from "@/components/ui/motion/ScrollLag";
import { ScrollParallax } from "@/components/ui/motion/ScrollParallax";
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import { useImageInspectModal } from "@/components/ui/overlays/modal/useImageInspectModal";
import { useModal } from "@/components/ui/overlays/modal/useModal";
import { Button } from "@/components/ui/primitives/Button";
import { Panel } from "@/components/ui/primitives/Panel";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { showToast } from "@/lib/toast";

export default function TestPage() {
	const demoIcons: IconName[] = [
		"arrow-right",
		"arrow-left",
		"chevron",
		"check",
		"close",
		"cross",
		"plus",
		"minus",
		"copy",
		"warning",
		"search",
		"ellipsis",
		"ellipsis-vertical",
		"eye",
		"eye-closed",
		"menu",
		"calendar",
		"bell",
		"spinner",
		"camera",
		"notes",
		"add-image",
		"instagram",
		"linked-in",
		"meta",
		"x",
		"youtube",
	];
	const colorSections = [
		{
			title: "Primary",
			items: [
				{ label: "primary", swatchClassName: "bg-primary" },
				{ label: "primary hover", swatchClassName: "bg-primary-hover" },
				{ label: "primary active", swatchClassName: "bg-primary-active" },
				{
					label: "primary foreground",
					swatchClassName: "bg-primary-foreground",
				},
			],
		},
		{
			title: "Danger",
			items: [
				{ label: "danger", swatchClassName: "bg-danger" },
				{ label: "danger 90", swatchClassName: "bg-danger/90" },
				{ label: "danger 80", swatchClassName: "bg-danger/80" },
			],
		},
		{
			title: "Foreground",
			items: [
				{ label: "foreground", swatchClassName: "bg-foreground" },
				{ label: "foreground hover", swatchClassName: "bg-foreground-hover" },
				{ label: "foreground active", swatchClassName: "bg-foreground-active" },
			],
		},
		{
			title: "Background",
			items: [
				{ label: "background", swatchClassName: "bg-background" },
				{ label: "background hover", swatchClassName: "bg-background-hover" },
				{ label: "background active", swatchClassName: "bg-background-active" },
			],
		},
		{
			title: "Surface & Border",
			items: [
				{ label: "surface", swatchClassName: "bg-surface" },
				{
					label: "border 15",
					swatchClassName: "bg-white border border-border/15",
				},
				{ label: "border /10", swatchClassName: "bg-border/10" },
				{ label: "border /5", swatchClassName: "bg-border/5" },
				{
					label: "border fg/20",
					swatchClassName: "bg-white border border-foreground/20",
				},
				{
					label: "border white/15",
					swatchClassName: "bg-primary border border-white/15",
				},
			],
		},
	] as const;

	const { openModal, closeAll } = useModal();
	const { openConfirmation } = useConfirmationModal();
	const { openImageInspect } = useImageInspectModal();
	const settings = useSettingsContext();
	const motionAllowed = useMotionAllowed(true);
	const motionSetting = settings?.motionDisabled ? "reduced" : "system";
	const [inputValues, setInputValues] = useState({
		name: "",
		email: "",
		password: "",
		bio: "",
		quantity: 1,
		radio: "opt1",
		multiselect: ["opt1"],
		toggles: ["opt2"],
		combobox: "Alpha",
		comboboxMulti: ["alpha"],
		select: "alpha",
		segment: "overview",
		phone: undefined as string | undefined,
	});
	const [files, setFiles] = useState<FilePreviewItem[]>(() => [
		{
			key: "img-1",
			status: "uploaded",
			url: "/test/mercury.png",
		},
		{
			key: "pending-1",
			status: "pending",
			type: "image/png",
			url: "/test/blob.png",
			name: "blob.png",
		},
	]);

	const [contentState, setContentState] = useState<
		"loading" | "error" | "ready"
	>("ready");

	const [shouldCrash, setShouldCrash] = useState(false);

	if (shouldCrash) {
		throw new Error("Crash test from /test page");
	}
	const triggerCrash = () => {
		throw new Error("Crash test from /test page");
	};

	return (
		<Section
			padding="default"
			maxWidth="narrow"
			innerClassName="flex flex-col gap-8 "
		>
			<header className="flex flex-col gap-2">
				<Text as="h1" variant="headingLg">
					UI Testbed
				</Text>
				<Text variant="muted">
					Manual checks for the UI kit. TODO: Swap copy, colors, assets, and
					ranges per project needs.
				</Text>
			</header>

			<Panel columns={1} className="border-black/[0.08]">
				<div className="flex flex-col gap-4">
					<div>
						<Text as="h2" variant="headingMd">
							Color tokens
						</Text>
						<Text variant="muted">Shared UI color tokens.</Text>
					</div>
					<div className="grid gap-4">
						{colorSections.map((section) => (
							<div key={section.title} className="flex flex-col gap-2">
								<Text as="h3" variant="bodyStrong">
									{section.title}
								</Text>
								<div className="grid grid-cols-2 gap-2 sm:grid-cols-3 lg:grid-cols-4">
									{section.items.map((item) => (
										<div
											key={item.label}
											className="flex items-center gap-3 rounded-lg border border-border/15 bg-white px-2 py-2"
										>
											<div
												className={`h-8 w-8 rounded-md border border-border/15 ${item.swatchClassName}`}
											/>
											<Text variant="captionMuted" className="min-w-0 truncate">
												{item.label}
											</Text>
										</div>
									))}
								</div>
							</div>
						))}
					</div>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Primitives
					</Text>
					<Text variant="muted">
						Typography and buttons using shared tokens.
					</Text>
					<div className="flex flex-col gap-1">
						<Text as="h3" variant="headingXl">
							Heading XL
						</Text>
						<Text as="h4" variant="headingMd">
							Heading MD
						</Text>
						<Text variant="body">Body text</Text>
						<Text variant="muted">Muted text</Text>
						<Text variant="captionMuted">Caption muted</Text>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button variant="primary">Primary</Button>
						<Button variant="danger">Danger</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="solid">Solid</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
					<Text variant="muted">Loading states</Text>
					<div className="flex flex-wrap gap-2">
						<Button variant="primary" loading>
							Primary loading
						</Button>
						<Button variant="outline" leadingIcon="arrow-left" loading>
							Outline loading
						</Button>
						<Button variant="solid" trailingIcon="arrow-right" loading>
							Solid loading
						</Button>
						<Button variant="ghost" loading>
							Ghost loading
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Text Inputs
					</Text>
					<Text variant="muted">
						Shared frame + field messaging. Error state uses the same token as
						toasts/warnings.
					</Text>
					<div className="grid gap-3">
						<TextInput
							label="Name"
							placeholder="Your name"
							value={inputValues.name}
							onChange={(name) => setInputValues((s) => ({ ...s, name }))}
						/>
						<TextInput
							label="Name (Small)"
							placeholder="Small size"
							size="sm"
							value={inputValues.name}
							onChange={(name) => setInputValues((s) => ({ ...s, name }))}
						/>
						<TextInput
							label="Name (Large)"
							placeholder="Large size"
							size="lg"
							value={inputValues.name}
							onChange={(name) => setInputValues((s) => ({ ...s, name }))}
						/>
						<EmailInput
							label="Email"
							placeholder="you@example.com"
							value={inputValues.email}
							onChange={(email) => setInputValues((s) => ({ ...s, email }))}
							validate={(val) =>
								val && !val.includes("@") ? "Invalid email (stub)" : null
							}
						/>
						<PasswordInput
							label="Password"
							placeholder="••••••"
							value={inputValues.password}
							onChange={(password) =>
								setInputValues((s) => ({ ...s, password }))
							}
							showStrength
						/>
						<NumberInput
							label="Quantity"
							value={inputValues.quantity}
							onChange={(quantity) =>
								setInputValues((s) => ({ ...s, quantity: quantity ?? 0 }))
							}
							min={0}
							unit="pcs"
						/>
						<TextAreaInput
							label="Bio"
							placeholder="Tell us more..."
							value={inputValues.bio}
							onChange={(bio) => setInputValues((s) => ({ ...s, bio }))}
						/>
					</div>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Icons
					</Text>
					<Text variant="muted">
						Static glyphs rendered via the `Icon` primitive. Adjust the `size`
						variant and swap `name` to test available assets.
					</Text>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-3">
					{demoIcons.map((icon) => (
						<div
							key={icon}
							className="flex items-center gap-2 rounded-xl border border-border/15 bg-surface px-3 py-2"
						>
							<Icon name={icon} size="sm" className="text-primary" />
							<Icon name={icon} size="md" />
							<Icon name={icon} size="lg" className="text-muted-foreground" />
							<Text variant="captionMuted" className="ml-auto">
								{icon}
							</Text>
						</div>
					))}
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Buttons with icons
					</Text>
					<Text variant="muted">
						Icon primitive wired through button props. Mix leading/trailing and
						variant combos.
					</Text>
				</div>
				<div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
					<Button variant="primary" trailingIcon="arrow-right">
						Primary trailing
					</Button>
					<Button variant="outline" leadingIcon="arrow-left">
						Outline leading
					</Button>
					<Button variant="solid" leadingIcon="plus">
						Solid leading
					</Button>
					<Button variant="ghost" trailingIcon="check">
						Ghost trailing
					</Button>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Selection & composite inputs
					</Text>
					<Text variant="muted">
						Choice, combobox, phone, and date range using the shared tokens.
					</Text>
					<div className="grid gap-4">
						<RadioInput
							label="Radio input"
							description="Single selection with the new indicators."
							options={[
								{ value: "opt1", label: "Option 1" },
								{ value: "opt2", label: "Option 2" },
								{ value: "opt3", label: "Option 3", disabled: true },
							]}
							value={inputValues.radio}
							onChange={(radio) => setInputValues((s) => ({ ...s, radio }))}
						/>
						<MultiselectInput
							label="Multiselect input"
							description="Multi-select with checkmark indicator."
							options={[
								{ value: "opt1", label: "Option 1" },
								{ value: "opt2", label: "Option 2" },
								{ value: "opt3", label: "Option 3", disabled: true },
							]}
							value={inputValues.multiselect}
							onChange={(multiselect) =>
								setInputValues((s) => ({ ...s, multiselect }))
							}
						/>
						<ToggleInput
							label="Toggle input"
							description="Switch-style multi-toggle."
							options={[
								{ value: "opt1", label: "Option 1" },
								{ value: "opt2", label: "Option 2" },
								{ value: "opt3", label: "Option 3", disabled: true },
							]}
							value={inputValues.toggles}
							onChange={(toggles) => setInputValues((s) => ({ ...s, toggles }))}
						/>
						<ComboboxTextInput
							label="Combobox"
							placeholder="Pick an option"
							value={inputValues.combobox}
							onChange={(combobox) =>
								setInputValues((s) => ({ ...s, combobox }))
							}
							options={[
								{ id: "a", label: "Alpha" },
								{ id: "b", label: "Beta" },
								{ id: "g", label: "Gamma" },
							]}
						/>
						<SelectInput
							label="Select input"
							description="Type to search; value updates on selection."
							placeholder="Select option"
							value={inputValues.select}
							onChange={(select) => setInputValues((s) => ({ ...s, select }))}
							options={[
								{ value: "alpha", label: "Alpha", symbol: "A" },
								{ value: "beta", label: "Beta", symbol: "B" },
								{ value: "gamma", label: "Gamma", symbol: "G" },
								{ value: "delta", label: "Delta", symbol: "D" },
							]}
						/>
						<ComboboxMultiSelectInput
							label="Combobox multiselect"
							description="Search + pick multiple, backspace removes last."
							placeholder="Search options"
							value={inputValues.comboboxMulti}
							onChange={(comboboxMulti) =>
								setInputValues((s) => ({ ...s, comboboxMulti }))
							}
							// leadingIcon="notes"
							endText={`${inputValues.comboboxMulti.length} selected`}
							options={[
								{ value: "alpha", label: "Alpha", symbol: "A" },
								{ value: "beta", label: "Beta", symbol: "B" },
								{ value: "gamma", label: "Gamma", symbol: "G" },
								{ value: "delta", label: "Delta", symbol: "D" },
								{ value: "epsilon", label: "Epsilon", symbol: "E" },
								{ value: "zeta", label: "Zeta", symbol: "Z" },
								{ value: "eta", label: "Eta", symbol: "H" },
								{ value: "theta", label: "Theta", symbol: "T" },
								{ value: "iota", label: "Iota", symbol: "I" },
								{ value: "kappa", label: "Kappa", symbol: "K" },
							]}
						/>
						<PhoneInput
							label="Phone"
							description="Auto-detects country from dial code."
							value={inputValues.phone}
							onChange={(phone) => setInputValues((s) => ({ ...s, phone }))}
						/>
						<DateRangeDropdown
							onChange={() => {
								/* noop demo */
							}}
						/>
					</div>
				</div>
				<div className="flex items-center justify-center rounded-xl border border-border/15 bg-surface px-4 py-6">
					<Text variant="muted">
						Add more composite inputs here as you build them.
					</Text>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Helpers & feedback
					</Text>
					<Text variant="muted">
						Skeletons, warnings, copy field, and menu dropdown patterns.
					</Text>
				</div>
				<div className="grid gap-4">
					<Warning message="Heads up: this is a warning helper." />
					<CopyField value="https://example.com/referral=123456" />
					<div className="flex items-center gap-3">
						<MoreMenuDropdown
							options={[
								{ label: "Edit", href: "/asd" },
								{ label: "Duplicate", onClick: () => {} },
								{ label: "Archive", onClick: () => {} },
							]}
						/>
						<Text variant="muted">More menu dropdown</Text>
					</div>
					<div className="flex flex-wrap items-center gap-3">
						<Text.Skeleton>Loading text</Text.Skeleton>
						<Button.Skeleton>Loading button</Button.Skeleton>
					</div>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Accordion & segmented control
					</Text>
					<Text variant="muted">
						Library motion patterns using shared spring presets.
					</Text>
				</div>
				<div className="flex flex-col gap-4">
					<SegmentedControl
						options={[
							{ value: "overview", label: "Overview" },
							{ value: "insights", label: "Insights" },
							{ value: "alerts", label: "Alerts" },
						]}
						value={inputValues.segment}
						onChange={(segment) => setInputValues((s) => ({ ...s, segment }))}
					/>
					<Accordion title="Accordion title">
						This is accordion body content. It can be text or custom nodes.
					</Accordion>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Suspense & states
					</Text>
					<Text variant="muted">
						Controlled boundary with the default ErrorState fallback.
					</Text>
					<div className="flex gap-2">
						<Button size="sm" onClick={() => setContentState("loading")}>
							Set loading
						</Button>
						<Button
							size="sm"
							variant="outline"
							onClick={() => setContentState("error")}
						>
							Set error
						</Button>
						<Button
							size="sm"
							variant="ghost"
							onClick={() => setContentState("ready")}
						>
							Set ready
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-4">
					<SuspenseBoundary
						loading={contentState === "loading"}
						error={contentState === "error"}
						fallback={<Loader />}
					>
						<div className="rounded-xl border border-border/15 bg-surface px-4 py-3">
							<Text>Suspense boundary content ready.</Text>
						</div>
					</SuspenseBoundary>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Motion settings
					</Text>
					<Text variant="muted">
						Override reduced motion for this session. System respects OS + data
						saver; reduced motion forces animations off.
					</Text>
					<SegmentedControl
						options={[
							{ value: "system", label: "System" },
							{ value: "reduced", label: "Reduced motion" },
						]}
						value={motionSetting}
						onChange={(next) => settings?.setMotionDisabled(next === "reduced")}
						layout="auto"
					/>
					<Text variant="captionMuted">
						Motion allowed: {motionAllowed ? "Yes" : "No"}
					</Text>
				</div>
				<div className="flex flex-col gap-3">
					<div className="group flex items-center gap-3 rounded-xl border border-border/15 bg-surface px-4 py-3">
						<Icon name="bell" animate className="text-primary" />
						<Text variant="body">
							Hover the bell icon to see the ring animation. It stops when
							reduced motion is on.
						</Text>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button variant="outline">Hover me</Button>
						<Button variant="ghost" trailingIcon="arrow-right">
							Hover me
						</Button>
					</div>
				</div>
			</Panel>

			<Panel columns={2} className="border-black/[0.08]">
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Modal basics
					</Text>
					<Text variant="muted">
						Open a simple modal using the low-level `useModal` helper. The modal
						render function receives a `close` handler.
					</Text>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="primary"
							onClick={() => {
								openModal(({ close }) => (
									<div className="flex flex-col gap-4">
										<Text as="h3" variant="headingMd">
											Custom Modal
										</Text>
										<Text variant="muted">
											This uses the shared ModalHost; nothing is wrapped around
											the page.
										</Text>
										<Button onClick={close}>Close</Button>
									</div>
								));
							}}
						>
							Open basic modal
						</Button>
						<Button variant="ghost" onClick={closeAll}>
							Close all modals
						</Button>
					</div>
				</div>

				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Confirmation modal
					</Text>
					<Text variant="muted">
						Uses the `useConfirmationModal` convenience hook.
					</Text>
					<Button
						variant="outline"
						onClick={() =>
							openConfirmation({
								title: "Delete example item?",
								description: "This cannot be undone.",
								confirmLabel: "Delete",
								warning: "TODO: wire real destructive action.",
								onConfirm: async () => {
									// TODO: plug in your real handler.
									await new Promise((resolve) => setTimeout(resolve, 600));
									showToast.success("Deleted (stub).");
								},
							})
						}
					>
						Open confirmation
					</Button>
				</div>
			</Panel>

			<Panel columns={2} className="border-black/[0.08]">
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Image inspect modal
					</Text>
					<Text variant="muted">
						Exercises the image-focused modal with custom layout options.
					</Text>
					<Button
						variant="primary"
						onClick={() =>
							openImageInspect({
								// TODO: Swap to a real image for your project.
								src: "/test/blob.png",
								alt: "Preview",
								onShare: async () => {
									showToast.info("Share clicked (stub).");
								},
							})
						}
					>
						Open image inspect
					</Button>
				</div>
				<div className="flex items-center justify-center">
					<div className="relative h-24 w-24">
						<Image src="/next.svg" alt="Preview" fill sizes="96px" />
					</div>
				</div>
			</Panel>

			<Panel columns={2} className="border-black/[0.08]">
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Toasts
					</Text>
					<Text variant="muted">
						Trigger different toast types via the shared `showToast` helper.
					</Text>
					<div className="flex flex-wrap gap-2">
						<Button onClick={() => showToast.success("Success toast example")}>
							Show success
						</Button>
						<Button
							variant="outline"
							onClick={() => showToast.error("Error toast example")}
						>
							Show error
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								showToast.success("Permanent toast (dev testing).", {
									title: "Pinned",
									durationMs: 0,
								})
							}
						>
							Show permanent
						</Button>
						<Button
							variant="ghost"
							onClick={() => {
								const promise = new Promise((resolve, reject) => {
									setTimeout(() => {
										Math.random() > 0.25
											? resolve(true)
											: reject(new Error("Failed"));
									}, 1400);
								});
								void showToast
									.promise(
										promise,
										{
											loading: "Saving changes...",
											success: "Changes saved.",
											error: "Save failed.",
										},
										{
											loadingTitle: "Working",
											successTitle: "Done",
											errorTitle: "Failed",
										},
									)
									.catch(() => undefined);
							}}
						>
							Show loading (promise)
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-2 text-sm text-muted-foreground">
					<Text variant="muted">
						All toasts are rendered by `ToastClientMount` in `layout.tsx`, so
						this page stays server-renderable aside from the client bits above.
					</Text>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Loader
					</Text>
					<Text variant="muted">
						Lightweight CSS loader for async UI states.
					</Text>
				</div>
				<div className="flex items-center gap-4">
					<Loader className="text-primary" />
					<Loader className="text-muted-foreground" />
					<Loader className="text-success" />
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						File previews
					</Text>
					<Text variant="muted">
						Remove buttons call confirmation modal; status pills use shared
						colors.
					</Text>
				</div>
				<div className="flex flex-wrap gap-3">
					{files.map((file, index) => (
						<FilePreview
							key={file.key}
							item={file}
							index={index}
							urlLooksLikeImage={(url) =>
								url.endsWith(".svg") || url.endsWith(".png")
							}
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
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Routing & error tests
					</Text>
					<Text variant="muted">
						Quick links to exercise 404 and error boundaries.
					</Text>
					<div className="flex flex-wrap gap-2">
						<Button variant="outline" href="/non-existent-route">
							Go to missing page (404)
						</Button>
						<Button variant="primary" onClick={() => setShouldCrash(true)}>
							Crash this page
						</Button>
					</div>
				</div>
				<div className="flex items-center justify-center rounded-xl border border-border/15 bg-surface px-4 py-6">
					<Text variant="muted">
						Use these controls to verify your error and 404 experiences.
					</Text>
				</div>
			</Panel>

			<Panel columns={2}>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Motion: Reveal
					</Text>
					<Text variant="muted">
						Staggered reveal group with reduced-motion guard. Adjust
						stagger/duration in the primitive.
					</Text>
					<RevealGroup
						stagger={0.12}
						delay={0.1}
						className="flex flex-col gap-2"
					>
						<RevealItem>
							<Text variant="bodyStrong">Item 1 (RevealItem)</Text>
						</RevealItem>
						<RevealItem>
							<Text variant="bodyStrong">Item 2 (RevealItem)</Text>
						</RevealItem>
						<RevealItem>
							<Button variant="outline">CTA inside reveal</Button>
						</RevealItem>
					</RevealGroup>
				</div>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Motion: ScrollLag
					</Text>
					<Text variant="muted">
						Left: normal flow lag. Right: fixed lag to mimic parallax.
					</Text>
					<div className="grid grid-cols-1 gap-3 lg:grid-cols-2">
						<ScrollLag className="rounded-xl border border-border/15 bg-surface px-4 py-6">
							<Text variant="bodyStrong">Flow ScrollLag</Text>
							<Text variant="muted">
								This box should drift slightly opposite scroll (flow layout).
							</Text>
						</ScrollLag>
						<div className="relative h-40 rounded-xl border border-border/15 bg-surface overflow-hidden">
							<ScrollLag
								className="absolute inset-3 flex flex-col gap-2 rounded-lg border border-border/15 bg-white/70 px-4 py-3 backdrop-blur"
								magnitude={0.2}
							>
								<Text variant="bodyStrong">Fixed ScrollLag</Text>
								<Text variant="muted">
									This is positioned fixed within the card to check parallax
									feel.
								</Text>
							</ScrollLag>
						</div>
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<Text as="h2" variant="headingMd">
						Motion: ScrollParallax
					</Text>
					<Text variant="muted">
						Uses page scroll progress to offset content. Adjust magnitude to
						make it scroll faster or slower than the page.
					</Text>
					<div className="grid gap-3 lg:grid-cols-2">
						<ScrollParallax
							className="rounded-xl border border-border/15 bg-surface px-4 py-6"
							magnitude={120}
						>
							<Text variant="bodyStrong">Downward parallax</Text>
							<Text variant="muted">
								Moves down as the page scrolls; higher magnitude exaggerates the
								effect.
							</Text>
						</ScrollParallax>
						<ScrollParallax
							className="rounded-xl border border-border/15 bg-surface px-4 py-6"
							magnitude={120}
							direction="up"
						>
							<Text variant="bodyStrong">Upward parallax</Text>
							<Text variant="muted">
								Moves up relative to scroll, creating a slower-than-page feel.
							</Text>
						</ScrollParallax>
					</div>
				</div>
			</Panel>
		</Section>
	);
}
