"use client";

import * as React from "react";
import { SCROLL_CONFIG } from "@/config/scrollConfig";

type SettingsContextValue = {
	motionDisabled: boolean;
	setMotionDisabled: (value: boolean) => void;
	smoothScrollAvailable: boolean;
	smoothScrollDisabled: boolean;
	setSmoothScrollDisabled: (value: boolean) => void;
	textScale: number;
	setTextScale: (value: number) => void;
};

type SettingsProviderProps = {
	children: React.ReactNode;
	defaultMotionDisabled?: boolean;
	defaultSmoothScrollDisabled?: boolean;
	defaultTextScale?: number;
	storageKey?: string | null;
};

type StoredSettings = {
	motionDisabled?: boolean;
	smoothScrollDisabled?: boolean;
	textScale?: number;
};

const DEFAULT_STORAGE_KEY = "verilo-ui-settings";

const SettingsContext = React.createContext<SettingsContextValue | undefined>(
	undefined,
);

const isValidTextScale = (value: unknown): value is number =>
	typeof value === "number" && Number.isFinite(value) && value > 0;

const readStoredSettings = (storageKey: string) => {
	try {
		const raw = localStorage.getItem(storageKey);
		if (!raw) return null;
		const parsed = JSON.parse(raw) as StoredSettings;
		if (typeof parsed !== "object" || parsed === null) return null;
		return parsed;
	} catch {
		return null;
	}
};

const writeStoredSettings = (storageKey: string, settings: StoredSettings) => {
	try {
		localStorage.setItem(storageKey, JSON.stringify(settings));
	} catch {
		// Ignore storage failures (private mode, quota, etc.).
	}
};

export function SettingsProvider({
	children,
	defaultMotionDisabled = false,
	defaultSmoothScrollDisabled = false,
	defaultTextScale = 1,
	storageKey = DEFAULT_STORAGE_KEY,
}: SettingsProviderProps) {
	const smoothScrollAvailable = SCROLL_CONFIG.enableSmoothScroll;
	const [motionDisabled, setMotionDisabled] = React.useState(
		defaultMotionDisabled,
	);
	const [smoothScrollDisabled, setSmoothScrollDisabled] = React.useState(
		smoothScrollAvailable ? defaultSmoothScrollDisabled : true,
	);
	const [textScale, setTextScale] = React.useState(defaultTextScale);
	const hasHydrated = React.useRef(false);

	React.useEffect(() => {
		if (!storageKey || !hasHydrated.current) return;
		writeStoredSettings(storageKey, {
			motionDisabled,
			smoothScrollDisabled,
			textScale,
		});
	}, [motionDisabled, smoothScrollDisabled, textScale, storageKey]);

	React.useEffect(() => {
		document.documentElement.style.setProperty(
			"--text-scale",
			String(textScale),
		);

		return () => {
			document.documentElement.style.removeProperty("--text-scale");
		};
	}, [textScale]);

	React.useEffect(() => {
		if (!storageKey) {
			hasHydrated.current = true;
			return;
		}
		const stored = readStoredSettings(storageKey);
		if (typeof stored?.motionDisabled === "boolean") {
			setMotionDisabled(stored.motionDisabled);
		}
		if (
			smoothScrollAvailable &&
			typeof stored?.smoothScrollDisabled === "boolean"
		) {
			setSmoothScrollDisabled(stored.smoothScrollDisabled);
		} else if (!smoothScrollAvailable) {
			setSmoothScrollDisabled(true);
		}
		if (isValidTextScale(stored?.textScale)) {
			setTextScale(stored.textScale);
		}
		hasHydrated.current = true;
	}, [storageKey]);

	React.useEffect(() => {
		if (!storageKey) return;
		const handleStorage = (event: StorageEvent) => {
			if (event.key !== storageKey) return;
			const stored = readStoredSettings(storageKey);
			if (typeof stored?.motionDisabled === "boolean") {
				setMotionDisabled(stored.motionDisabled);
			}
			if (
				smoothScrollAvailable &&
				typeof stored?.smoothScrollDisabled === "boolean"
			) {
				setSmoothScrollDisabled(stored.smoothScrollDisabled);
			} else if (!smoothScrollAvailable) {
				setSmoothScrollDisabled(true);
			}
			if (isValidTextScale(stored?.textScale)) {
				setTextScale(stored.textScale);
			}
		};

		window.addEventListener("storage", handleStorage);
		return () => window.removeEventListener("storage", handleStorage);
	}, [storageKey]);

	return (
		<SettingsContext.Provider
			value={{
				motionDisabled,
				setMotionDisabled,
				smoothScrollAvailable,
				smoothScrollDisabled,
				setSmoothScrollDisabled: smoothScrollAvailable
					? setSmoothScrollDisabled
					: () => {},
				textScale,
				setTextScale,
			}}
		>
			{children}
		</SettingsContext.Provider>
	);
}

export function useSettingsContext() {
	return React.useContext(SettingsContext);
}
