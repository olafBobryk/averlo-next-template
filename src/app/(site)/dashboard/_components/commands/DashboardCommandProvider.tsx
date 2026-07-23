"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { focusRing } from "@/components/ui/foundations/focus";
import { Icon, type IconName } from "@/components/ui/icons/Icon";
import { ModalCard } from "@/components/ui/overlays/modal/ModalCard";
import {
	ModalDescription,
	ModalShell,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import { getDropdownOptionClassName } from "@/components/ui/primitives/dropdownStyles";
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";
import type { Organization } from "@/lib/auth/contracts";
import {
	type DashboardCapability,
	getDashboardNavigationCommands,
	hasDashboardCapability,
} from "../../_registry/surfaceRegistry";

export type DashboardContextualCommand = {
	capability?: DashboardCapability;
	description: string;
	href?: string;
	icon?: IconName;
	id: string;
	keywords?: readonly string[];
	label: string;
	parentId?: string;
	run?: () => void;
};

type DashboardCommandTreeNode = {
	children: DashboardCommandTreeNode[];
	command: DashboardContextualCommand;
	directlyMatched: boolean;
};

type DashboardCommandContextValue = {
	open: () => void;
	register: (
		ownerId: string,
		commands: readonly DashboardContextualCommand[],
	) => () => void;
};

type DashboardCommandRegistration = {
	commands: readonly DashboardContextualCommand[];
	ownerId: string;
};

const DashboardCommandContext =
	React.createContext<DashboardCommandContextValue | null>(null);

function getOptionId(commandId: string) {
	return `dashboard-command-option-${commandId.replaceAll(".", "-")}`;
}

function getNextCommandId({
	currentId,
	direction,
	resultIds,
}: {
	currentId?: string;
	direction: "next" | "previous";
	resultIds: string[];
}) {
	if (resultIds.length === 0) return undefined;
	if (!currentId) return resultIds[0];
	const currentIndex = resultIds.indexOf(currentId);
	if (currentIndex === -1) return resultIds[0];
	const offset = direction === "next" ? 1 : -1;
	return resultIds[
		(currentIndex + offset + resultIds.length) % resultIds.length
	];
}

function collapseRedundantCommandTreeContext(
	nodes: DashboardCommandTreeNode[],
): DashboardCommandTreeNode[] {
	const collapsedNodes = nodes.map((node) => ({
		...node,
		children: collapseRedundantCommandTreeContext(node.children),
	}));
	if (collapsedNodes.length !== 1) return collapsedNodes;
	const [onlyNode] = collapsedNodes;
	if (!onlyNode || onlyNode.directlyMatched || onlyNode.children.length === 0) {
		return collapsedNodes;
	}
	return onlyNode.children;
}

function buildDashboardCommandTree({
	commands,
	matchedCommands,
}: {
	commands: DashboardContextualCommand[];
	matchedCommands: DashboardContextualCommand[];
}) {
	const commandById = new Map(commands.map((command) => [command.id, command]));
	const directlyMatchedIds = new Set(
		matchedCommands.map((command) => command.id),
	);
	const includedIds = new Set<string>();
	for (const matchedCommand of matchedCommands) {
		let current: DashboardContextualCommand | undefined = matchedCommand;
		const visited = new Set<string>();
		while (current && !visited.has(current.id)) {
			visited.add(current.id);
			includedIds.add(current.id);
			current = current.parentId
				? commandById.get(current.parentId)
				: undefined;
		}
	}
	const treeNodeById = new Map<string, DashboardCommandTreeNode>();
	for (const command of commands) {
		if (!includedIds.has(command.id)) continue;
		treeNodeById.set(command.id, {
			children: [],
			command,
			directlyMatched: directlyMatchedIds.has(command.id),
		});
	}
	const roots: DashboardCommandTreeNode[] = [];
	for (const command of commands) {
		const treeNode = treeNodeById.get(command.id);
		if (!treeNode) continue;
		const parent = command.parentId
			? treeNodeById.get(command.parentId)
			: undefined;
		if (parent) parent.children.push(treeNode);
		else roots.push(treeNode);
	}
	return collapseRedundantCommandTreeContext(roots);
}

function DashboardCommandTree({
	activeCommandId,
	executeCommand,
	nodes,
	onActiveCommandChange,
}: {
	activeCommandId?: string;
	executeCommand: (command: DashboardContextualCommand) => void;
	nodes: DashboardCommandTreeNode[];
	onActiveCommandChange: (commandId: string) => void;
}) {
	return (
		<div className="grid gap-1">
			{nodes.map((node) => (
				<DashboardCommandTreeItem
					activeCommandId={activeCommandId}
					executeCommand={executeCommand}
					key={node.command.id}
					onActiveCommandChange={onActiveCommandChange}
					treeNode={node}
				/>
			))}
		</div>
	);
}

function DashboardCommandTreeItem({
	activeCommandId,
	executeCommand,
	onActiveCommandChange,
	treeNode,
}: {
	activeCommandId?: string;
	executeCommand: (command: DashboardContextualCommand) => void;
	onActiveCommandChange: (commandId: string) => void;
	treeNode: DashboardCommandTreeNode;
}) {
	const { command, directlyMatched } = treeNode;
	const isActive = activeCommandId === command.id;
	const rowContent = (
		<>
			<span
				className={[
					"grid size-9 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors motion-interactive",
					directlyMatched
						? "group-hover:text-foreground group-focus-visible:text-foreground group-data-[active=true]:text-foreground"
						: undefined,
				]
					.filter(Boolean)
					.join(" ")}
			>
				<Icon className="!size-[18px]" name={command.icon ?? "search"} />
			</span>
			<span className="grid min-w-0 gap-0.5">
				<span className="block truncate font-medium text-foreground">
					{command.label}
				</span>
				<span className="line-clamp-2 text-xs leading-4 text-muted-foreground">
					{command.description}
				</span>
			</span>
		</>
	);

	return (
		<div className="grid gap-1" role="presentation">
			{directlyMatched ? (
				<Button
					align="left"
					aria-selected={isActive}
					className={getDropdownOptionClassName({
						active: isActive,
						selected: isActive,
						className:
							"group !items-start !rounded-md !py-2 !pr-3 !pl-2 motion-interactive",
					})}
					contentClassName="gap-3"
					data-active={isActive ? "true" : undefined}
					data-command-result=""
					id={getOptionId(command.id)}
					onClick={() => executeCommand(command)}
					onMouseDown={(event) => event.preventDefault()}
					onMouseMove={() => onActiveCommandChange(command.id)}
					role="option"
					size="none"
					tabIndex={-1}
					type="button"
					variant="ghost"
				>
					{rowContent}
				</Button>
			) : (
				<div className="flex items-start gap-3 rounded-md py-2 pr-3 pl-2 text-left text-sm">
					{rowContent}
				</div>
			)}
			{treeNode.children.length > 0 ? (
				<div className="relative ml-4 grid gap-1 pl-5 before:absolute before:bottom-1 before:left-0 before:top-0 before:w-px before:bg-border">
					<DashboardCommandTree
						activeCommandId={activeCommandId}
						executeCommand={executeCommand}
						nodes={treeNode.children}
						onActiveCommandChange={onActiveCommandChange}
					/>
				</div>
			) : null}
		</div>
	);
}

function commandMatches(command: DashboardContextualCommand, query: string) {
	const normalized = query.trim().toLowerCase();
	if (!normalized) return true;
	return [command.label, command.description, ...(command.keywords ?? [])]
		.join(" ")
		.toLowerCase()
		.includes(normalized);
}

export function DashboardCommandProvider({
	capabilities,
	children,
	organization,
}: {
	capabilities: ReadonlySet<DashboardCapability>;
	children: React.ReactNode;
	organization: Organization;
}) {
	const router = useRouter();
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [activeCommandId, setActiveCommandId] = React.useState<string>();
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [registrations, setRegistrations] = React.useState(
		new Map<symbol, DashboardCommandRegistration>(),
	);
	const staticCommands = React.useMemo(
		() => getDashboardNavigationCommands(capabilities),
		[capabilities],
	);
	const contextualCommands = React.useMemo(
		() =>
			[...registrations.values()].flatMap(({ commands, ownerId }) => {
				const parentCommand = staticCommands
					.filter(
						(command) =>
							command.id.startsWith("navigate.") &&
							ownerId.startsWith(command.id.slice("navigate.".length)),
					)
					.sort((a, b) => b.id.length - a.id.length)[0];
				return commands
					.filter((command) =>
						hasDashboardCapability(capabilities, command.capability),
					)
					.map((command) => ({
						...command,
						parentId: command.parentId ?? parentCommand?.id,
					}));
			}),
		[capabilities, registrations, staticCommands],
	);
	const commands = React.useMemo(
		() => [...contextualCommands, ...staticCommands],
		[contextualCommands, staticCommands],
	);
	const filteredCommands = React.useMemo(
		() => commands.filter((command) => commandMatches(command, query)),
		[commands, query],
	);
	const resultIds = React.useMemo(
		() => filteredCommands.map((command) => command.id),
		[filteredCommands],
	);
	const effectiveActiveCommandId = resultIds.includes(activeCommandId ?? "")
		? activeCommandId
		: resultIds[0];
	const activeCommand = filteredCommands.find(
		(command) => command.id === effectiveActiveCommandId,
	);
	const commandTree = React.useMemo(
		() =>
			buildDashboardCommandTree({
				commands,
				matchedCommands: filteredCommands,
			}),
		[commands, filteredCommands],
	);

	const close = React.useCallback(() => {
		setOpen(false);
		setQuery("");
		setActiveCommandId(undefined);
	}, []);

	React.useEffect(() => {
		function handleKeyDown(event: KeyboardEvent) {
			if (event.key.toLowerCase() !== "k") return;
			if (!event.metaKey && !event.ctrlKey) return;
			event.preventDefault();
			setOpen((current) => !current);
		}
		window.addEventListener("keydown", handleKeyDown);
		return () => window.removeEventListener("keydown", handleKeyDown);
	}, []);

	React.useEffect(() => {
		if (!open) return;
		let frame = 0;
		let attempts = 0;
		const focusInput = () => {
			if (inputRef.current) {
				inputRef.current.focus({ preventScroll: true });
				return;
			}
			attempts += 1;
			if (attempts < 4) frame = window.requestAnimationFrame(focusInput);
		};
		frame = window.requestAnimationFrame(focusInput);
		return () => window.cancelAnimationFrame(frame);
	}, [open]);

	const register = React.useCallback(
		(ownerId: string, nextCommands: readonly DashboardContextualCommand[]) => {
			const token = Symbol(ownerId);
			setRegistrations((current) => {
				const next = new Map(current);
				next.set(token, { commands: nextCommands, ownerId });
				return next;
			});
			return () => {
				setRegistrations((current) => {
					if (!current.has(token)) return current;
					const next = new Map(current);
					next.delete(token);
					return next;
				});
			};
		},
		[],
	);
	const openCommands = React.useCallback(() => setOpen(true), []);
	const contextValue = React.useMemo(
		() => ({ open: openCommands, register }),
		[openCommands, register],
	);

	function execute(command: DashboardContextualCommand) {
		close();
		if (command.run) {
			window.requestAnimationFrame(command.run);
			return;
		}
		if (command.href) router.push(command.href);
	}

	function clearQuery() {
		setQuery("");
		setActiveCommandId(undefined);
		inputRef.current?.focus();
	}

	function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.key === "Escape") {
			event.preventDefault();
			close();
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setActiveCommandId((currentId) =>
				getNextCommandId({
					currentId: resultIds.includes(currentId ?? "")
						? currentId
						: effectiveActiveCommandId,
					direction: event.key === "ArrowDown" ? "next" : "previous",
					resultIds,
				}),
			);
			return;
		}
		if (event.key === "Enter" && activeCommand) {
			event.preventDefault();
			execute(activeCommand);
		}
	}

	return (
		<DashboardCommandContext.Provider value={contextValue}>
			{children}
			{open ? (
				<ModalShell
					ariaLabel="Dashboard commands"
					onClose={close}
					placement="top"
				>
					<ModalCard
						background="transparent"
						border="default"
						className="max-h-[min(760px,82vh)] border-border/80 bg-popover/94 backdrop-blur-xl shadow-foreground/15"
						maxWidth="2xl"
						shadow="2xl"
						style={{
							backgroundColor:
								"color-mix(in oklab, var(--color-popover) 94%, transparent)",
						}}
					>
						<div className="sr-only">
							<ModalTitle>Commands</ModalTitle>
							<ModalDescription>
								{organization.name} · navigation and current-page actions
							</ModalDescription>
						</div>
						<div className="flex max-h-[min(760px,82vh)] flex-col">
							<div className="border-b border-border/75 p-3">
								<InputFrame
									contentClassName="flex min-w-0 items-center"
									fullWidth
									start={
										<Icon className="text-muted-foreground" name="search" />
									}
								>
									<input
										aria-activedescendant={
											effectiveActiveCommandId
												? getOptionId(effectiveActiveCommandId)
												: undefined
										}
										aria-controls="dashboard-command-results"
										aria-label="Search dashboard commands"
										autoComplete="off"
										className={inputVariants({
											hasEnd: Boolean(query),
											hasStart: true,
										})}
										onChange={(event) => {
											setQuery(event.target.value);
											setActiveCommandId(undefined);
										}}
										onKeyDown={handleInputKeyDown}
										placeholder="Search pages and actions"
										ref={inputRef}
										type="text"
										value={query}
									/>
									{query ? (
										<button
											aria-label="Clear search"
											className={[
												"mr-2 grid size-7 shrink-0 place-items-center rounded-md text-muted-foreground transition-colors motion-interactive hover:bg-background-hover hover:text-foreground",
												focusRing.visibleDefault,
											]
												.filter(Boolean)
												.join(" ")}
											onClick={clearQuery}
											type="button"
										>
											<Icon className="!size-4" name="close" />
										</button>
									) : null}
								</InputFrame>
							</div>
							<div
								className="min-h-0 flex-1 overflow-y-auto overscroll-contain p-2"
								id="dashboard-command-results"
							>
								{filteredCommands.length > 0 ? (
									<div aria-label="Dashboard commands" role="listbox">
										<DashboardCommandTree
											activeCommandId={effectiveActiveCommandId}
											executeCommand={execute}
											nodes={commandTree}
											onActiveCommandChange={setActiveCommandId}
										/>
									</div>
								) : (
									<p className="px-3 py-8 text-center text-sm text-muted-foreground">
										No matching commands.
									</p>
								)}
							</div>
						</div>
					</ModalCard>
				</ModalShell>
			) : null}
		</DashboardCommandContext.Provider>
	);
}

