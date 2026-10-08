"use client";

import {
	ArrowSquareOut,
	PencilSimpleIcon,
	Trash,
	Warning,
} from "@phosphor-icons/react";
import clsx from "clsx";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "../Button";
import Divider from "../Divider";
import {
	dropdownCompactOptionClassName,
	dropdownListClassName,
	dropdownListWrapperClassName,
	getDropdownDividerClassName,
	getDropdownOptionClassName,
} from "../dropdownStyles";
import type { ListboxOption } from "../Listbox";
import { DropdownCollection } from "./DropdownCollection";
import { DropdownRoot } from "./DropdownRoot";
import type {
	DropdownControlEntry,
	DropdownIcon,
	DropdownListboxProps,
	DropdownMenuEvent,
	DropdownMenuOption,
	DropdownMenuProps,
} from "./types";

const warnedMenuCycles = new WeakSet<object>();

function renderDropdownIcon(icon?: DropdownIcon) {
	return icon ?? null;
}

function warnMenuCycle(option: DropdownMenuOption) {
	if (process.env.NODE_ENV === "production" || warnedMenuCycles.has(option)) {
		return;
	}
	warnedMenuCycles.add(option);
	console.warn(
		"Dropdown.Menu omitted a recursive option that repeats an ancestor object.",
		option,
	);
}

function renderMenuOptionContent(option: DropdownMenuOption, compact = false) {
	return (
		<>
			{option.leadingIcon ? (
				<span className="flex shrink-0 items-center">
					{renderDropdownIcon(option.leadingIcon)}
				</span>
			) : null}
			<span
				className={clsx(
					"min-w-0 flex-1",
					option.layout === "presentation"
						? "overflow-visible whitespace-normal"
						: compact
							? "truncate text-xs"
							: "truncate text-sm",
					option.tone === "danger" || option.tone === "warning"
						? "text-inherit"
						: option.active
							? "text-foreground"
							: "text-foreground/80",
					option.textClassName,
				)}
			>
				{option.label}
			</span>
			{option.trailingIcon ? (
				<span className="flex shrink-0 items-center">
					{renderDropdownIcon(option.trailingIcon)}
				</span>
			) : null}
		</>
	);
}

function toMenuListboxOptions(
	options: DropdownMenuOption[],
	ancestors = new Set<DropdownMenuOption>(),
	compact = false,
): ListboxOption<DropdownMenuOption>[] {
	const defaultOptions = options.filter(
		(option) => option.tone !== "warning" && option.tone !== "danger",
	);
	const warningOptions = options.filter((option) => option.tone === "warning");
	const dangerOptions = options.filter((option) => option.tone === "danger");
	const orderedOptions = [
		...defaultOptions,
		...warningOptions,
		...dangerOptions,
	];

	return orderedOptions.flatMap((option, index) => {
		if (ancestors.has(option)) {
			warnMenuCycle(option);
			return [];
		}
		const nextAncestors = new Set(ancestors);
		nextAncestors.add(option);
		const children = option.children?.length
			? toMenuListboxOptions(option.children, nextAncestors, compact)
			: undefined;
		const startsSemanticGroup =
			index === defaultOptions.length && defaultOptions.length > 0;

		return [
			{
				children: children?.length ? children : undefined,
				className: clsx(
					option.className,
					compact && dropdownCompactOptionClassName,
				),
				content: renderMenuOptionContent(option, compact),
				disabled: option.disabled,
				dividerAfter: option.dividerAfter,
				dividerBefore:
					option.dividerBefore ?? (startsSemanticGroup ? "inset" : undefined),
				href: option.href,
				target: option.target,
				rel: option.rel,
				key: option.id ?? index,
				layout: option.layout,
				selected: option.active,
				tone: option.tone,
				value: option,
			},
		];
	});
}

export function DropdownMenu(props: DropdownMenuProps) {
	return props.options.some((option) => option.kind === "control") ? (
		<DropdownControlMenu
			{...props}
			options={props.options as DropdownControlEntry[]}
		/>
	) : (
		<DropdownActionMenu
			{...props}
			options={props.options as DropdownMenuOption[]}
		/>
	);
}

function DropdownActionMenu({
	options,
	density = "standard",
	...props
}: DropdownMenuProps & { options: DropdownMenuOption[] }) {
	const listboxOptions = React.useMemo(
		() => toMenuListboxOptions(options, undefined, density === "compact"),
		[options, density],
	);

	return (
		<DropdownCollection
			{...props}
			ariaLabel={props.ariaLabel ?? "More options"}
			defaultOpenOnHover
			defaultTriggerSize="icon-sm"
			defaultTriggerVariant="bare"
			onSelectOption={(option, event) => {
				option.value.onSelect?.(event);
				if (option.href && event.type === "keydown") {
					if (option.value.target === "_blank")
						window.open(option.href, "_blank", "noopener,noreferrer");
					else window.location.assign(option.href);
				}
				return option.value.closeOnSelect !== false;
			}}
			optionClassName={clsx("text-left", props.optionClassName)}
			optionRole="menuitem"
			options={listboxOptions}
			role="menu"
			triggerContent={
				props.triggerContent ?? <Icon name="ellipsis-vertical" size="md" />
			}
		/>
	);
}

export function DropdownListbox<T>({
	onSelect,
	options,
	...props
}: DropdownListboxProps<T>) {
	return (
		<DropdownCollection
			{...props}
			defaultOpenOnHover={false}
			defaultTriggerSize="md"
			defaultTriggerVariant="secondary"
			onSelectOption={(option, event) => {
				onSelect(option.value, option, event);
			}}
			options={options}
			role="listbox"
		/>
	);
}

