// components/ui/icons/iconRegistry.tsx
"use client";

import * as React from "react";
import {
	type CustomIconName,
	customRegistry,
} from "@/components/ui/icons/customRegistry";

export type IconWeight =
	| "thin"
	| "light"
	| "regular"
	| "bold"
	| "fill"
	| "duotone";

export type IconRenderProps = {
	className?: string;
	title?: string;
	"aria-hidden"?: boolean;
	weight?: IconWeight;
};

export type IconName = CustomIconName | (string & {});
export type IconRegistry = Record<string, React.ComponentType<IconRenderProps>>;

function renderLocalIcon(name: CustomIconName, { className }: IconRenderProps) {
	const icon = customRegistry[name];
	if (React.isValidElement<{ className?: string }>(icon)) {
		return React.cloneElement(icon, {
			className: [icon.props.className, className].filter(Boolean).join(" "),
		});
	}
	return icon;
}

function renderWeightedIcon(
	Component: React.ComponentType<IconRenderProps>,
	defaultWeight: IconWeight,
	props: IconRenderProps,
) {
	return <Component {...props} weight={props.weight ?? defaultWeight} />;
}

const createLocalRegistry = (): IconRegistry =>
	Object.fromEntries(
		(Object.keys(customRegistry) as CustomIconName[]).map((name) => {
			const LocalIcon: React.FC<IconRenderProps> = renderLocalIcon.bind(
				null,
				name,
			);
			LocalIcon.displayName = `LocalIcon(${name})`;
			return [name, LocalIcon];
		}),
	);

const localIconRegistry = createLocalRegistry();

const semanticDefaultWeights: Partial<Record<IconName, IconWeight>> = {
	bolt: "fill",
	sparkle: "fill",
};

export const createIconRegistry = (
	overrides: Partial<IconRegistry>,
	defaultWeights: Partial<Record<IconName, IconWeight>> = {},
): IconRegistry => {
	const merged: Record<
		string,
		React.ComponentType<IconRenderProps> | undefined
	> = {
		...localIconRegistry,
		...overrides,
	};

	return Object.fromEntries(
		Object.entries(merged)
			.filter(([, value]) => Boolean(value))
			.map(([name, Component]) => {
				const defaultWeight =
					defaultWeights[name] ?? semanticDefaultWeights[name];
				if (!Component || !defaultWeight) return [name, Component];
				const WithDefaultWeight: React.FC<IconRenderProps> =
					renderWeightedIcon.bind(null, Component, defaultWeight);
				WithDefaultWeight.displayName = `IconDefault(${name})`;
				return [name, WithDefaultWeight];
			}),
	) as IconRegistry;
};

const IconRegistryContext = React.createContext<IconRegistry | null>(null);

type IconProviderProps = {
	registry: IconRegistry;
	children: React.ReactNode;
};

export function IconProvider({ registry, children }: IconProviderProps) {
	return (
		<IconRegistryContext.Provider value={registry}>
			{children}
		</IconRegistryContext.Provider>
	);
}

export function useIconRegistry() {
	return React.useContext(IconRegistryContext) ?? localIconRegistry;
}
