"use client";

import clsx from "clsx";
import * as React from "react";
import { Button } from "@/components/ui/primitives/Button";
import { Dropdown } from "@/components/ui/primitives/Dropdown";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { Listbox } from "@/components/ui/primitives/Listbox";

type IconProp = React.ReactNode | IconName;

export type MoreMenuOption = {
	id?: string;
	label: React.ReactNode;
	leadingIcon?: IconProp;
	trailingIcon?: IconProp;
	href?: string;
	onClick?: (event: React.MouseEvent<HTMLElement>) => void;
	disabled?: boolean;
	active?: boolean;
	className?: string;
	textClassName?: string;
};

type MoreMenuDropdownProps = {
	options: MoreMenuOption[];
	disabled?: boolean;
	ariaLabel?: string;
	className?: string;
	buttonClassName?: string;
	menuClassName?: string;
	menuContentClassName?: string;
	optionClassName?: string;
	optionActiveClassName?: string;
	portalTargetId?: string;
	align?: "start" | "end";
	offset?: number;
	menuWidth?: number | "trigger";
	menuMinWidth?: number;
	openOnHover?: boolean;
	pinOnClick?: boolean;
};

function renderIcon(icon?: IconProp) {
	if (!icon) return null;
	if (typeof icon === "string") {
		return <Icon name={icon as IconName} size="sm" />;
	}
	return icon;
}

export function MoreMenuDropdown({
	options,
	disabled,
	ariaLabel = "More options",
	buttonClassName,
	menuClassName,
	menuContentClassName,
	optionClassName,
	optionActiveClassName,
	portalTargetId,
	align = "start",
	offset,
	menuWidth,
	menuMinWidth,
	openOnHover = true,
	pinOnClick = false,
}: MoreMenuDropdownProps) {
	const resolvedMenuWidth = menuWidth ?? menuMinWidth ?? 220;
	const [menuOpen, setMenuOpen] = React.useState(false);
	const [activeIndex, setActiveIndex] = React.useState(0);
	const listRef = React.useRef<HTMLDivElement | null>(null);

	const enabledIndices = React.useMemo(
		() =>
			options
				.map((option, index) => ({ option, index }))
				.filter(({ option }) => !option.disabled)
				.map(({ index }) => index),
		[options],
	);

	const getNextEnabledIndex = React.useCallback(
		(current: number, direction: 1 | -1) => {
			if (enabledIndices.length === 0) return 0;
			const currentPos = enabledIndices.indexOf(current);
			const nextPos =
				currentPos === -1
					? direction === 1
						? 0
						: enabledIndices.length - 1
					: (currentPos + direction + enabledIndices.length) %
						enabledIndices.length;
			return enabledIndices[nextPos] ?? enabledIndices[0] ?? 0;
		},
		[enabledIndices],
	);

	const syncActiveIndex = React.useCallback(() => {
		if (enabledIndices.length === 0) {
			setActiveIndex(0);
			return;
		}
		const explicitActive = options.findIndex((option) => option.active);
		if (explicitActive >= 0 && !options[explicitActive]?.disabled) {
			setActiveIndex(explicitActive);
			return;
		}
		setActiveIndex(enabledIndices[0] ?? 0);
	}, [enabledIndices, options]);

	React.useEffect(() => {
		if (menuOpen) syncActiveIndex();
	}, [menuOpen, syncActiveIndex]);

	React.useEffect(() => {
		if (!menuOpen) return;
		const option = listRef.current?.querySelector<HTMLElement>(
			`[data-option-index="${activeIndex}"]`,
		);
		option?.scrollIntoView({ block: "nearest" });
	}, [activeIndex, menuOpen]);

	return (
		<Dropdown
			portalTargetId={portalTargetId}
			align={align}
			offset={offset}
			menuWidth={resolvedMenuWidth}
			menuMinWidth={menuMinWidth}
			menuClassName={clsx("max-w-[calc(100vw-32px)]", menuClassName)}
			disabled={disabled}
			openOnHover={openOnHover}
			pinOnClick={pinOnClick}
			autoFocusMenu={false}
			onOpenChange={setMenuOpen}
			renderTrigger={({
				ref,
				isOpen,
				onRootMouseEnter,
				onRootMouseLeave,
				onRightClick,
				openMenu,
				closeMenu,
			}) => (
				<Button
					variant="ghost"
					size="icon-sm"
					align="center"
					aria-label={ariaLabel}
					ref={ref}
					onMouseEnter={onRootMouseEnter}
					onMouseLeave={onRootMouseLeave}
					aria-haspopup="menu"
					aria-expanded={isOpen}
					disabled={disabled}
					onClick={onRightClick}
					onKeyDown={(event) => {
						if (disabled) return;
						if (event.key === "ArrowDown") {
							event.preventDefault();
							if (!isOpen) openMenu();
							setActiveIndex((current) => getNextEnabledIndex(current, 1));
							return;
						}
						if (event.key === "ArrowUp") {
							event.preventDefault();
							if (!isOpen) openMenu();
							setActiveIndex((current) => getNextEnabledIndex(current, -1));
							return;
						}
						if (event.key === "Enter") {
							event.preventDefault();
							if (!isOpen) {
								openMenu();
								return;
							}
							const option = options[activeIndex];
							if (!option || option.disabled) return;
							option.onClick?.(
								event as unknown as React.MouseEvent<HTMLElement>,
							);
							if (option.href && typeof window !== "undefined") {
								window.location.href = option.href;
							}
							closeMenu({ restoreFocus: false });
						}
						if (event.key === "Escape" && isOpen) {
							event.preventDefault();
							closeMenu({ restoreFocus: false });
						}
					}}
					className={clsx(buttonClassName)}
				>
					<Icon name="ellipsis-vertical" size="sm" />
				</Button>
			)}
			renderMenu={({ close }) => (
				<Listbox
					role="menu"
					optionRole="menuitem"
					className={menuContentClassName}
					listRef={listRef}
					options={options.map((option, index) => {
						const isActive = Boolean(option.active);
						return {
							key: option.id ?? `${index}`,
							value: option,
							href: option.href,
							disabled: option.disabled,
							selected: isActive,
							content: (
								<>
									{option.leadingIcon ? (
										<span className="flex shrink-0 items-center">
											{renderIcon(option.leadingIcon)}
										</span>
									) : null}
									<span
										className={clsx(
											"min-w-0 flex-1 truncate text-sm",
											isActive ? "text-foreground" : "text-foreground/80",
											option.textClassName,
										)}
									>
										{option.label}
									</span>
									{option.trailingIcon ? (
										<span className="flex shrink-0 items-center">
											{renderIcon(option.trailingIcon)}
										</span>
									) : null}
								</>
							),
						};
					})}
					activeIndex={activeIndex}
					onActiveIndexChange={setActiveIndex}
					disabled={disabled}
					optionClassName={clsx("text-left", optionClassName)}
					optionActiveClassName={optionActiveClassName}
					onSelect={(option, _index, event) => {
						if (disabled || option.value.disabled) {
							event.preventDefault();
							return;
						}
						option.value.onClick?.(event);
						close();
					}}
				/>
			)}
		/>
	);
}
