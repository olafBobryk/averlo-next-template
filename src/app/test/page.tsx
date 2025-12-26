// app/test/page.tsx
"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import { useConfirmationModal } from "@/components/ui/floating/modal/useConfirmationModal";
import { useImageInspectModal } from "@/components/ui/floating/modal/useImageInspectModal";
import { useModal } from "@/components/ui/floating/modal/useModal";
import { ChoiceInput } from "@/components/ui/input/ChoiceInput";
import { ComboboxTextInput } from "@/components/ui/input/ComboboxTextInput";
import { DateRangeDropdown } from "@/components/ui/input/DateRangeDropDown";
import { EmailInput } from "@/components/ui/input/EmailInput";
import { NumberInput } from "@/components/ui/input/NumberInput";
import { PasswordInput } from "@/components/ui/input/PasswordInput";
import { PhoneInput } from "@/components/ui/input/PhoneInput";
import { TextAreaInput } from "@/components/ui/input/TextAreaInput";
import { TextInput } from "@/components/ui/input/TextInput";
import { DynamicContent } from "@/components/ui/misc/DynamicContent";
import {
	FilePreview,
	type FilePreviewItem,
} from "@/components/ui/misc/FilePreview";
import { Button } from "@/components/ui/primitives/Button";
import { Heading } from "@/components/ui/primitives/Heading";
import { Text } from "@/components/ui/primitives/Text";
import { showToast } from "@/lib/toast";

