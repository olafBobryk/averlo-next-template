"use client";

import clsx from "clsx";
import { motion, type Transition } from "motion/react";
import { useId } from "react";
import { spring } from "@/components/ui/foundations/spring";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";
import { Text } from "@/components/ui/primitives/Text";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { getMarketingLinkHref } from "@/lib/marketing-content/links";
import type {
	MarketingLink,
	MarketingMenuGroup,
} from "@/lib/marketing-content/types";

const HEADER_MENU_TITLE_LINE_HEIGHT = 21;
const HEADER_MENU_LINK_LINE_HEIGHT = 17;
const HEADER_MENU_TITLE_LINK_GAP = 12;
const HEADER_MENU_LINK_GAP = 10;
const HEADER_MENU_GRID_ROW_GAP = 32;
export const HEADER_MENU_DEFAULT_COLUMNS = 6;
export const HEADER_MENU_CAPPED_COLUMNS = 5;

function getLinkSearchText(link: MarketingLink) {
	return `${link.label} ${getMarketingLinkHref(link)}`.toLowerCase();
}

export function getHeaderSearchGroups(
	query: string,
	sourceGroups: readonly MarketingMenuGroup[],
): MarketingMenuGroup[] {
	const normalizedQuery = query.trim().toLowerCase();

	if (!normalizedQuery) return [];

	const groups: MarketingMenuGroup[] = [];

	for (const group of sourceGroups) {
		const groupLinkText = group.link ? getLinkSearchText(group.link) : "";
		const groupSearchText = `${group.label} ${groupLinkText}`.toLowerCase();
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
	groups: readonly MarketingMenuGroup[],
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
	value,
	onValueChange,
	onClear,
	ariaLabel,
	clearLabel,
	placeholder,
	className,
}: {
	value: string;
	onValueChange: (value: string) => void;
	onClear: () => void;
	ariaLabel: string;
	clearLabel: string;
	placeholder?: string;
	className?: string;
}) {
	const searchId = useId();
	const hasValue = value.trim().length > 0;
	const motionAllowed = useMotionAllowed(true);
	const iconTransition: Transition = motionAllowed
		? spring.micro
		: { duration: 0 };

	return (
		<InputFrame
			size="sm"
			className={
				className ??
				"group/header-search mr-3 w-[220px] min-w-[220px] max-w-[220px] flex-none basis-[220px] text-foreground"
			}
			contentClassName="relative flex items-center"
			end={
				<Button
					type="button"
					variant="ghost"
					size="sm"
					textVariant="menu-description"
					textTone="muted"
					className={clsx(
						"pointer-events-none opacity-0 transition-opacity motion-micro group-hover/header-search:pointer-events-auto group-focus-within/header-search:pointer-events-auto",
						hasValue
							? "group-hover/header-search:opacity-100 group-focus-within/header-search:opacity-100"
							: undefined,
					)}
					contentClassName="w-fit"
					aria-label={clearLabel}
					onMouseDown={(event) => event.preventDefault()}
					onClick={onClear}
				>
					{clearLabel}
				</Button>
			}
		>
			<motion.span
				aria-hidden="true"
				className="pointer-events-none absolute start-0 flex size-5 items-center justify-center text-muted"
				initial={false}
				animate={{
					x: hasValue ? -8 : 0,
					opacity: hasValue ? 0 : 1,
					scale: hasValue ? 0.86 : 1,
				}}
				transition={iconTransition}
			>
				<Icon name="search" className="size-full" />
			</motion.span>
			<input
				id={searchId}
				type="search"
				value={value}
				onChange={(event) => onValueChange(event.target.value)}
				aria-label={ariaLabel}
				placeholder={placeholder}
				autoComplete="off"
				className={clsx(
					inputVariants({ size: "sm" }),
					hasValue ? undefined : "ps-7",
					"[&::-webkit-search-cancel-button]:appearance-none [&::-webkit-search-decoration]:appearance-none",
				)}
			/>
		</InputFrame>
	);
}

export function HeaderMenuNoResults({
	noResultsText,
	className,
}: {
	noResultsText: string;
	className?: string;
}) {
	return (
		<Text
			as="p"
			variant="menu-description"
			tone="inherit"
			className={clsx("text-foreground/50", className)}
			interactive={false}
		>
			{noResultsText}
		</Text>
	);
}

export function HeaderSearchResults({
	groups,
	onNavigate,
	columnCount,
	noResultsText,
}: {
	groups: readonly MarketingMenuGroup[];
	onNavigate: () => void;
	columnCount: number;
	noResultsText: string;
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
	group,
	onNavigate,
	focusable = true,
	className,
}: {
	group: MarketingMenuGroup;
	onNavigate?: () => void;
	focusable?: boolean;
	className?: string;
}) {
	const hasLinks = Boolean(group.links?.length);
	const groupHref = group.link ? getMarketingLinkHref(group.link) : undefined;

	return (
		<div className={clsx("flex min-w-0 flex-col items-start gap-3", className)}>
			{groupHref ? (
				<Button
					href={groupHref}
					variant="ghost"
					align="left"
					textVariant="menu-title"
					textTone="inherit"
					className="w-fit text-foreground hover:!text-foreground active:!text-foreground"
					contentClassName="w-fit"
					focusable={focusable}
					leadingIcon={
						group.icon ? (
							<Icon
								name={group.icon}
								size="md"
								className="text-foreground"
								weight="fill"
							/>
						) : undefined
					}
					onClick={onNavigate}
				>
					{group.label}
				</Button>
			) : (
				<span className="flex items-center gap-[10px] text-foreground">
					{group.icon ? (
						<Icon
							name={group.icon}
							size="md"
							className="text-foreground"
							weight="fill"
						/>
					) : null}
					<Text
						as="span"
						variant="menu-title"
						tone="inherit"
						interactive={false}
					>
						{group.label}
					</Text>
				</span>
			)}
			{hasLinks ? (
				<div className="flex min-w-0 flex-col items-start gap-[10px]">
					{group.links?.map((item) => (
						<Button
							key={`${item.label}-${getMarketingLinkHref(item)}`}
							href={getMarketingLinkHref(item)}
							variant="ghost"
							size="sm"
							align="left"
							textVariant="menu-description"
							textTone="inherit"
							className="w-fit text-foreground/50 hover:!text-foreground/50 active:!text-foreground/50"
							contentClassName="w-fit"
							focusable={focusable}
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
	groups,
	onNavigate,
	focusable = true,
	columnCount,
	className,
}: {
	groups: readonly MarketingMenuGroup[];
	onNavigate?: () => void;
	focusable?: boolean;
	columnCount: number;
	className?: string;
}) {
	const gridColumnClassName =
		columnCount === HEADER_MENU_CAPPED_COLUMNS ? "grid-cols-5" : "grid-cols-6";

	return (
		<div className={clsx("grid w-full gap-8", gridColumnClassName, className)}>
			{groups.map((group) => (
				<HeaderMenuGroup
					key={group.label}
					group={group}
					onNavigate={onNavigate}
					focusable={focusable}
				/>
			))}
		</div>
	);
}
