// components/ui/icons/iconRegistry.tsx
"use client";

import * as React from "react";
import { iconMap, type IconName } from "@/components/ui/icons/iconMap";

export type IconRenderProps = {
	className?: string;
	title?: string;
	"aria-hidden"?: boolean;
};

export type IconRegistry = Record<IconName, React.ComponentType<IconRenderProps>>;

const createLocalRegistry = (): IconRegistry => {
	const entries = (Object.keys(iconMap) as IconName[]).map((name) => {
		const LocalIcon: React.FC<IconRenderProps> = ({ className }) => {
			const icon = iconMap[name];
			if (React.isValidElement<{ className?: string }>(icon)) {
				const mergedClassName = [icon.props.className, className]
					.filter(Boolean)
					.join(" ");
				return React.cloneElement(
					icon as React.ReactElement<{ className?: string }>,
					{ className: mergedClassName },
				);
			}
			return icon;
		};
		LocalIcon.displayName = `LocalIcon(${name})`;
		return [name, LocalIcon] as const;
	});

	return Object.fromEntries(entries) as IconRegistry;
};

export const localIconRegistry = createLocalRegistry();

export const createIconRegistry = (
	overrides: Partial<IconRegistry>,
): IconRegistry => {
	return {
		...localIconRegistry,
		...overrides,
	};
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