export default function TestPage() {
	const { openModal, closeAll } = useModal();
	const { openConfirmation } = useConfirmationModal();
	const { openImageInspect } = useImageInspectModal();
	const [inputValues, setInputValues] = useState({
		name: "",
		email: "",
		password: "",
		bio: "",
		quantity: 1,
		choice: "opt1",
		combobox: "Alpha",
		phone: undefined as string | undefined,
	});
	const [files, setFiles] = useState<FilePreviewItem[]>(() => [
		{
			key: "img-1",
			status: "uploaded",
			url: "/next.svg",
		},
		{
			key: "pending-1",
			status: "pending",
			type: "image/png",
			url: "/next.svg",
			name: "example.png",
		},
	]);

const [contentState, setContentState] = useState<
	"loading" | "error" | "ready"
>("ready");

const isError = useMemo(() => contentState === "error", [contentState]);
	const [shouldCrash, setShouldCrash] = useState(false);

	if (shouldCrash) {
		throw new Error("Crash test from /test page");
	}
	const triggerCrash = () => {
		throw new Error("Crash test from /test page");
	};

	return (
		<div className="mx-auto flex max-w-5xl flex-col gap-8 px-6 py-10">
			<header className="flex flex-col gap-2">
				<Heading as="h1" size="lg">
					UI Testbed
				</Heading>
				<Text variant="muted">
					Manual checks for the UI kit. TODO: Swap copy, colors, assets, and
					ranges per project needs.
				</Text>
			</header>

			<section className="grid gap-6 rounded-2xl border border-border/15 bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Primitives
					</Heading>
					<Text variant="muted">
						Typography and buttons using shared tokens.
					</Text>
					<div className="flex flex-col gap-1">
						<Heading as="h3" size="xl">
							Heading XL
						</Heading>
						<Heading as="h4" size="md">
							Heading MD
						</Heading>
						<Text variant="body">Body text</Text>
						<Text variant="muted">Muted text</Text>
						<Text variant="captionMuted">Caption muted</Text>
					</div>
					<div className="flex flex-wrap gap-2">
						<Button variant="primary">Primary</Button>
						<Button variant="outline">Outline</Button>
						<Button variant="solid">Solid</Button>
						<Button variant="ghost">Ghost</Button>
					</div>
				</div>
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Text Inputs
					</Heading>
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
			</section>

			<section className="grid gap-6 rounded-2xl border border-border/15 bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Selection & composite inputs
					</Heading>
					<Text variant="muted">
						Choice, combobox, phone, and date range using the shared tokens.
					</Text>
					<div className="grid gap-3">
						<div className="flex flex-col gap-2">
							<Text variant="bodyStrong">ChoiceInput</Text>
							<div className="flex items-center gap-3">
								<ChoiceInput
									id="choice-opt1"
									name="choice-demo"
									value="opt1"
									label="Option 1"
									checked={inputValues.choice === "opt1"}
									onChange={(val) =>
										setInputValues((s) => ({ ...s, choice: val }))
									}
								/>
								<ChoiceInput
									id="choice-opt2"
									name="choice-demo"
									value="opt2"
									label="Option 2"
									checked={inputValues.choice === "opt2"}
									onChange={(val) =>
										setInputValues((s) => ({ ...s, choice: val }))
									}
								/>
							</div>
						</div>
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
						<PhoneInput
							label="Phone"
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
			</section>

			<section className="grid gap-6 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Modal basics
					</Heading>
					<Text variant="muted">
						Open a simple modal using the low-level `useModal` helper. The modal
						render function receives a `close` handler.
					</Text>
					<div className="flex flex-wrap gap-2">
						<Button
							variant="primary"
							onClick={() => {
								openModal(({ close }) => (
									<div className="flex flex-col gap-4 p-6">
										<Heading as="h3" size="md">
											Custom Modal
										</Heading>
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
					<Heading as="h2" size="md">
						Confirmation modal
					</Heading>
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
									showToast({ type: "success", message: "Deleted (stub)." });
								},
							})
						}
					>
						Open confirmation
					</Button>
				</div>
			</section>

			<section className="grid gap-6 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Image inspect modal
					</Heading>
					<Text variant="muted">
						Exercises the image-focused modal with custom layout options.
					</Text>
					<Button
						variant="primary"
						onClick={() =>
							openImageInspect({
								// TODO: Swap to a real image for your project.
								src: "/next.svg",
								alt: "Preview",
								onShare: async () => {
									showToast({ type: "info", message: "Share clicked (stub)." });
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
			</section>

			<section className="grid gap-6 rounded-2xl border border-black/[0.08] bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Toasts
					</Heading>
					<Text variant="muted">
						Trigger different toast types via the shared `showToast` helper.
					</Text>
					<div className="flex flex-wrap gap-2">
						<Button
							onClick={() =>
								showToast({ type: "success", message: "Success toast example" })
							}
						>
							Show success
						</Button>
						<Button
							variant="outline"
							onClick={() =>
								showToast({ type: "error", message: "Error toast example" })
							}
						>
							Show error
						</Button>
						<Button
							variant="ghost"
							onClick={() =>
								showToast({ type: "info", message: "Info toast example" })
							}
						>
							Show info
						</Button>
					</div>
				</div>
				<div className="flex flex-col gap-2 text-sm text-muted-foreground">
					<Text variant="muted">
						All toasts are rendered by `ToastClientMount` in `layout.tsx`, so
						this page stays server-renderable aside from the client bits above.
					</Text>
				</div>
			</section>

			<section className="grid gap-6 rounded-2xl border border-border/15 bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Dynamic content & alerts
					</Heading>
					<Text variant="muted">
						Test the loading/error/content states that reuse the same tone
						tokens.
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
				<div>
					<DynamicContent
						loading={contentState === "loading"}
						error={isError ? new Error("Network request failed (stub).") : null}
						onRetry={() => setContentState("loading")}
						className="w-full"
					>
						<div className="rounded-xl border border-border/15 bg-surface px-4 py-3">
							<Text>Loaded content goes here.</Text>
						</div>
					</DynamicContent>
				</div>
			</section>

			<section className="grid gap-6 rounded-2xl border border-border/15 bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						File previews
					</Heading>
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
			</section>

			<section className="grid gap-6 rounded-2xl border border-border/15 bg-white p-6 shadow-sm md:grid-cols-2">
				<div className="flex flex-col gap-3">
					<Heading as="h2" size="md">
						Routing & error tests
					</Heading>
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
			</section>
		</div>
	);
}
