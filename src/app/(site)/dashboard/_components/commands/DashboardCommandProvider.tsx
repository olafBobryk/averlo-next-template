"use client";

import { useRouter } from "next/navigation";
import * as React from "react";
import { Icon } from "@/components/ui/icons/Icon";
import {
	ModalContent,
	ModalDescription,
	ModalHeader,
	ModalShell,
	ModalTitle,
} from "@/components/ui/overlays/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";
import { Text } from "@/components/ui/primitives/Text";
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
	id: string;
	keywords?: readonly string[];
	label: string;
	run?: () => void;
};

type DashboardCommandContextValue = {
	open: () => void;
	register: (
		ownerId: string,
		commands: readonly DashboardContextualCommand[],
	) => () => void;
};

const DashboardCommandContext =
	React.createContext<DashboardCommandContextValue | null>(null);

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
	const [open, setOpen] = React.useState(false);
	const [query, setQuery] = React.useState("");
	const [registrations, setRegistrations] = React.useState(
		new Map<symbol, readonly DashboardContextualCommand[]>(),
	);
	const staticCommands = React.useMemo(
		() => getDashboardNavigationCommands(capabilities),
		[capabilities],
	);
	const contextualCommands = React.useMemo(
		() =>
			[...registrations.values()]
				.flat()
				.filter((command) =>
					hasDashboardCapability(capabilities, command.capability),
				),
		[capabilities, registrations],
	);
	const commands = React.useMemo(
		() => [...contextualCommands, ...staticCommands],
		[contextualCommands, staticCommands],
	);
	const filteredCommands = commands.filter((command) =>
		commandMatches(command, query),
	);

	const close = React.useCallback(() => {
		setOpen(false);
		setQuery("");
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
		const frame = window.requestAnimationFrame(() => inputRef.current?.focus());
		return () => window.cancelAnimationFrame(frame);
	}, [open]);

	const register = React.useCallback(
		(ownerId: string, nextCommands: readonly DashboardContextualCommand[]) => {
			const token = Symbol(ownerId);
			setRegistrations((current) => {
				const next = new Map(current);
				next.set(token, nextCommands);
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

	return (
		<DashboardCommandContext.Provider value={contextValue}>
			{children}
			{open ? (
				<ModalShell
					ariaLabel="Dashboard commands"
					onClose={close}
					panelClassName="w-[min(42rem,calc(100vw-2rem))] max-w-2xl"
					panelWrapperClassName="items-start p-4 pt-[12vh] sm:p-8 sm:pt-[12vh]"
				>
					<ModalHeader>
						<ModalTitle>Commands</ModalTitle>
						<ModalDescription>
							{organization.name} · navigation and current-page actions
						</ModalDescription>
					</ModalHeader>
					<ModalContent className="grid gap-3 p-3">
						<InputFrame fullWidth>
							<Icon className="ml-3 text-muted-foreground" name="search" />
							<input
								aria-label="Search dashboard commands"
								className={inputVariants({ hasStart: true })}
								onChange={(event) => setQuery(event.target.value)}
								placeholder="Search pages and actions"
								ref={inputRef}
								value={query}
							/>
						</InputFrame>
						<div className="max-h-[min(55vh,30rem)] overflow-y-auto">
							{filteredCommands.length > 0 ? (
								<div className="grid gap-1" role="listbox">
									{filteredCommands.map((command) => (
										<button
											className="grid w-full gap-0.5 rounded-md px-3 py-2 text-left transition-colors motion-interactive hover:bg-background-hover focus-visible:bg-background-hover"
											key={command.id}
											onClick={() => execute(command)}
											role="option"
											type="button"
										>
											<Text as="span" variant="bodyStrong">
												{command.label}
											</Text>
											<Text as="span" tone="muted" variant="caption">
												{command.description}
											</Text>
										</button>
									))}
								</div>
							) : (
								<Text className="px-3 py-8 text-center" tone="muted">
									No matching commands.
								</Text>
							)}
						</div>
					</ModalContent>
				</ModalShell>
			) : null}
		</DashboardCommandContext.Provider>
	);
}

export function DashboardCommandTrigger() {
	const context = React.useContext(DashboardCommandContext);
	if (!context) return null;
	return (
		<Button
			aria-label="Open dashboard commands"
			className="h-10 min-w-10 gap-2 px-3"
			leadingIcon="search"
			onClick={context.open}
			size="sm"
			variant="secondary"
		>
			<span className="hidden sm:inline">Search</span>
			<kbd className="hidden rounded border border-border bg-background px-1.5 py-0.5 text-[10px] text-muted-foreground md:inline">
				⌘K
			</kbd>
		</Button>
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