export function DashboardCommandTrigger() {
	const context = React.useContext(DashboardCommandContext);
	if (!context) return null;
	return (
		<>
			<InputFrame className="hidden !w-[280px] min-w-[280px] max-w-[280px] bg-input/50 md:flex">
				<button
					aria-label="Open dashboard commands"
					className="flex h-full w-full min-w-0 items-center gap-2 px-3 text-left text-sm text-muted-foreground outline-none transition-colors motion-interactive hover:text-foreground"
					onClick={context.open}
					type="button"
				>
					<Icon className="!size-4 shrink-0" name="search" />
					<span className="min-w-0 flex-1 truncate">Search</span>
					<span className="inline-flex shrink-0 items-center text-2xs leading-none text-muted-foreground">
						⌘K
					</span>
				</button>
			</InputFrame>
			<Button
				aria-label="Open dashboard commands"
				className="md:hidden"
				onClick={context.open}
				size="icon-sm"
				variant="ghost"
			>
				<Icon className="!size-4" name="search" />
			</Button>
		</>
	);
}

export function useDashboardCommands(
	ownerId: string,
	commands: readonly DashboardContextualCommand[],
) {
	const context = React.useContext(DashboardCommandContext);
	const commandsRef = React.useRef(commands);
	commandsRef.current = commands;
	React.useEffect(() => {
		if (!context) return;
		return context.register(ownerId, commandsRef.current);
	}, [context, ownerId]);
}
