export const THIN_START_WRITE_FILES = [
	{
		path: "src/components/ui/primitives/Button.tsx",
		content: `"use client";

import clsx from "clsx";
import Link from "next/link";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";

export type ButtonVariant =
	| "default"
	| "danger"
	| "solid"
	| "ghost"
	| "primary"
	| "primaryDark"
	| "outline";

type ButtonBaseProps = {
	align?: "left" | "center" | "between";
	children?: React.ReactNode;
	className?: string;
	disabled?: boolean;
	href?: string;
	leadingIcon?: React.ReactNode;
	loading?: boolean;
	size?: "sm" | "md" | "lg" | "xl" | "icon" | "icon-sm";
	trailingIcon?: React.ReactNode;
	variant?: ButtonVariant;
};

export type ButtonProps = ButtonBaseProps &
	Omit<React.ButtonHTMLAttributes<HTMLButtonElement>, keyof ButtonBaseProps> &
	Omit<React.AnchorHTMLAttributes<HTMLAnchorElement>, keyof ButtonBaseProps>;

function getButtonClassName({
	className,
	disabled,
	loading,
	variant = "default",
}: Pick<ButtonBaseProps, "className" | "disabled" | "loading" | "variant">) {
	return clsx(
		"inline-flex min-h-10 items-center justify-center gap-2 rounded-md px-4 py-2 text-sm font-medium transition-colors",
		focusRing.visibleDefault,
		"disabled:pointer-events-none disabled:opacity-50",
		loading && "pointer-events-none opacity-70",
		(variant === "default" ||
			variant === "primary" ||
			variant === "primaryDark") &&
			"bg-primary text-primary-foreground hover:bg-primary-hover",
		variant === "danger" &&
			"bg-danger text-white hover:bg-danger/90",
		(variant === "solid" || variant === "outline") &&
			"border border-border bg-foreground text-background hover:bg-foreground-hover",
		variant === "ghost" &&
			"bg-transparent px-2 text-foreground hover:bg-background-hover",
		disabled && "cursor-not-allowed",
		className,
	);
}

export const Button = React.forwardRef<HTMLElement, ButtonProps>(
	function Button(
		{
			children,
			className,
			disabled = false,
			href,
			leadingIcon,
			loading = false,
			size: _size,
			trailingIcon,
			type,
			variant = "default",
			align: _align,
			...rest
		},
		ref,
	) {
		const content = (
			<>
				{loading ? <span aria-hidden="true">...</span> : leadingIcon}
				{children ? <span className="truncate">{children}</span> : null}
				{trailingIcon}
			</>
		);
		const resolvedClassName = getButtonClassName({
			className,
			disabled,
			loading,
			variant,
		});

		if (href) {
			return (
				<Link
					ref={ref as React.Ref<HTMLAnchorElement>}
					href={href}
					aria-disabled={disabled || loading}
					className={resolvedClassName}
					{...(rest as React.AnchorHTMLAttributes<HTMLAnchorElement>)}
				>
					{content}
				</Link>
			);
		}

		return (
			<button
				ref={ref as React.Ref<HTMLButtonElement>}
				type={type ?? "button"}
				disabled={disabled || loading}
				className={resolvedClassName}
				{...(rest as React.ButtonHTMLAttributes<HTMLButtonElement>)}
			>
				{content}
			</button>
		);
	},
);
`,
	},
	{
		path: "src/components/ui/primitives/Text.tsx",
		content: `import { cva } from "class-variance-authority";
import type * as React from "react";

export const textVariants = cva("", {
	variants: {
		variant: {
			heading:
				"text-3xl font-semibold leading-tight tracking-normal md:text-5xl",
			body: "text-base leading-7",
			support: "text-sm leading-6",
			headingHero: "text-4xl font-semibold leading-tight md:text-6xl",
			heading2xxl: "text-4xl font-semibold leading-tight md:text-6xl",
			headingXxl: "text-3xl font-semibold leading-tight md:text-5xl",
			headingXl: "text-3xl font-semibold leading-tight md:text-5xl",
			headingLg: "text-2xl font-semibold leading-tight md:text-4xl",
			headingMd: "text-xl font-semibold leading-tight",
			headingSm: "text-lg font-semibold leading-tight",
			headingXs: "text-base font-semibold leading-snug",
			bodyStrong: "text-base font-semibold leading-7",
			caption: "text-sm leading-6",
		},
		tone: {
			default: "text-foreground",
			muted: "text-muted",
			inherit: "text-inherit",
		},
		interactive: {
			true: "transition-colors motion-interactive",
			false: "",
		},
	},
	defaultVariants: {
		variant: "body",
		tone: "default",
		interactive: true,
	},
});

export type TextVariant =
	| "heading"
	| "body"
	| "support"
	| "headingHero"
	| "heading2xxl"
	| "headingXxl"
	| "headingXl"
	| "headingLg"
	| "headingMd"
	| "headingSm"
	| "headingXs"
	| "bodyStrong"
	| "caption"
	| null;
export type TextTone = "default" | "muted" | "inherit" | null;

type TextOwnProps = {
	as?: React.ElementType;
	children?: React.ReactNode;
	className?: string;
	interactive?: boolean;
	tone?: TextTone;
	variant?: TextVariant;
};

export type TextProps = TextOwnProps &
	Omit<React.HTMLAttributes<HTMLElement>, keyof TextOwnProps>;

export function Text({
	as,
	children,
	className,
	interactive: _interactive,
	tone = "default",
	variant = "body",
	...rest
}: TextProps) {
	const Tag = as ?? (variant === "heading" ? "h2" : "p");

	return (
		<Tag
			className={textVariants({
				variant,
				tone,
				interactive: _interactive,
				className,
			})}
			{...rest}
		>
			{children}
		</Tag>
	);
}
`,
	},
	{
		path: "src/components/ui/input/choice/ChoiceIndicators.tsx",
		content: `"use client";

import clsx from "clsx";
import { focusRing } from "@/components/ui/foundations/focus";

type ChoiceIndicatorBaseProps = {
	checked: boolean;
	disabled?: boolean;
	className?: string;
};

export function ChoiceIndicatorMulti({
	checked,
	disabled,
	className,
}: ChoiceIndicatorBaseProps) {
	return (
		<div
			className={clsx(
				"choice-field-indicator flex h-[22px] w-[22px] items-center justify-center rounded-[8px] group-hover:bg-background-hover group-hover:scale-[1.05] group-active:bg-background-active group-active:scale-[0.95] motion-micro",
				focusRing.peerDefault,
				focusRing.peerError,
				disabled ? "opacity-60" : "opacity-100",
				className,
			)}
		>
			<div
				className={clsx(
					"flex h-[22px] w-[22px] overflow-hidden rounded-[8px] border transition-all motion-interactive",
					checked
						? "border-white/15 bg-primary"
						: "border-foreground/20 group-data-[tone=error]/field:border-danger",
					disabled ? "opacity-60" : "opacity-100",
				)}
			>
				<div
					className={clsx(
						"flex h-full w-full items-center justify-center motion-micro transition-colors",
						checked
							? "group-hover:bg-primary-hover group-active:bg-primary-active"
							: "",
					)}
				>
					<span
						aria-hidden="true"
						className={clsx(
							"text-[13px] font-semibold leading-none text-primary-foreground transition-transform motion-interactive",
							checked ? "scale-100" : "scale-0",
						)}
					>
						{"\\u2713"}
					</span>
				</div>
			</div>
		</div>
	);
}
`,
	},
	{
		path: "src/components/ui/primitives/Field.tsx",
		content: `import clsx from "clsx";
import type * as React from "react";
import { Text } from "@/components/ui/primitives/Text";

type FieldProps = {
	children: React.ReactNode;
	className?: string;
	description?: React.ReactNode;
	error?: React.ReactNode;
	id?: string;
	label?: React.ReactNode;
};

export function Field({
	children,
	className,
	description,
	error,
	id,
	label,
}: FieldProps) {
	const descriptionId = description && id ? \`\${id}-description\` : undefined;
	const errorId = error && id ? \`\${id}-error\` : undefined;

	return (
		<div className={clsx("grid gap-2", className)}>
			{label ? (
				<label htmlFor={id} className="text-sm font-medium text-foreground">
					{label}
				</label>
			) : null}
			{description ? (
				<Text id={descriptionId} variant="support" tone="muted">
					{description}
				</Text>
			) : null}
			{children}
			{error ? (
				<Text
					id={errorId}
					variant="support"
					className="text-danger"
					role="alert"
				>
					{error}
				</Text>
			) : null}
		</div>
	);
}
`,
	},
	{
		path: "src/components/ui/primitives/InputFrame.tsx",
		content: `import clsx from "clsx";
import * as React from "react";

export const inputTextClasses =
	"w-full bg-transparent px-3 py-2 text-sm text-foreground outline-none placeholder:text-muted disabled:cursor-not-allowed disabled:opacity-50";

type InputFrameProps = React.HTMLAttributes<HTMLDivElement> & {
	children: React.ReactNode;
	error?: boolean;
};

export const InputFrame = React.forwardRef<HTMLDivElement, InputFrameProps>(
	function InputFrame({ children, className, error = false, ...rest }, ref) {
		return (
			<div
				ref={ref}
				className={clsx(
					"flex min-h-10 items-center rounded-md border bg-background transition-colors",
					error ? "border-danger" : "border-border focus-within:border-primary",
					className,
				)}
				{...rest}
			>
				{children}
			</div>
		);
	},
);
`,
	},
	{
		path: "src/components/ui/input/TextInput.tsx",
		content: `"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";

type TextInputProps = Omit<
	React.InputHTMLAttributes<HTMLInputElement>,
	"children"
> & {
	description?: React.ReactNode;
	error?: React.ReactNode;
	label?: React.ReactNode;
};

export function TextInput({
	className,
	description,
	error,
	id,
	label,
	...props
}: TextInputProps) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const descriptionId = description ? \`\${inputId}-description\` : undefined;
	const errorId = error ? \`\${inputId}-error\` : undefined;

	return (
		<Field
			id={inputId}
			label={label}
			description={description}
			error={error}
			className={className}
		>
			<InputFrame error={Boolean(error)}>
				<input
					id={inputId}
					className={inputTextClasses}
					aria-describedby={
						[descriptionId, errorId].filter(Boolean).join(" ") || undefined
					}
					aria-invalid={Boolean(error)}
					{...props}
				/>
			</InputFrame>
		</Field>
	);
}
`,
	},
	{
		path: "src/components/ui/input/SelectInput.tsx",
		content: `"use client";

import * as React from "react";
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";

export type SelectOption<T extends string = string> = {
	label: string;
	value: T;
	disabled?: boolean;
};

type SelectInputProps<T extends string = string> = Omit<
	React.SelectHTMLAttributes<HTMLSelectElement>,
	"children" | "onChange" | "value"
> & {
	description?: React.ReactNode;
	error?: React.ReactNode;
	label?: React.ReactNode;
	onChange?: (value: T) => void;
	options: SelectOption<T>[];
	placeholder?: string;
	value?: T;
};

export function SelectInput<T extends string = string>({
	className,
	description,
	error,
	id,
	label,
	onChange,
	options,
	placeholder,
	value,
	...props
}: SelectInputProps<T>) {
	const generatedId = React.useId();
	const inputId = id ?? generatedId;
	const descriptionId = description ? \`\${inputId}-description\` : undefined;
	const errorId = error ? \`\${inputId}-error\` : undefined;

	return (
		<Field
			id={inputId}
			label={label}
			description={description}
			error={error}
			className={className}
		>
			<InputFrame error={Boolean(error)}>
				<select
					id={inputId}
					value={value}
					className={inputTextClasses}
					aria-describedby={
						[descriptionId, errorId].filter(Boolean).join(" ") || undefined
					}
					aria-invalid={Boolean(error)}
					onChange={(event) => onChange?.(event.currentTarget.value as T)}
					{...props}
				>
					{placeholder ? <option value="">{placeholder}</option> : null}
					{options.map((option) => (
						<option
							key={option.value}
							value={option.value}
							disabled={option.disabled}
						>
							{option.label}
						</option>
					))}
				</select>
			</InputFrame>
		</Field>
	);
}
`,
	},
	{
		path: "src/components/ui/primitives/Dropdown.tsx",
		content: `"use client";

import clsx from "clsx";
import * as React from "react";

export type DropdownTriggerRenderProps = {
	isOpen: boolean;
	openMenu: () => void;
	closeMenu: () => void;
	toggleMenu: () => void;
};

type DropdownProps = {
	children: React.ReactNode;
	className?: string;
	menuClassName?: string;
	renderTrigger: (props: DropdownTriggerRenderProps) => React.ReactNode;
};

export function Dropdown({
	children,
	className,
	menuClassName,
	renderTrigger,
}: DropdownProps) {
	const [isOpen, setIsOpen] = React.useState(false);
	const rootRef = React.useRef<HTMLDivElement | null>(null);

	React.useEffect(() => {
		if (!isOpen) return;
		const onPointerDown = (event: PointerEvent) => {
			if (!rootRef.current?.contains(event.target as Node)) {
				setIsOpen(false);
			}
		};
		document.addEventListener("pointerdown", onPointerDown);
		return () => document.removeEventListener("pointerdown", onPointerDown);
	}, [isOpen]);

	return (
		<div ref={rootRef} className={clsx("relative inline-block", className)}>
			{renderTrigger({
				isOpen,
				openMenu: () => setIsOpen(true),
				closeMenu: () => setIsOpen(false),
				toggleMenu: () => setIsOpen((current) => !current),
			})}
			{isOpen ? (
				<div
					className={clsx(
						"absolute right-0 z-50 mt-2 min-w-48 rounded-md border border-border bg-background p-1 shadow-lg",
						menuClassName,
					)}
				>
					{children}
				</div>
			) : null}
		</div>
	);
}
`,
	},
	{
		path: "src/components/ui/overlays/toast/ToastHost.tsx",
		content: `"use client";

import { Toaster, type ToasterProps } from "sonner";

type ToastHostProps = {
	position?: ToasterProps["position"];
};

export default function ToastHost({
	position = "bottom-right",
}: ToastHostProps) {
	return (
		<Toaster
			closeButton
			richColors
			position={position}
			toastOptions={{
				className: "border border-border bg-background text-foreground",
			}}
		/>
	);
}
`,
	},
	{
		path: "src/lib/feedback/toast.ts",
		content: `"use client";

import { toast } from "sonner";

export type ToastType = "success" | "error" | "loading" | "info";

type ToastOptions = {
	durationMs?: number;
	title?: string;
};

type ToastPromiseOptions = {
	durationMs?: number;
	loadingTitle?: string;
	successTitle?: string;
	errorTitle?: string;
};

function messageWithTitle(message: string, title?: string) {
	return title ? \`\${title}: \${message}\` : message;
}

export const showToast = {
	success: (message: string, options?: ToastOptions) =>
		toast.success(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	error: (message: string, options?: ToastOptions) =>
		toast.error(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	info: (message: string, options?: ToastOptions) =>
		toast.info(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	loading: (message: string, options?: ToastOptions) =>
		toast.loading(messageWithTitle(message, options?.title), {
			duration: options?.durationMs,
		}),
	dismiss: (id?: string | number) => toast.dismiss(id),
	promise: async <T>(
		promise: Promise<T>,
		messages: { loading: string; success: string; error: string },
		options?: ToastPromiseOptions,
	) => {
		toast.promise(promise, {
			loading: messageWithTitle(messages.loading, options?.loadingTitle),
			success: messageWithTitle(messages.success, options?.successTitle),
			error: messageWithTitle(messages.error, options?.errorTitle),
			duration: options?.durationMs,
		});
		return promise;
	},
};
`,
	},
	{
		path: "src/components/ui/overlays/modal/ModalShell.tsx",
		content: `"use client";

import type { ReactNode } from "react";
import Portal from "@/components/ui/overlays/Portal";

type ModalShellProps = {
	backdropClassName?: string;
	children: ReactNode;
	isTopMost?: boolean;
	onClose: () => void;
	panelClassName?: string;
	panelStyle?: React.CSSProperties;
	panelWrapperClassName?: string;
	portalTargetId?: string;
};

export function ModalShell({
	backdropClassName,
	children,
	isTopMost: _isTopMost,
	onClose,
	panelClassName,
	panelStyle,
	panelWrapperClassName,
	portalTargetId,
}: ModalShellProps) {
	return (
		<Portal target={portalTargetId}>
			<div
				className={["fixed inset-0 z-50 flex items-center justify-center bg-foreground/40 p-4", backdropClassName]
					.filter(Boolean)
					.join(" ")}
			>
				<button
					type="button"
					aria-label="Close modal"
					className="absolute inset-0"
					onClick={onClose}
				/>
				<div
					className={["relative w-full max-w-lg", panelWrapperClassName]
						.filter(Boolean)
						.join(" ")}
				>
					<div
						className={["relative rounded-md border border-border bg-background p-6 shadow-xl", panelClassName]
							.filter(Boolean)
							.join(" ")}
						style={panelStyle}
					>
						{children}
					</div>
				</div>
			</div>
		</Portal>
	);
}
`,
	},
	{
		path: "src/components/ui/overlays/modal/ConfirmationModal.tsx",
		content: `"use client";

import * as React from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

type ConfirmationModalProps = {
	title: string;
	description: string;
	confirmLabel: string;
	onConfirm: () => void | Promise<void>;
	onClose: () => void;
	warning?: string;
};

export function ConfirmationModal({
	title,
	description,
	confirmLabel,
	onConfirm,
	onClose,
	warning,
}: ConfirmationModalProps) {
	const [isSubmitting, setIsSubmitting] = React.useState(false);

	const handleConfirm = async () => {
		if (isSubmitting) return;
		setIsSubmitting(true);
		try {
			await onConfirm();
			onClose();
		} finally {
			setIsSubmitting(false);
		}
	};

	return (
		<div className="grid gap-5">
			<div className="grid gap-2">
				<Text as="h2" variant="heading">
					{title}
				</Text>
				<Text tone="muted">{description}</Text>
				{warning ? <Text className="text-danger">{warning}</Text> : null}
			</div>
			<div className="flex justify-end gap-2">
				<Button type="button" variant="ghost" onClick={onClose}>
					Cancel
				</Button>
				<Button type="button" loading={isSubmitting} onClick={handleConfirm}>
					{confirmLabel}
				</Button>
			</div>
		</div>
	);
}
`,
	},
	{
		path: "src/components/ui/overlays/modal/ImageInspectModal.tsx",
		content: `"use client";

import { Button } from "@/components/ui/primitives/Button";

type ImageInspectModalProps = {
	src: string;
	alt?: string;
	onClose: () => void;
	onShare?: () => void | Promise<void>;
	shareUrl?: string;
};

export function ImageInspectModal({
	src,
	alt = "Preview image",
	onClose,
}: ImageInspectModalProps) {
	return (
		<div className="grid gap-4">
			<img src={src} alt={alt} className="max-h-[70vh] w-full rounded-md object-contain" />
			<div className="flex justify-end">
				<Button type="button" variant="ghost" onClick={onClose}>
					Close
				</Button>
			</div>
		</div>
	);
}
`,
	},
	{
		path: "src/app/(site)/layout.tsx",
		content: `import FormValidationClientMount from "@/components/mount/FormValidationClientMount";
import LoadingScreenMount from "@/components/mount/LoadingScreenMount";
import ModalClientMount from "@/components/mount/ModalClientMount";
import ToastClientMount from "@/components/mount/ToastClientMount";
import { MotionProvider } from "@/components/ui/foundations/MotionProvider";
import { SettingsProvider } from "@/components/ui/foundations/settingsContext";

export default function SiteLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<SettingsProvider>
			<MotionProvider expressive={0}>
				{children}
				<FormValidationClientMount />
				<LoadingScreenMount />
				<ModalClientMount />
				<ToastClientMount />
			</MotionProvider>
		</SettingsProvider>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/layout.tsx",
		content: `import { getSiteLayout } from "@/lib/marketing-content/resolvers";
import { MarketingShell } from "./_components/layout/MarketingShell";

export default async function MarketingLayout({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	const siteLayout = await getSiteLayout();

	return <MarketingShell siteLayout={siteLayout}>{children}</MarketingShell>;
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/Header.tsx",
		content: `"use client";

import { usePathname } from "next/navigation";
import { useEffect, useState } from "react";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useAppReady } from "@/hooks/useAppReady";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";
import HeaderCompact from "./HeaderCompact";
import HeaderFull from "./HeaderFull";

const TOP_SCROLL_BAND_PX = 25;

type HeaderProps = {
	className?: string;
	forceScrolled?: boolean;
	forceScrolledPathPrefixes?: readonly string[];
	layout: SiteLayoutDocument["header"];
};

function getIsScrolled() {
	return window.scrollY > TOP_SCROLL_BAND_PX;
}

export default function Header({
	className = "",
	forceScrolled = false,
	forceScrolledPathPrefixes = [],
	layout,
}: HeaderProps) {
	const pathname = usePathname();
	const [isScrolled, setIsScrolled] = useState(false);
	const appReady = useAppReady();
	const motionAllowed = useMotionAllowed(true);
	const motionDisabled = useMotionDisableOverride();
	const isForceScrolledRoute = forceScrolledPathPrefixes.some((prefix) =>
		pathname.startsWith(prefix),
	);
	const effectiveIsScrolled =
		forceScrolled || isForceScrolledRoute || isScrolled;
	const shouldAnimate =
		motionAllowed && !motionDisabled && !forceScrolled && !isForceScrolledRoute;

	useEffect(() => {
		let frameId: number | null = null;

		const measure = () => {
			setIsScrolled((current) => {
				const next = getIsScrolled();
				return current === next ? current : next;
			});
		};

		const scheduleMeasure = () => {
			if (frameId !== null) return;

			frameId = window.requestAnimationFrame(() => {
				frameId = null;
				measure();
			});
		};

		measure();
		window.addEventListener("scroll", scheduleMeasure, { passive: true });
		window.addEventListener("wheel", scheduleMeasure, { passive: true });
		window.addEventListener("touchmove", scheduleMeasure, { passive: true });
		window.addEventListener("hashchange", scheduleMeasure);

		return () => {
			if (frameId !== null) {
				window.cancelAnimationFrame(frameId);
			}
			window.removeEventListener("scroll", scheduleMeasure);
			window.removeEventListener("wheel", scheduleMeasure);
			window.removeEventListener("touchmove", scheduleMeasure);
			window.removeEventListener("hashchange", scheduleMeasure);
		};
	}, []);

	useEffect(() => {
		void pathname;
		const frameId = window.requestAnimationFrame(() => {
			setIsScrolled(getIsScrolled());
		});

		return () => {
			window.cancelAnimationFrame(frameId);
		};
	}, [pathname]);

	return (
		<>
			<div className="hidden lg:block">
				<HeaderFull
					animateEntrance={shouldAnimate}
					entranceReady={appReady}
					isScrolled={effectiveIsScrolled}
					layout={layout}
					className={className}
				/>
			</div>
			<div className="block lg:hidden">
				<HeaderCompact
					animateEntrance={shouldAnimate}
					entranceReady={appReady}
					isScrolled={effectiveIsScrolled}
					layout={layout}
					className={className}
				/>
			</div>
		</>
	);
}

`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/Footer.tsx",
		content: `import Logo from "@/components/branding/Logo";
import { Button } from "@/components/ui/primitives/Button";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";

export default function Footer({
	layout,
}: {
	layout: SiteLayoutDocument["footer"];
}) {
	return (
		<footer className="border-t border-border px-section-x py-10">
			<div className="mx-auto flex max-w-section-max flex-col items-center gap-6">
				<Logo size="sm" />
				<div className="flex flex-wrap justify-center gap-2">
					{layout.navLinks.map((item) => (
						<Button
							key={item.label}
							href={getMarketingLinkHref(item)}
							variant="ghost"
						>
							{item.label}
						</Button>
					))}
				</div>
			</div>
		</footer>
	);
}

`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/MarketingShell.tsx",
		content: `import ScrollController from "@/components/mount/ScrollController";
import { Reveal } from "@/components/ui/motion";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";
import Footer from "./Footer";
import Header from "./Header";

export function MarketingShell({
	children,
	siteLayout,
}: Readonly<{
	children: React.ReactNode;
	siteLayout: SiteLayoutDocument;
}>) {
	return (
		<>
			<Header layout={siteLayout.header} />
			<Reveal.Root>{children}</Reveal.Root>
			<Footer layout={siteLayout.footer} />
			<ScrollController />
		</>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/marketingNav.ts",
		content: `export type MarketingNavLink = {
	name: string;
	href: string;
};

export type MarketingSocialLink = {
	name: string;
	href: string;
};

export const MARKETING_NAV_LINKS: MarketingNavLink[] = [
	{ name: "Home", href: "/" },
	{ name: "Intelligence", href: "/internal/intelligence" },
];

export const MARKETING_SOCIAL_LINKS: MarketingSocialLink[] = [];
`,
	},
	{
		path: "src/lib/marketing-content/types.ts",
		content: `import type { AppRouteId } from "@/config/routes";

export type MarketingPageSlug = "home";

export type HeaderIconName = "close" | "menu" | "search" | "dot";

export type MarketingLink =
	| {
			label: string;
			routeId: AppRouteId;
			href?: never;
	  }
	| {
			label: string;
			href: string;
			routeId?: never;
	  };

export type MarketingNavSection = MarketingLink & {
	description?: string;
	icon?: HeaderIconName;
};

export type MarketingNavLink = MarketingLink & {
	sections?: MarketingNavSection[];
};

export type MarketingMenuGroup = {
	label: string;
	icon?: HeaderIconName;
	link?: MarketingLink;
	links?: MarketingLink[];
};

export type MarketingSectionBase<TBlockType extends string> = {
	id?: string;
	blockType: TBlockType;
};

export type HomeHeroSectionBlock = MarketingSectionBase<"homeHero"> & {
	headline: string;
	descriptions: Array<{
		text: string;
	}>;
	cta: MarketingLink;
};

export type MarketingSection = HomeHeroSectionBlock;

export type MarketingPageDocument = {
	slug: MarketingPageSlug;
	title: string;
	layout: MarketingSection[];
};

export type SiteLayoutDocument = {
	header: {
		cta: MarketingLink;
		menuGroups: MarketingMenuGroup[];
		mobile: {
			closeAriaLabel: string;
			menuLabel: string;
			openAriaLabel: string;
		};
		navLinks: MarketingNavLink[];
		search: {
			ariaLabel: string;
			clearLabel: string;
			noResultsText: string;
		};
		searchGroups: MarketingMenuGroup[];
		topNavLinks: MarketingLink[];
	};
	footer: {
		navLinks: MarketingLink[];
	};
};

`,
	},
	{
		path: "src/lib/marketing-content/fallback.ts",
		content: `import type { MarketingPageDocument, SiteLayoutDocument } from "./types";

export const fallbackHomePage: MarketingPageDocument = {
	slug: "home",
	title: "Home",
	layout: [
		{
			id: "home-hero",
			blockType: "homeHero",
			headline: "A focused website starter.",
			descriptions: [
				{
					text: "Start with the smallest useful primitive surface, then add only the components this website needs.",
				},
			],
			cta: {
				label: "Start",
				href: "/#hero",
			},
		},
	],
};

export const fallbackSiteLayout: SiteLayoutDocument = {
	header: {
		cta: {
			label: "Start",
			href: "/#hero",
		},
		menuGroups: [
			{
				label: "Start",
				icon: "dot",
				link: { label: "Home", routeId: "home" },
				links: [
					{ label: "Hero", href: "/#hero" },
					{ label: "Intelligence", routeId: "intelligence" },
				],
			},
			{
				label: "Build",
				icon: "dot",
				links: [
					{ label: "Home", routeId: "home" },
					{ label: "Contact", routeId: "contact" },
				],
			},
		],
		mobile: {
			closeAriaLabel: "Close navigation",
			menuLabel: "Menu",
			openAriaLabel: "Open navigation",
		},
		navLinks: [
			{
				label: "Home",
				routeId: "home",
				sections: [
					{
						label: "Hero",
						href: "/#hero",
						description: "Primary home page introduction.",
					},
				],
			},
			{
				label: "Intelligence",
				routeId: "intelligence",
				sections: [
					{
						label: "Concept map",
						href: "/internal/intelligence",
						description: "Generated template intelligence overview.",
					},
				],
			},
		],
		search: {
			ariaLabel: "Search pages",
			clearLabel: "Clear",
			noResultsText: "No matching pages",
		},
		searchGroups: [
			{
				label: "Home",
				icon: "dot",
				link: { label: "Home", routeId: "home" },
				links: [{ label: "Hero", href: "/#hero" }],
			},
			{
				label: "Internal",
				icon: "dot",
				links: [{ label: "Intelligence", routeId: "intelligence" }],
			},
		],
		topNavLinks: [
			{ label: "Home", routeId: "home" },
			{ label: "Intelligence", routeId: "intelligence" },
		],
	},
	footer: {
		navLinks: [
			{ label: "Home", routeId: "home" },
			{ label: "Intelligence", routeId: "intelligence" },
		],
	},
};

`,
	},
	{
		path: "src/lib/marketing-content/links.ts",
		content: `import { hrefFor } from "@/lib/routes";
import type { MarketingLink } from "./types";

export function getMarketingLinkHref(link: MarketingLink) {
	if (link.routeId) {
		return hrefFor(link.routeId);
	}

	return link.href;
}

`,
	},
	{
		path: "src/lib/marketing-content/resolvers.ts",
		content: `import { fallbackHomePage, fallbackSiteLayout } from "./fallback";
import type {
	MarketingPageDocument,
	MarketingPageSlug,
	SiteLayoutDocument,
} from "./types";

export async function getMarketingPage(
	slug: MarketingPageSlug,
): Promise<MarketingPageDocument> {
	if (slug === "home") {
		return fallbackHomePage;
	}

	return fallbackHomePage;
}

export async function getSiteLayout(): Promise<SiteLayoutDocument> {
	return fallbackSiteLayout;
}
`,
	},
	{
		path: "src/lib/marketing-content/sections/homeHero/HomeHeroSection.tsx",
		content: `"use client";

import { Reveal } from "@/components/ui/motion";
import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import { getMarketingLinkHref } from "../../links";
import type { HomeHeroSectionBlock } from "../../types";

type HomeHeroSectionProps = {
	section: HomeHeroSectionBlock;
};

export function HomeHeroSection({ section }: HomeHeroSectionProps) {
	const description = section.descriptions[0]?.text ?? "";

	return (
		<Section id="hero" padding="hero">
			<Reveal.List className="mx-auto flex min-h-[70vh] max-w-section-max flex-col justify-center gap-8">
				<Reveal.Item>
					<Text as="h1" variant="heading" className="max-w-3xl">
						{section.headline}
					</Text>
				</Reveal.Item>
				<Reveal.Item>
					<Text as="p" tone="muted" className="max-w-2xl">
						{description}
					</Text>
				</Reveal.Item>
				<Reveal.Item>
					<Button href={getMarketingLinkHref(section.cta)}>
						{section.cta.label}
					</Button>
				</Reveal.Item>
			</Reveal.List>
		</Section>
	);
}

`,
	},
	{
		path: "src/config/routes.ts",
		content: `export const appRoutes = {
	home: "/",
	contact: "/contact",
	intelligence: "/internal/intelligence",
} as const;

export type AppRouteId = keyof typeof appRoutes;
`,
	},
	{
		path: "src/lib/routes.ts",
		content: `import { type AppRouteId, appRoutes } from "@/config/routes";

export type { AppRouteId } from "@/config/routes";

export function hrefFor(routeId: AppRouteId) {
	return appRoutes[routeId];
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/internal/intelligence/_components/InternalCard.tsx",
		content: `import clsx from "clsx";
import type { ReactNode } from "react";

export function InternalCard({
	children,
	className,
}: {
	children: ReactNode;
	className?: string;
}) {
	return (
		<div className={clsx("rounded-md border border-border bg-background p-5", className)}>
			{children}
		</div>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/internal/intelligence/page.tsx",
		content: `import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceBenchmarkRuns,
	readTemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { BenchmarkRunToggle } from "./BenchmarkRunToggle";
import { InternalCard } from "./_components/InternalCard";

type SearchParams = Promise<
	Record<string, string | string[] | undefined> | undefined
>;

function getViewParam(
	searchParams: Record<string, string | string[] | undefined> | undefined,
) {
	const value = searchParams?.view;
	const view = Array.isArray(value) ? value[0] : value;

	return view === "benchmarks" ? "benchmarks" : "index";
}

export default async function TemplateIntelligencePage({
	searchParams,
}: {
	searchParams: SearchParams;
}) {
	const resolvedSearchParams = await searchParams;
	const view = getViewParam(resolvedSearchParams);

	if (view === "benchmarks") {
		const result = await readTemplateIntelligenceBenchmarkRuns();

		return (
			<main>
				<Section padding="hero">
					<div className="mx-auto grid max-w-section-max gap-6">
						<header className="grid gap-3">
							<Text as="h1" variant="heading">
								Template Intelligence Benchmarks
							</Text>
							<Text tone="muted">
								Minimal route-owned benchmark summary for thin-start.
							</Text>
						</header>
						<div className="flex gap-3">
							<Button href="/internal/intelligence" variant="ghost">
								Overview
							</Button>
							<BenchmarkRunToggle isExample={false} />
						</div>
						<InternalCard>
							<Text as="h2" variant="heading" className="text-xl">
								{result.runs.length} recorded runs
							</Text>
							<Text tone="muted">
								{result.invalidLineCount} invalid benchmark lines skipped.
							</Text>
						</InternalCard>
					</div>
				</Section>
			</main>
		);
	}

	const [indexResult, agentMapResult] = await Promise.all([
		readTemplateIntelligenceIndex(),
		readTemplateIntelligenceAgentMap(),
	]);

	return (
		<main>
			<Section padding="hero">
				<div className="mx-auto grid max-w-section-max gap-6">
					<header className="grid gap-3">
						<Text as="h1" variant="heading">
							Template Intelligence
						</Text>
						<Text tone="muted">
							Minimal route-owned intelligence summary for thin-start.
						</Text>
					</header>
					<div className="flex gap-3">
						<Button href="/internal/intelligence/graph" variant="ghost">
							Graph summary
						</Button>
						<Button href="/internal/intelligence?view=benchmarks" variant="ghost">
							Benchmarks
						</Button>
					</div>
					<div className="grid gap-4 md:grid-cols-3">
						<InternalCard>
							<Text variant="support" tone="muted">
								Index
							</Text>
							<Text as="p" variant="heading" className="text-2xl">
								{indexResult.status}
							</Text>
						</InternalCard>
						<InternalCard>
							<Text variant="support" tone="muted">
								Files
							</Text>
							<Text as="p" variant="heading" className="text-2xl">
								{indexResult.status === "ready" ? indexResult.index.files.length : 0}
							</Text>
						</InternalCard>
						<InternalCard>
							<Text variant="support" tone="muted">
								Agent map
							</Text>
							<Text as="p" variant="heading" className="text-2xl">
								{agentMapResult.status}
							</Text>
						</InternalCard>
					</div>
				</div>
			</Section>
		</main>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/internal/intelligence/BenchmarkRunToggle.tsx",
		content: `"use client";

import { useRouter } from "next/navigation";

export function BenchmarkRunToggle({ isExample }: { isExample: boolean }) {
	const router = useRouter();

	return (
		<button
			type="button"
			className="rounded-md border border-border px-3 py-2 text-sm"
			onClick={() =>
				router.push(
					isExample
						? "/internal/intelligence?view=benchmarks"
						: "/internal/intelligence?view=benchmarks&example=on",
				)
			}
		>
			{isExample ? "Show real runs" : "Show example runs"}
		</button>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/internal/intelligence/TemplateIntelligenceGraph.tsx",
		content: `import type { TemplateIntelligenceGraphView } from "@/lib/template-intelligence";
import { InternalCard } from "./_components/InternalCard";

export function TemplateIntelligenceGraph({
	graphs,
}: {
	graphs: TemplateIntelligenceGraphView[];
}) {
	return (
		<div className="grid gap-4">
			{graphs.map((graph) => (
				<InternalCard key={graph.id}>
					<h2 className="text-lg font-semibold">{graph.title}</h2>
					<p className="mt-2 text-sm text-muted">
						{graph.nodes.length} nodes, {graph.links.length} links
					</p>
				</InternalCard>
			))}
		</div>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/internal/intelligence/graph/page.tsx",
		content: `import { Button } from "@/components/ui/primitives/Button";
import { Section } from "@/components/ui/primitives/Section";
import { Text } from "@/components/ui/primitives/Text";
import {
	readTemplateIntelligenceAgentMap,
	readTemplateIntelligenceIndex,
} from "@/lib/template-intelligence";
import { buildTemplateIntelligenceGraphs } from "@/lib/template-intelligence/graphs";
import { TemplateIntelligenceGraph } from "../TemplateIntelligenceGraph";

export default async function TemplateIntelligenceGraphPage() {
	const [indexResult, agentMapResult] = await Promise.all([
		readTemplateIntelligenceIndex(),
		readTemplateIntelligenceAgentMap(),
	]);

	if (indexResult.status !== "ready") {
		return (
			<main>
				<Section padding="hero">
					<div className="mx-auto grid max-w-section-max gap-4">
						<Text as="h1" variant="heading">
							Template Intelligence
						</Text>
						<Text tone="muted">Run npm run intelligence:generate first.</Text>
						<Button href="/internal/intelligence" variant="ghost">
							Back
						</Button>
					</div>
				</Section>
			</main>
		);
	}

	const graphs = buildTemplateIntelligenceGraphs({
		index: indexResult.index,
		agentMap:
			agentMapResult.status === "ready" ? agentMapResult.agentMap : null,
	});

	return (
		<main>
			<Section padding="hero">
				<div className="mx-auto grid max-w-section-max gap-6">
					<header className="grid gap-3">
						<Text as="h1" variant="heading">
							Graph Summary
						</Text>
						<Text tone="muted">
							Route-owned summary of generated intelligence graphs.
						</Text>
					</header>
					<TemplateIntelligenceGraph graphs={graphs} />
				</div>
			</Section>
		</main>
	);
}
`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/HeaderCompact.tsx",
		content: `"use client";

import clsx from "clsx";
import { motion, type Transition } from "motion/react";
import { useState } from "react";
import Logo from "@/components/branding/Logo";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { Button } from "@/components/ui/primitives/Button";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type { SiteLayoutDocument } from "@/lib/marketing-content/types";
import {
	getHeaderSearchGroups,
	HeaderMenuGroup,
	HeaderMenuIcon,
	HeaderMenuNoResults,
	HeaderSearchInput,
} from "./HeaderMenuContent";

const COMPACT_OPEN_TOP_PADDING = 16;
const COMPACT_OPEN_BAR_HEIGHT = 48;
const COMPACT_OPEN_MENU_GAP = 12;
const COMPACT_OPEN_MENU_OFFSET =
	COMPACT_OPEN_TOP_PADDING + COMPACT_OPEN_BAR_HEIGHT + COMPACT_OPEN_MENU_GAP;
const COMPACT_OPEN_CTA_HEIGHT = 60;
const COMPACT_OPEN_SCROLL_AREA_OFFSET =
	COMPACT_OPEN_MENU_OFFSET + COMPACT_OPEN_CTA_HEIGHT + 48;
const COMPACT_CLOSED_HEADER_HEIGHT = 76;
const COMPACT_CONDENSED_HEADER_HEIGHT = 60;
const HEADER_ENTRANCE_HIDDEN = { opacity: 0, y: -28, scale: 0.965 };
const HEADER_ENTRANCE_VISIBLE = { opacity: 1, y: 0, scale: 1 };

export default function HeaderCompact({
	animateEntrance = false,
	entranceReady = true,
	isScrolled,
	layout,
	className = "",
}: {
	animateEntrance?: boolean;
	entranceReady?: boolean;
	isScrolled: boolean;
	layout: SiteLayoutDocument["header"];
	className?: string;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const menuGroups = layout.menuGroups ?? [];
	const mobile = layout.mobile ?? {
		closeAriaLabel: "Close navigation",
		menuLabel: "Menu",
		openAriaLabel: "Open navigation",
	};
	const search = layout.search ?? {
		ariaLabel: "Search pages",
		clearLabel: "Clear",
		noResultsText: "No matching pages",
	};
	const searchSourceGroups = layout.searchGroups ?? menuGroups;
	const showHeaderSurface = isScrolled || isMenuOpen;
	const isCondensed = isScrolled && !isMenuOpen;
	const isSearchActive = searchQuery.trim().length > 0;
	const searchGroups = getHeaderSearchGroups(searchQuery, searchSourceGroups);
	const activeMenuGroups = isSearchActive ? searchGroups : menuGroups;
	const motionAllowed = useMotionAllowed(true);
	const headerTransition: Transition = motionAllowed
		? spring.macro
		: instantTransition;
	const heightTransition: Transition = motionAllowed
		? spring.component
		: instantTransition;
	const shouldAnimateEntrance = animateEntrance && motionAllowed;
	const headerHeight = isMenuOpen
		? "100vh"
		: isCondensed
			? COMPACT_CONDENSED_HEADER_HEIGHT
			: COMPACT_CLOSED_HEADER_HEIGHT;
	const entranceState =
		shouldAnimateEntrance && !entranceReady
			? HEADER_ENTRANCE_HIDDEN
			: HEADER_ENTRANCE_VISIBLE;

	const closeMenu = () => {
		setSearchQuery("");
		setIsMenuOpen(false);
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			closeMenu();
			return;
		}

		setIsMenuOpen(true);
	};

	return (
		<motion.header
			data-open={isMenuOpen}
			initial={
				shouldAnimateEntrance
					? { ...HEADER_ENTRANCE_HIDDEN, height: COMPACT_CLOSED_HEADER_HEIGHT }
					: false
			}
			animate={{
				height: headerHeight,
				...entranceState,
			}}
			transition={heightTransition}
			className={clsx(
				"fixed inset-x-0 top-0 z-50 h-[76px] px-section-x",
				className,
			)}
		>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 border-b border-border bg-background"
				initial={false}
				animate={{ opacity: showHeaderSurface ? 1 : 0 }}
				transition={headerTransition}
			/>
			<motion.div
				className="relative mx-auto flex h-full w-full max-w-section-max flex-col gap-3"
				initial={false}
				animate={{ paddingTop: isCondensed ? 8 : 16 }}
				transition={headerTransition}
			>
				<motion.div
					className="flex items-center justify-between gap-3 px-3"
					initial={false}
					animate={{
						paddingTop: isCondensed ? 8 : 12,
						paddingBottom: isCondensed ? 8 : 12,
					}}
					transition={headerTransition}
				>
					<motion.div
						className="origin-left"
						initial={false}
						animate={{ scale: isCondensed ? 0.9 : 1 }}
						transition={headerTransition}
					>
						<Logo size="sm" className="pointer-events-auto" />
					</motion.div>
					<Button
						variant="ghost"
						className="min-h-10 gap-2 px-3"
						leadingIcon={
							<HeaderMenuIcon
								name={isMenuOpen ? "close" : "menu"}
								className="text-foreground"
							/>
						}
						onClick={toggleMenu}
						aria-expanded={isMenuOpen}
						aria-label={
							isMenuOpen ? mobile.closeAriaLabel : mobile.openAriaLabel
						}
					>
						{mobile.menuLabel}
					</Button>
				</motion.div>
				<div
					data-open={isMenuOpen}
					className="grid min-h-0 transition-[grid-template-rows,opacity] motion-component data-[open=false]:grid-rows-[0fr] data-[open=false]:opacity-0 data-[open=true]:grid-rows-[1fr] data-[open=true]:opacity-100"
					style={{
						height: isMenuOpen
							? \`calc(100vh - \${COMPACT_OPEN_MENU_OFFSET}px)\`
							: undefined,
					}}
				>
					<div className="overflow-hidden">
						<div
							className="overflow-auto"
							style={{
								maxHeight: \`calc(100vh - \${COMPACT_OPEN_SCROLL_AREA_OFFSET}px)\`,
							}}
						>
							<div className="flex min-h-full flex-col gap-3 px-3 pb-8">
								<div className="mb-6">
									<HeaderSearchInput
										value={searchQuery}
										onValueChange={setSearchQuery}
										onClear={() => setSearchQuery("")}
										ariaLabel={search.ariaLabel}
										clearLabel={search.clearLabel}
										placeholder={search.ariaLabel}
										className="w-full"
									/>
								</div>
								{activeMenuGroups.length > 0 ? (
									<div className="grid grid-cols-1 gap-x-6 gap-y-8 sm:grid-cols-2">
										{activeMenuGroups.map((group) => (
											<div key={group.label} className="min-w-0">
												<HeaderMenuGroup group={group} onNavigate={closeMenu} />
											</div>
										))}
									</div>
								) : (
									<HeaderMenuNoResults noResultsText={search.noResultsText} />
								)}
								<div className="mt-auto flex flex-col gap-8 pt-5">
									<Button
										variant="primary"
										href={getMarketingLinkHref(layout.cta)}
										onClick={closeMenu}
										className="w-full"
									>
										{layout.cta.label}
									</Button>
								</div>
							</div>
						</div>
					</div>
				</div>
			</motion.div>
		</motion.header>
	);
}

`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/HeaderFull.tsx",
		content: `"use client";

import clsx from "clsx";
import { AnimatePresence, motion, type Transition } from "motion/react";
import { useEffect, useId, useRef, useState } from "react";
import Logo from "@/components/branding/Logo";
import { instantTransition } from "@/components/ui/foundations/motionTiming";
import { spring } from "@/components/ui/foundations/spring";
import { Button } from "@/components/ui/primitives/Button";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type {
	MarketingLink,
	SiteLayoutDocument,
} from "@/lib/marketing-content/types";
import {
	getHeaderSearchGroups,
	getMenuContentHeight,
	HEADER_MENU_CAPPED_COLUMNS,
	HEADER_MENU_DEFAULT_COLUMNS,
	HeaderMenuGrid,
	HeaderMenuIcon,
	HeaderSearchInput,
	HeaderSearchResults,
} from "./HeaderMenuContent";

const HEADER_EXPANDED_HEIGHT = 100;
const HEADER_COMPACT_HEIGHT = 70;
const HEADER_MENU_TOP_PADDING = 22;
const HEADER_MENU_BOTTOM_PADDING = 32;
const HEADER_ENTRANCE_HIDDEN = { opacity: 0, y: -28, scale: 0.965 };
const HEADER_ENTRANCE_VISIBLE = { opacity: 1, y: 0, scale: 1 };

function HeaderTopNavLink({
	className,
	link,
}: {
	className?: string;
	link: MarketingLink;
}) {
	return (
		<Button
			href={getMarketingLinkHref(link)}
			variant="ghost"
			className={clsx(
				"text-foreground/60 hover:bg-transparent hover:text-foreground",
				className,
			)}
		>
			{link.label}
		</Button>
	);
}

export default function HeaderFull({
	animateEntrance = false,
	entranceReady = true,
	isScrolled,
	layout,
	className = "",
}: {
	animateEntrance?: boolean;
	entranceReady?: boolean;
	isScrolled: boolean;
	layout: SiteLayoutDocument["header"];
	className?: string;
}) {
	const [isMenuOpen, setIsMenuOpen] = useState(false);
	const [searchQuery, setSearchQuery] = useState("");
	const headerRef = useRef<HTMLElement>(null);
	const menuId = useId();
	const menuGroups = layout.menuGroups ?? [];
	const mobile = layout.mobile ?? {
		closeAriaLabel: "Close navigation",
		openAriaLabel: "Open navigation",
	};
	const search = layout.search ?? {
		ariaLabel: "Search pages",
		clearLabel: "Clear",
		noResultsText: "No matching pages",
	};
	const searchSourceGroups = layout.searchGroups ?? menuGroups;
	const topNavLinks = layout.topNavLinks ?? [];
	const isCompact = isScrolled && !isMenuOpen;
	const isSearchActive = searchQuery.trim().length > 0;
	const areTopNavLinksVisible = !isMenuOpen;
	const searchGroups = getHeaderSearchGroups(searchQuery, searchSourceGroups);
	const menuColumnCount = isCompact
		? HEADER_MENU_CAPPED_COLUMNS
		: HEADER_MENU_DEFAULT_COLUMNS;
	const activeMenuGroups = isSearchActive ? searchGroups : menuGroups;
	const menuContentHeight = getMenuContentHeight(
		activeMenuGroups,
		menuColumnCount,
	);
	const showHeaderSurface = isScrolled || isMenuOpen;
	const motionAllowed = useMotionAllowed(true);
	const headerTransition: Transition = motionAllowed
		? spring.macro
		: instantTransition;
	const menuTransition: Transition = motionAllowed
		? spring.component
		: instantTransition;
	const shouldAnimateEntrance = animateEntrance && motionAllowed;

	const closeMenu = () => {
		setSearchQuery("");
		setIsMenuOpen(false);
	};

	const toggleMenu = () => {
		if (isMenuOpen) {
			closeMenu();
			return;
		}

		setIsMenuOpen(true);
	};

	const handleSearchQueryChange = (value: string) => {
		setSearchQuery(value);

		if (value.trim().length > 0) {
			setIsMenuOpen(true);
		}
	};

	useEffect(() => {
		if (!isMenuOpen) return;

		function handlePointerDown(event: PointerEvent) {
			const target = event.target;

			if (!(target instanceof Node)) return;
			if (headerRef.current?.contains(target)) return;

			setSearchQuery("");
			setIsMenuOpen(false);
		}

		document.addEventListener("pointerdown", handlePointerDown);

		return () => {
			document.removeEventListener("pointerdown", handlePointerDown);
		};
	}, [isMenuOpen]);

	return (
		<motion.header
			ref={headerRef}
			initial={shouldAnimateEntrance ? HEADER_ENTRANCE_HIDDEN : false}
			animate={
				shouldAnimateEntrance
					? entranceReady
						? HEADER_ENTRANCE_VISIBLE
						: HEADER_ENTRANCE_HIDDEN
					: undefined
			}
			transition={headerTransition}
			className={clsx(
				"pointer-events-none fixed inset-x-0 top-0 z-50 overflow-hidden px-section-x",
				className,
			)}
		>
			<motion.div
				aria-hidden="true"
				className="pointer-events-none absolute inset-0 border-b border-border bg-background"
				initial={false}
				animate={{ opacity: showHeaderSurface ? 1 : 0 }}
				transition={headerTransition}
			/>
			<div className="relative mx-auto flex w-full max-w-section-max flex-col">
				<motion.div
					className="flex w-full items-center justify-between gap-6"
					initial={false}
					animate={{
						height: isCompact ? HEADER_COMPACT_HEIGHT : HEADER_EXPANDED_HEIGHT,
					}}
					transition={headerTransition}
				>
					<div className="flex min-w-[180px] items-center">
						<motion.div
							className="origin-left"
							initial={false}
							animate={{ scale: isCompact ? 0.88 : 1 }}
							transition={headerTransition}
						>
							<Logo size="md" className="pointer-events-auto" />
						</motion.div>
					</div>
					<nav
						className="pointer-events-auto flex items-center justify-center text-foreground"
						aria-label="Primary navigation"
					>
						<motion.div
							className="flex items-center justify-center gap-6 overflow-hidden py-2"
							initial={false}
							animate={{
								width: areTopNavLinksVisible ? "auto" : 0,
								opacity: areTopNavLinksVisible ? 1 : 0,
							}}
							transition={headerTransition}
							aria-hidden={!areTopNavLinksVisible}
						>
							{topNavLinks.map((item, index) => (
								<HeaderTopNavLink
									key={\`\${item.label}-\${getMarketingLinkHref(item)}\`}
									link={item}
									className={
										index === topNavLinks.length - 1 ? "mr-6" : undefined
									}
								/>
							))}
						</motion.div>
						<HeaderSearchInput
							value={searchQuery}
							onValueChange={handleSearchQueryChange}
							onClear={closeMenu}
							ariaLabel={search.ariaLabel}
							clearLabel={search.clearLabel}
						/>
						<Button
							variant="ghost"
							className="min-h-10 px-3 text-foreground hover:bg-background-hover"
							aria-controls={menuId}
							aria-expanded={isMenuOpen}
							aria-label={
								isMenuOpen ? mobile.closeAriaLabel : mobile.openAriaLabel
							}
							onClick={toggleMenu}
							leadingIcon={
								<HeaderMenuIcon
									name={isMenuOpen ? "close" : "menu"}
									className="text-foreground"
								/>
							}
						/>
					</nav>
					<div className="pointer-events-auto flex min-w-[180px] justify-end">
						<Button href={getMarketingLinkHref(layout.cta)} variant="primary">
							{layout.cta.label}
						</Button>
					</div>
				</motion.div>
				<AnimatePresence initial={false}>
					{isMenuOpen ? (
						<motion.div
							id={menuId}
							initial={{ height: 0, opacity: 0 }}
							animate={{ height: "auto", opacity: 1 }}
							exit={{ height: 0, opacity: 0 }}
							transition={menuTransition}
							className="pointer-events-auto overflow-hidden"
						>
							<div
								className="w-full border-t border-border"
								style={{
									paddingTop: HEADER_MENU_TOP_PADDING,
									paddingBottom: HEADER_MENU_BOTTOM_PADDING,
								}}
							>
								<motion.div
									className="relative overflow-hidden"
									initial={false}
									animate={{ height: menuContentHeight }}
									transition={menuTransition}
								>
									<div className="absolute inset-0">
										{isSearchActive ? (
											<HeaderSearchResults
												groups={searchGroups}
												onNavigate={closeMenu}
												columnCount={menuColumnCount}
												noResultsText={search.noResultsText}
											/>
										) : (
											<HeaderMenuGrid
												groups={menuGroups}
												onNavigate={closeMenu}
												columnCount={menuColumnCount}
											/>
										)}
									</div>
								</motion.div>
							</div>
						</motion.div>
					) : null}
				</AnimatePresence>
			</div>
		</motion.header>
	);
}

`,
	},
	{
		path: "src/app/(site)/(marketing)/_components/layout/HeaderMenuContent.tsx",
		content: `"use client";

import clsx from "clsx";
import { useId } from "react";
import { Button } from "@/components/ui/primitives/Button";
import {
	InputFrame,
	inputTextClasses,
} from "@/components/ui/primitives/InputFrame";
import { Text } from "@/components/ui/primitives/Text";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type {
	HeaderIconName,
	MarketingLink,
	MarketingMenuGroup,
} from "@/lib/marketing-content/types";

const HEADER_MENU_TITLE_LINE_HEIGHT = 24;
const HEADER_MENU_LINK_LINE_HEIGHT = 20;
const HEADER_MENU_TITLE_LINK_GAP = 12;
const HEADER_MENU_LINK_GAP = 10;
const HEADER_MENU_GRID_ROW_GAP = 32;
export const HEADER_MENU_DEFAULT_COLUMNS = 4;
export const HEADER_MENU_CAPPED_COLUMNS = 3;

function HeaderIcon({
	className,
	name,
}: {
	className?: string;
	name: HeaderIconName;
}) {
	if (name === "search") {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className={clsx("size-4", className)}
			>
				<path
					d="m20 20-4.5-4.5m2-5A7 7 0 1 1 3.5 10.5a7 7 0 0 1 14 0Z"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeLinejoin="round"
					strokeWidth="1.8"
				/>
			</svg>
		);
	}

	if (name === "close") {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className={clsx("size-5", className)}
			>
				<path
					d="m6 6 12 12M18 6 6 18"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeWidth="1.9"
				/>
			</svg>
		);
	}

	if (name === "menu") {
		return (
			<svg
				aria-hidden="true"
				viewBox="0 0 24 24"
				className={clsx("size-5", className)}
			>
				<path
					d="M5 7h14M5 12h14M5 17h14"
					fill="none"
					stroke="currentColor"
					strokeLinecap="round"
					strokeWidth="1.9"
				/>
			</svg>
		);
	}

	return (
		<span
			aria-hidden="true"
			className={clsx("size-2 rounded-full bg-current", className)}
		/>
	);
}

export function HeaderMenuIcon(props: {
	className?: string;
	name: HeaderIconName;
}) {
	return <HeaderIcon {...props} />;
}

function getLinkSearchText(link: MarketingLink) {
	return \`\${link.label} \${getMarketingLinkHref(link)}\`.toLowerCase();
}

export function getHeaderSearchGroups(
	query: string,
	sourceGroups: readonly MarketingMenuGroup[] = [],
): MarketingMenuGroup[] {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) return [];

	const groups: MarketingMenuGroup[] = [];

	for (const group of sourceGroups) {
		const groupLinkText = group.link ? getLinkSearchText(group.link) : "";
		const groupSearchText = \`\${group.label} \${groupLinkText}\`.toLowerCase();
		const groupMatches = groupSearchText.includes(normalizedQuery);
		const links = (group.links ?? []).filter((link) =>
			getLinkSearchText(link).includes(normalizedQuery),
		);

		if (!groupMatches && links.length === 0) continue;

		groups.push({
			label: group.label,
			icon: group.icon,
			link: groupMatches ? group.link : undefined,
			links: links.length > 0 ? links : undefined,
		});
	}

	return groups;
}

function getMenuGroupHeight(group: MarketingMenuGroup) {
	const linkCount = group.links?.length ?? 0;

	if (linkCount === 0) return HEADER_MENU_TITLE_LINE_HEIGHT;

	return (
		HEADER_MENU_TITLE_LINE_HEIGHT +
		HEADER_MENU_TITLE_LINK_GAP +
		linkCount * HEADER_MENU_LINK_LINE_HEIGHT +
		(linkCount - 1) * HEADER_MENU_LINK_GAP
	);
}

export function getMenuContentHeight(
	groups: readonly MarketingMenuGroup[] = [],
	columnCount: number,
): number {
	if (groups.length === 0) {
		return HEADER_MENU_LINK_LINE_HEIGHT;
	}

	const columns = Math.max(1, Math.floor(columnCount));
	let contentHeight = 0;

	for (let index = 0; index < groups.length; index += columns) {
		const rowHeights = groups
			.slice(index, index + columns)
			.map(getMenuGroupHeight);
		const rowHeight = Math.max(HEADER_MENU_LINK_LINE_HEIGHT, ...rowHeights);

		contentHeight += rowHeight;

		if (index + columns < groups.length) {
			contentHeight += HEADER_MENU_GRID_ROW_GAP;
		}
	}

	return Math.ceil(contentHeight);
}

export function HeaderSearchInput({
	ariaLabel,
	className,
	clearLabel,
	onClear,
	onValueChange,
	placeholder,
	value,
}: {
	ariaLabel: string;
	className?: string;
	clearLabel: string;
	onClear: () => void;
	onValueChange: (value: string) => void;
	placeholder?: string;
	value: string;
}) {
	const searchId = useId();
	const hasValue = value.trim().length > 0;

	return (
		<InputFrame
			className={clsx(
				"group/header-search min-h-10 gap-1 px-3 text-foreground",
				className ??
					"mr-3 w-[220px] min-w-[220px] max-w-[220px] flex-none basis-[220px]",
			)}
		>
			<HeaderIcon name="search" className="text-muted" />
			<input
				id={searchId}
				type="search"
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
				aria-label={ariaLabel}
				placeholder={placeholder}
				autoComplete="off"
				className={clsx(
					inputTextClasses,
					"min-w-0 px-1 [&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
				)}
			/>
			<Button
				type="button"
				variant="ghost"
				className={clsx(
					"min-h-8 px-2 text-xs text-muted opacity-0 transition-opacity group-hover/header-search:opacity-100 group-focus-within/header-search:opacity-100",
					!hasValue && "pointer-events-none",
				)}
				aria-label={clearLabel}
				onMouseDown={(event) => event.preventDefault()}
				onClick={onClear}
			>
				{clearLabel}
			</Button>
		</InputFrame>
	);
}

export function HeaderMenuNoResults({
	className,
	noResultsText,
}: {
	className?: string;
	noResultsText: string;
}) {
	return (
		<Text as="p" variant="support" tone="muted" className={className}>
			{noResultsText}
		</Text>
	);
}

export function HeaderSearchResults({
	columnCount,
	groups,
	noResultsText,
	onNavigate,
}: {
	columnCount: number;
	groups: readonly MarketingMenuGroup[];
	noResultsText: string;
	onNavigate: () => void;
}) {
	if (groups.length === 0) {
		return <HeaderMenuNoResults noResultsText={noResultsText} />;
	}

	return (
		<HeaderMenuGrid
			groups={groups}
			onNavigate={onNavigate}
			columnCount={columnCount}
		/>
	);
}

export function HeaderMenuGroup({
	className,
	group,
	onNavigate,
}: {
	className?: string;
	group: MarketingMenuGroup;
	onNavigate?: () => void;
}) {
	const hasLinks = Boolean(group.links?.length);
	const groupHref = group.link ? getMarketingLinkHref(group.link) : undefined;

	return (
		<div className={clsx("flex min-w-0 flex-col items-start gap-3", className)}>
			{groupHref ? (
				<Button
					href={groupHref}
					variant="ghost"
					className="w-fit justify-start px-0 text-foreground hover:bg-transparent"
					leadingIcon={
						group.icon ? (
							<HeaderIcon name={group.icon} className="text-foreground" />
						) : undefined
					}
					onClick={onNavigate}
				>
					{group.label}
				</Button>
			) : (
				<span className="flex items-center gap-2 text-sm font-medium text-foreground">
					{group.icon ? (
						<HeaderIcon name={group.icon} className="text-foreground" />
					) : null}
					{group.label}
				</span>
			)}
			{hasLinks ? (
				<div className="flex min-w-0 flex-col items-start gap-2">
					{group.links?.map((item) => (
						<Button
							key={\`\${item.label}-\${getMarketingLinkHref(item)}\`}
							href={getMarketingLinkHref(item)}
							variant="ghost"
							className="min-h-0 w-fit justify-start px-0 py-0 text-sm font-normal text-muted hover:bg-transparent hover:text-foreground"
							onClick={onNavigate}
						>
							{item.label}
						</Button>
					))}
				</div>
			) : null}
		</div>
	);
}

export function HeaderMenuGrid({
	className,
	columnCount,
	groups,
	onNavigate,
}: {
	className?: string;
	columnCount: number;
	groups: readonly MarketingMenuGroup[];
	onNavigate?: () => void;
}) {
	const gridColumnClassName =
		columnCount === HEADER_MENU_CAPPED_COLUMNS
			? "md:grid-cols-3"
			: "lg:grid-cols-4";

	return (
		<div
			className={clsx(
				"grid w-full grid-cols-1 gap-x-8 gap-y-8 sm:grid-cols-2",
				gridColumnClassName,
				className,
			)}
		>
			{groups.map((group) => (
				<HeaderMenuGroup
					key={group.label}
					group={group}
					onNavigate={onNavigate}
				/>
			))}
		</div>
	);
}

`,
	},
];

export const THIN_START_REMOVE_PATHS = [
	"src/app/(site)/(auth)",
	"src/app/(site)/_components/settings",
	"src/app/(site)/dashboard",
	"src/app/(site)/(marketing)/settings",
	"src/app/(site)/(marketing)/internal/airbnb-pop",
	"src/app/(site)/(marketing)/internal/demo",
	"src/app/(site)/(marketing)/internal/dictionary",
	"src/app/(site)/(marketing)/internal/playground",
	"src/app/(site)/(marketing)/internal/reference",
	"src/app/(site)/(marketing)/_components/layout/MarketingContentSearch.tsx",
	"src/app/(site)/(marketing)/_components/providers",
	"src/components/domain/search",
	"src/components/ui/helpers",
	"src/components/ui/icons",
	"src/components/ui/misc",
	"src/components/ui/time",
	"src/components/ui/input/choice",
	"src/components/ui/input/files",
	"src/components/ui/input/ComboboxMultiSelectInput.tsx",
	"src/components/ui/input/ComboboxTextInput.tsx",
	"src/components/ui/input/DateRangeInput.tsx",
	"src/components/ui/input/EditableTextInput.tsx",
	"src/components/ui/input/EmailInput.tsx",
	"src/components/ui/input/MultiselectInput.tsx",
	"src/components/ui/input/NumberInput.tsx",
	"src/components/ui/input/PasswordInput.tsx",
	"src/components/ui/input/PhoneInput.tsx",
	"src/components/ui/input/ProfilePictureInput.tsx",
	"src/components/ui/input/RadioInput.tsx",
	"src/components/ui/input/SignaturePad.tsx",
	"src/components/ui/input/SliderInput.tsx",
	"src/components/ui/input/SpamProtectionFields.tsx",
	"src/components/ui/input/TextAreaInput.tsx",
	"src/components/ui/input/ToggleInput.tsx",
	"src/components/ui/input/UnitNumberInput.tsx",
	"src/components/ui/primitives/Divider.tsx",
	"src/components/ui/primitives/Panel.tsx",
];
