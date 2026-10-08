"use client";

import * as React from "react";
import { motion, useIsPresent } from "motion/react";
import { useMotionTransition } from "@/components/ui/foundations/MotionProvider";
import { useMotionDisableOverride } from "@/components/ui/foundations/motionDisableOverride";
import { useMotionAllowed } from "@/hooks/useMotionAllowed";
import { Button } from "@/components/ui/primitives/Button";
import Divider from "@/components/ui/primitives/Divider";
import { Icon } from "@/components/ui/icons/Icon";
import {
	ModalDescription,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";
import type { DashboardContextualCommand } from "./DashboardCommandContracts";
import {
	DashboardCommandTree,
	type DashboardCommandTreeNode,
	getDashboardCommandOptionId,
} from "./DashboardCommandTree";

export type DashboardCommandPaletteProps = {
	anchored?: boolean;
	activeCommandId?: string;
	commandTree: DashboardCommandTreeNode[];
	filteredCommandCount: number;
	inputRef: React.RefObject<HTMLInputElement | null>;
	onActiveCommandChange: (commandId: string) => void;
	onClearQuery: () => void;
	onExecuteCommand: (command: DashboardContextualCommand) => void;
	onInputKeyDown: (event: React.KeyboardEvent<HTMLInputElement>) => void;
	onQueryChange: (query: string) => void;
	organizationName: string;
	query: string;
};

export function DashboardCommandPalette({
	anchored = false,
	activeCommandId,
	commandTree,
	filteredCommandCount,
	inputRef,
	onActiveCommandChange,
	onClearQuery,
	onExecuteCommand,
	onInputKeyDown,
	onQueryChange,
	organizationName,
	query,
}: DashboardCommandPaletteProps) {
	const present = useIsPresent();
	const allowed = useMotionAllowed(true);
	const off = useMotionDisableOverride();
	const transition = useMotionTransition("disclosure");
	const animate = anchored && allowed && !off;
	React.useEffect(() => {
		if (activeCommandId)
			document
				.getElementById(getDashboardCommandOptionId(activeCommandId))
				?.scrollIntoView({ block: "nearest" });
	}, [activeCommandId]);
	return (
		<>
			<div className="sr-only">
				<ModalTitle>Commands</ModalTitle>
				<ModalDescription>
					{organizationName} · navigation and current-page actions
				</ModalDescription>
			</div>
			<div
				className={
					anchored ? "flex flex-col" : "flex max-h-[min(620px,82vh)] flex-col"
				}
			>
				<motion.div
					className="shrink-0"
					initial={false}
					animate={{ padding: anchored ? 8 : 12 }}
					exit={anchored ? { padding: 0 } : undefined}
					transition={animate ? transition : { duration: 0 }}
				>
					<InputFrame
						className={
							anchored
								? "!gap-2 !h-[var(--command-input-height,34px)]"
								: undefined
						}
						contentClassName="flex min-w-0 items-center"
						fullWidth
						start={
							<Icon className="!size-4 text-muted-foreground" name="search" />
						}
					>
						<input
							aria-activedescendant={
								activeCommandId
									? getDashboardCommandOptionId(activeCommandId)
									: undefined
							}
							aria-controls="dashboard-command-results"
							aria-autocomplete="list"
							aria-expanded="true"
							aria-label="Search dashboard commands"
							autoComplete="off"
							className={inputVariants({
								hasEnd: Boolean(query),
								hasStart: true,
							})}
							onChange={(event) => onQueryChange(event.target.value)}
							onKeyDown={onInputKeyDown}
							placeholder={anchored ? "Search" : "Search pages and actions"}
							ref={inputRef}
							role="combobox"
							type="text"
							value={query}
						/>
						{query ? (
							<Button
								aria-label="Clear search"
								variant="bare"
								size="xs"
								shape="square"
								className="mr-2 shrink-0 text-muted-foreground"
								leadingIcon="close"
								onClick={onClearQuery}
								type="button"
							/>
						) : null}
					</InputFrame>
				</motion.div>
				<motion.div
					className="min-h-0 overflow-hidden"
					initial={animate ? { height: 0, opacity: 0 } : false}
					animate={{ height: "auto", opacity: 1 }}
					exit={{ height: 0, opacity: 0 }}
					transition={animate ? transition : { duration: 0 }}
					inert={!present || undefined}
				>
					<div>
						<Divider decorative />
					</div>
					<div
						className="min-h-0 overflow-y-auto overscroll-contain p-2"
						style={{
							maxHeight: anchored
								? "min(580px, calc(var(--command-available-height,60vh) - 9px))"
								: "min(550px,65vh)",
						}}
						id="dashboard-command-results"
					>
						{filteredCommandCount > 0 ? (
							<div aria-label="Dashboard commands" role="listbox">
								<DashboardCommandTree
									activeCommandId={activeCommandId}
									executeCommand={onExecuteCommand}
									nodes={commandTree}
									onActiveCommandChange={onActiveCommandChange}
								/>
							</div>
						) : (
							<p className="px-3 py-10 text-center text-sm text-muted-foreground">
								No matching commands.
							</p>
						)}
					</div>
				</motion.div>
			</div>
		</>
	);
}