type DropdownMenuFactoryHandler = (event: DropdownMenuEvent) => void;

export const dropdownMenuOptions = {
	delete({
		disabled,
		label = "Delete",
		onSelect,
	}: {
		disabled?: boolean;
		label?: React.ReactNode;
		onSelect?: DropdownMenuFactoryHandler;
	}): DropdownMenuOption {
		return {
			disabled,
			id: "delete",
			label,
			leadingIcon: <Trash aria-hidden size={12} />,
			onSelect,
			tone: "danger",
		};
	},
	edit({
		disabled,
		onSelect,
	}: {
		disabled?: boolean;
		onSelect: DropdownMenuFactoryHandler;
	}): DropdownMenuOption {
		return {
			disabled,
			id: "edit",
			label: "Edit",
			leadingIcon: <PencilSimpleIcon aria-hidden size={12} />,
			onSelect,
		};
	},
	open({
		href,
		leadingIcon,
	}: {
		href: string;
		leadingIcon?: DropdownIcon;
	}): DropdownMenuOption {
		return {
			href,
			id: "open",
			label: "Open",
			leadingIcon: leadingIcon ?? <ArrowSquareOut aria-hidden size={12} />,
		};
	},
	warning({
		disabled,
		label = "Warning",
		onSelect,
	}: {
		disabled?: boolean;
		label?: React.ReactNode;
		onSelect?: DropdownMenuFactoryHandler;
	}): DropdownMenuOption {
		return {
			disabled,
			id: "warning",
			label,
			leadingIcon: <Warning aria-hidden size={12} />,
			onSelect,
			tone: "warning",
		};
	},
};

function DropdownControlMenu({
	options,
	density = "standard",
	ariaLabel,
	triggerButtonProps,
	triggerContent,
	listClassName,
	menuContentClassName,
	optionClassName,
	optionActiveClassName: _optionActiveClassName,
	openOnHover = true,
	pinOnClick = true,
	...props
}: DropdownMenuProps & { options: DropdownControlEntry[] }) {
	const id = React.useId();
	const compact = density === "compact";
	// Preserve control placement while keeping semantic actions ordered last.
	const ordered = [
		...options.filter(
			(o) => o.kind === "control" || !o.tone || o.tone === "default",
		),
		...options.filter((o) => o.kind !== "control" && o.tone === "warning"),
		...options.filter((o) => o.kind !== "control" && o.tone === "danger"),
	];
	return (
		<DropdownRoot
			{...props}
			openOnHover={openOnHover}
			pinOnClick={pinOnClick}
			keepOpenWhileFocusWithin
			renderTrigger={(trigger) => (
				<Button
					{...triggerButtonProps}
					ref={trigger.ref}
					aria-label={ariaLabel}
					aria-haspopup="dialog"
					aria-controls={trigger.isOpen ? id : undefined}
					aria-expanded={trigger.isOpen}
					disabled={props.disabled}
					size={triggerButtonProps?.size ?? "icon-sm"}
					variant={triggerButtonProps?.variant ?? "bare"}
					onMouseEnter={trigger.onRootMouseEnter}
					onMouseLeave={trigger.onRootMouseLeave}
					onClick={trigger.onRightClick}
					onKeyDown={(event) => {
						if (["Enter", " ", "ArrowDown", "ArrowUp"].includes(event.key)) {
							event.preventDefault();
							trigger.openMenu({ focusMenu: true, pin: true });
						}
					}}
				>
					{triggerContent ?? <Icon name="ellipsis-vertical" size="md" />}
				</Button>
			)}
			renderMenu={({ close }) => (
				<div
					id={id}
					role="dialog"
					aria-label={ariaLabel}
					className={clsx(dropdownListWrapperClassName, menuContentClassName)}
				>
					<div className={clsx(dropdownListClassName, listClassName)}>
						{ordered.map((option, index) => {
							const previous = ordered[index - 1];
							const semanticBoundary =
								option.kind !== "control" &&
								option.tone &&
								option.tone !== "default" &&
								(previous?.kind === "control" ||
									!previous?.tone ||
									previous.tone === "default");
							const boundary =
								option.dividerBefore ??
								previous?.dividerAfter ??
								(semanticBoundary ? "inset" : undefined);
							return (
								<React.Fragment key={option.id ?? index}>
									{index > 0 && boundary && (
										<Divider
											className={getDropdownDividerClassName(boundary)}
										/>
									)}
									{option.kind === "control" ? (
										<fieldset
											aria-label={option.ariaLabel}
											disabled={props.disabled}
											className={clsx(
												"flex min-w-0 items-center justify-between gap-2 px-2.5",
												compact ? "h-7 text-xs" : "min-h-[34px] text-sm",
											)}
										>
											{option.content}
										</fieldset>
									) : (
										<Button
											variant="bare"
											size={compact ? "compact" : "md"}
											align="left"
											href={option.href}
											target={option.target}
											rel={option.rel}
											disabled={props.disabled || option.disabled}
											className={clsx(
												getDropdownOptionClassName({
													selected: option.active,
													disabled: props.disabled || option.disabled,
													layout: option.layout,
													tone: option.tone,
												}),
												compact && dropdownCompactOptionClassName,
												optionClassName,
												option.className,
											)}
											onClick={(event: React.MouseEvent<HTMLElement>) => {
												option.onSelect?.(event);
												if (option.closeOnSelect !== false) close();
											}}
										>
											{renderMenuOptionContent(option, compact)}
										</Button>
									)}
								</React.Fragment>
							);
						})}
					</div>
				</div>
			)}
		/>
	);
}
