"use client";
import clsx from "clsx";
import { AnimatePresence } from "motion/react";

import { usePathname, useRouter } from "next/navigation";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import { MODAL_OPEN_EVENT } from "@/lib/modal";
import { DashboardCommandOverlay } from "./DashboardCommandOverlay";
import { Button } from "@/components/ui/primitives/Button";
import { InputFrame } from "@/components/ui/primitives/InputFrame";
import type { Organization } from "@/lib/auth/contracts";
import {
	type DashboardCapability,
	getDashboardNavigationCommands,
	hasDashboardCapability,
} from "../../_registry/surfaceRegistry";

import type { DashboardContextualCommand } from "./DashboardCommandContracts";
import { DashboardCommandPalette } from "./DashboardCommandPalette";
import {
	buildDashboardCommandTree,
	dashboardCommandMatches,
	getNextDashboardCommandId,
} from "./DashboardCommandTree";

export type { DashboardContextualCommand } from "./DashboardCommandContracts";

type DashboardCommandContextValue = {
	open: (anchor?: HTMLElement) => void;
	active: boolean;
	registerAnchor: (element: HTMLElement) => () => void;
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

export function DashboardCommandProvider({
	canSwitchOrganizations,
	capabilities,
	children,
	organization,
}: {
	canSwitchOrganizations: boolean;
	capabilities: ReadonlySet<DashboardCapability>;
	children: React.ReactNode;
	organization: Organization;
}) {
	const [registrations, setRegistrations] = React.useState(
		new Map<symbol, DashboardCommandRegistration>(),
	);
	const [open, setOpen] = React.useState(false);
	const [visible, setVisible] = React.useState(false);
	const anchors = React.useRef(new Set<HTMLElement>());
	const source = React.useRef<HTMLElement | null>(null);
	const restore = React.useRef<HTMLElement | null>(null);
	const restoreOnClose = React.useRef(true);
	const pathname = usePathname();
	const router = useRouter();
	const afterClose = React.useRef<(() => void) | null>(null);
	const registerAnchor = React.useCallback((element: HTMLElement) => {
		anchors.current.add(element);
		return () => {
			anchors.current.delete(element);
		};
	}, []);
	const resolveAnchor = React.useCallback(() => {
		if (source.current?.isConnected && source.current.getClientRects().length)
			return source.current;
		return (
			[...anchors.current]
				.reverse()
				.find(
					(element) =>
						element.isConnected &&
						element.getClientRects().length &&
						element.getBoundingClientRect().width > 0,
				) ?? null
		);
	}, []);
	const closeCommands = React.useCallback((restoreFocus = true) => {
		restoreOnClose.current = restoreFocus;
		setOpen(false);
	}, []);
	const staticCommands = React.useMemo(
		() =>
			getDashboardNavigationCommands(capabilities, {
				canSwitchOrganizations,
			}),
		[canSwitchOrganizations, capabilities],
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
	const openCommands = React.useCallback(
		(anchor?: HTMLElement) => {
            if (afterClose.current) return;
			source.current = anchor ?? resolveAnchor();
			restore.current =
				document.activeElement instanceof HTMLElement
					? document.activeElement
					: null;
			restoreOnClose.current = true;
			setVisible(true);
			setOpen(true);
		},
		[resolveAnchor],
	);
	React.useEffect(() => {
		const keydown = (event: KeyboardEvent) => {
			if (event.key.toLowerCase() !== "k" || (!event.metaKey && !event.ctrlKey))
				return;
			event.preventDefault();
			if (open) closeCommands();
			else if (
				!document.querySelector(
					'[role="dialog"]:not([aria-label="Dashboard navigation"]):not([aria-label="Dashboard commands"])',
				)
			)
				openCommands();
		};
		const modalOpened = () => closeCommands(false);
		window.addEventListener("keydown", keydown);
		window.addEventListener(MODAL_OPEN_EVENT, modalOpened);
		return () => {
			window.removeEventListener("keydown", keydown);
			window.removeEventListener(MODAL_OPEN_EVENT, modalOpened);
		};
	}, [open, closeCommands, openCommands]);
	React.useEffect(() => {
		if (pathname) closeCommands(false);
	}, [pathname, closeCommands]);

	const contextValue = React.useMemo(
		() => ({ open: openCommands, active: visible, registerAnchor, register }),
		[openCommands, visible, registerAnchor, register],
	);

	return (
		<DashboardCommandContext.Provider value={contextValue}>
			{children}
			<AnimatePresence
				onExitComplete={() => {
					if (open) return;
					setVisible(false);
					const action = afterClose.current;
					afterClose.current = null;
					if (action) {
						action();
						return;
					}
					if (restoreOnClose.current) {
						const target = restore.current?.isConnected
							? restore.current
							: resolveAnchor()?.querySelector<HTMLElement>("button");
						target?.focus({ preventScroll: true });
					}
				}}
			>
				{open ? (
					<DashboardCommandOverlay
						key="commands"
						resolveAnchor={resolveAnchor}
						onClose={closeCommands}
					>
						<DashboardCommandSession
							commands={commands}
							onClose={() => closeCommands()}
							onExecute={(command) => {
								afterClose.current = () => {
									if (command.run) command.run();
									else if (command.href) router.push(command.href);
								};
								closeCommands(false);
							}}
							organizationName={organization.name}
						/>
					</DashboardCommandOverlay>
				) : null}
			</AnimatePresence>
		</DashboardCommandContext.Provider>
	);
}

function DashboardCommandSession({
	commands,
	onClose,
	onExecute,
	organizationName,
}: {
	commands: readonly DashboardContextualCommand[];
	onClose: () => void;
	onExecute: (command: DashboardContextualCommand) => void;
	organizationName: string;
}) {
	const inputRef = React.useRef<HTMLInputElement>(null);
	const [activeCommandId, setActiveCommandId] = React.useState<string>();
	const [query, setQuery] = React.useState("");
	const filteredCommands = React.useMemo(
		() => commands.filter((command) => dashboardCommandMatches(command, query)),
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
				commands: [...commands],
				matchedCommands: filteredCommands,
			}),
		[commands, filteredCommands],
	);

	React.useEffect(() => {
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
	}, []);

	function handleInputKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
		if (event.nativeEvent.isComposing || event.keyCode === 229) return;
		if (event.key === "Escape") {
			event.preventDefault();
			onClose();
			return;
		}
		if (event.key === "ArrowDown" || event.key === "ArrowUp") {
			event.preventDefault();
			setActiveCommandId((currentId) =>
				getNextDashboardCommandId({
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
			onExecute(activeCommand);
		}
	}

	return (
		<DashboardCommandPalette
			anchored
			activeCommandId={effectiveActiveCommandId}
			commandTree={commandTree}
			filteredCommandCount={filteredCommands.length}
			inputRef={inputRef}
			onActiveCommandChange={setActiveCommandId}
			onClearQuery={() => {
				setQuery("");
				setActiveCommandId(undefined);
				inputRef.current?.focus();
			}}
			onExecuteCommand={onExecute}
			onInputKeyDown={handleInputKeyDown}
			onQueryChange={(nextQuery) => {
				setQuery(nextQuery);
				setActiveCommandId(undefined);
			}}
			organizationName={organizationName}
			query={query}
		/>
	);
}

export function DashboardCommandTrigger({
	collapsed = false,
	mobileExpanded = false,
}: {
	collapsed?: boolean;
	mobileExpanded?: boolean;
}) {
	const context = React.useContext(DashboardCommandContext);
	const field = React.useRef<HTMLDivElement>(null);
	const rail = React.useRef<HTMLButtonElement>(null);
	const registerAnchor = context?.registerAnchor;
	React.useLayoutEffect(() => {
		if (!registerAnchor) return;
		const cleanups = [field.current, rail.current]
			.filter(
				(element): element is HTMLDivElement | HTMLButtonElement => !!element,
			)
			.map(registerAnchor);
		return () => {
			for (const cleanup of cleanups) cleanup();
		};
	}, [registerAnchor]);
	if (!context) return null;
	return (
		<>
			<InputFrame
				ref={field}
				className={clsx(
					"w-full",
					mobileExpanded ? "!flex" : collapsed ? "!hidden" : "!hidden lg:!flex",
					context.active && "opacity-0",
				)}
			>
				<button
					aria-label="Open dashboard commands"
					aria-haspopup="dialog"
					aria-expanded={context.active}
					className="flex h-full w-full min-w-0 items-center gap-2 px-3 text-left text-sm text-muted-foreground outline-none transition-colors motion-interactive hover:text-foreground"
					onClick={() => context.open(field.current ?? undefined)}
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
				ref={rail}
				aria-label="Open dashboard commands"
				aria-haspopup="dialog"
				aria-expanded={context.active}
				className={clsx(
					"!h-8 w-full !rounded-md !text-muted-foreground hover:!bg-sidebar-accent/80 hover:!text-sidebar-accent-foreground",
					mobileExpanded ? "!hidden" : collapsed ? "inline-flex" : "lg:!hidden",
					context.active && "opacity-0",
				)}
				onClick={() => context.open(rail.current ?? undefined)}
				size="none"
				variant="ghost"
			>
				<Icon size="md" name="search" />
			</Button>
		</>
	);
}

export function useDashboardCommands(
	ownerId: string,
	commands: readonly DashboardContextualCommand[],
) {
	const context = React.useContext(DashboardCommandContext);
	const register = context?.register;
	const commandsRef = React.useRef(commands);
	commandsRef.current = commands;
	React.useEffect(() => {
		if (!register) return;
		return register(ownerId, commandsRef.current);
	}, [register, ownerId]);
}
