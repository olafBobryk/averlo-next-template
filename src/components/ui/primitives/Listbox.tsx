// components/ui/primitives/Listbox.tsx
"use client";

import * as React from "react";
import clsx from "clsx";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";
import {
	dropdownEmptyStateClassName,
	dropdownListClassName,
	dropdownListWrapperClassName,
	getDropdownOptionClassName,
} from "@/components/ui/primitives/dropdownStyles";

export type ListboxOption<T> = {
	key?: React.Key;
	value: T;
	content: React.ReactNode;
	href?: string;
	disabled?: boolean;
	selected?: boolean;
	className?: string;
	activeClassName?: string;
	selectedClassName?: string;
	disabledClassName?: string;
	unwrapped?: boolean;
};

type ListboxProps<T> = {
	options: ListboxOption<T>[];
	activeIndex?: number;
	onActiveIndexChange?: (index: number) => void;
	onSelect?: (
		option: ListboxOption<T>,
		index: number,
		event: React.MouseEvent<HTMLElement>,
	) => void;
	emptyState?: React.ReactNode;
	listRef?: React.Ref<HTMLDivElement>;
	listId?: string;
	optionIdPrefix?: string;
	listTabIndex?: number;
	ariaActivedescendant?: string;
	onKeyDown?: React.KeyboardEventHandler<HTMLDivElement>;
	onFocus?: React.FocusEventHandler<HTMLDivElement>;
	className?: string;
	listClassName?: string;
	optionClassName?: string;
	optionActiveClassName?: string;
	optionSelectedClassName?: string;
	optionDisabledClassName?: string;
	role?: "listbox" | "menu";
	optionRole?: "option" | "menuitem";
	multiselectable?: boolean;
	disabled?: boolean;
};

export function Listbox<T>({
	options,
	activeIndex,
	onActiveIndexChange,
	onSelect,
	emptyState,
	listRef,
	listId,
	optionIdPrefix,
	listTabIndex,
	ariaActivedescendant,
	onKeyDown,
	onFocus,
	className,
	listClassName,
	optionClassName,
	optionActiveClassName,
	optionSelectedClassName,
	optionDisabledClassName,
	role = "listbox",
	optionRole = "option",
	multiselectable,
	disabled,
}: ListboxProps<T>) {
	const resolvedEmpty =
		emptyState ?? (
			<Text variant="body">No results</Text>
		);

	return (
		<div
			ref={listRef}
			id={listId}
			role={role}
			tabIndex={listTabIndex}
			aria-activedescendant={ariaActivedescendant}
			aria-multiselectable={
				role === "listbox" && multiselectable ? true : undefined
			}
			onKeyDown={onKeyDown}
			onFocus={onFocus}
			className={clsx(dropdownListWrapperClassName, className)}
		>
			{options.length === 0 ? (
				<div className={dropdownEmptyStateClassName}>{resolvedEmpty}</div>
			) : (
				<div className={clsx(dropdownListClassName, listClassName)}>
					{options.map((option, index) => {
						const isActive = activeIndex === index;
						const isSelected = Boolean(option.selected);
						const isDisabled = Boolean(disabled || option.disabled);
						const optionId = optionIdPrefix
							? `${optionIdPrefix}-${index}`
							: undefined;
						const resolvedOptionClassName = [
							optionClassName,
							option.className,
						]
							.filter(Boolean)
							.join(" ");
						const resolvedActiveClassName = [
							optionActiveClassName,
							option.activeClassName,
						]
							.filter(Boolean)
							.join(" ");
						const resolvedSelectedClassName = [
							optionSelectedClassName,
							option.selectedClassName,
						]
							.filter(Boolean)
							.join(" ");
						const resolvedDisabledClassName = [
							optionDisabledClassName,
							option.disabledClassName,
						]
							.filter(Boolean)
							.join(" ");

						const optionClasses = getDropdownOptionClassName({
							active: isActive,
							selected: isSelected,
							disabled: isDisabled,
							className: resolvedOptionClassName,
							activeClassName: resolvedActiveClassName,
							selectedClassName: resolvedSelectedClassName,
							disabledClassName: resolvedDisabledClassName,
						});

						if (option.unwrapped) {
							return (
								<div
									key={option.key ?? `${index}`}
									data-option-index={index}
									id={optionId}
									role={optionRole}
									aria-selected={
										optionRole === "option" ? isSelected : undefined
									}
									aria-disabled={isDisabled ? true : undefined}
									tabIndex={-1}
									className={optionClasses}
									onMouseDown={(event) => {
										const target = event.target as HTMLElement;
										if (
											target.closest(
												"input,textarea,select,button,[role=\"button\"]",
											)
										) {
											return;
										}
										event.preventDefault();
									}}
									onMouseEnter={() => {
										if (!isDisabled) onActiveIndexChange?.(index);
									}}
									onClick={(event) => {
										if (isDisabled) {
											event.preventDefault();
											return;
										}
										const target = event.target as HTMLElement;
										if (
											target.closest(
												"input,textarea,select,button,[role=\"button\"]",
											)
										) {
											return;
										}
										onSelect?.(option, index, event);
									}}
								>
									{option.content}
								</div>
							);
						}

						return (
							<Button
								key={option.key ?? `${index}`}
								href={option.href}
								data-option-index={index}
								id={optionId}
								role={optionRole}
								aria-selected={
									optionRole === "option" ? isSelected : undefined
								}
								aria-disabled={isDisabled ? true : undefined}
								tabIndex={-1}
								disabled={optionRole === "menuitem" ? undefined : isDisabled}
								variant="ghost"
								align="left"
								size="md"
								className={optionClasses}
								onMouseDown={(event: React.MouseEvent<HTMLElement>) => {
									event.preventDefault();
								}}
								onMouseEnter={() => {
									if (!isDisabled) onActiveIndexChange?.(index);
								}}
								onClick={(event: React.MouseEvent<HTMLElement>) => {
									if (isDisabled) {
										event.preventDefault();
										return;
									}
									onSelect?.(option, index, event);
								}}
							>
								{option.content}
							</Button>
						);
					})}
				</div>
			)}
		</div>
	);
}
