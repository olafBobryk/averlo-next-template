"use client";

import { usePathname } from "next/navigation";
import {
	createContext,
	type ReactNode,
	useCallback,
	useContext,
	useLayoutEffect,
	useSyncExternalStore,
} from "react";
import {
	MOTION_CONFIG,
	type MotionDriver,
	resolveMotionDriver,
} from "@/config/motionConfig";

export type { MotionDriver } from "@/config/motionConfig";

const DriverContext = createContext({
	driver: MOTION_CONFIG.defaultDriver,
	resolved: false,
	comparison: false,
});
const subscribe = (callback: () => void) => {
	window.addEventListener("popstate", callback);
	return () => window.removeEventListener("popstate", callback);
};
const clientSearch = () => window.location.search;
const serverSearch = () => "";
const clientReady = () => true;
const serverReady = () => false;

export function MotionDriverProvider({
	children,
	driver: override,
}: {
	children: ReactNode;
	driver?: MotionDriver;
}) {
	const pathname = usePathname();
	const readSearch = useCallback(() => {
		void pathname;
		return clientSearch();
	}, [pathname]);
	const search = useSyncExternalStore(subscribe, readSearch, serverSearch);
	const resolved = useSyncExternalStore(subscribe, clientReady, serverReady);
	const driver =
		override ??
		resolveMotionDriver(search, process.env.NODE_ENV === "development");
	const params = new URLSearchParams(search);
	const comparison =
		resolved &&
		process.env.NODE_ENV === "development" &&
		params.getAll("motionCompare").length === 1 &&
		params.get("motionCompare") === "1";
	useLayoutEffect(() => {
		const root = document.documentElement;
		const previous = root.dataset.motionDriver;
		root.dataset.motionDriver = driver;
		return () => {
			if (previous) root.dataset.motionDriver = previous;
			else delete root.dataset.motionDriver;
		};
	}, [driver]);
	return (
		<DriverContext.Provider value={{ driver, resolved, comparison }}>
			{children}
		</DriverContext.Provider>
	);
}

export function useMotionDriver() {
	return useContext(DriverContext).driver;
}
export function useMotionDriverReady() {
	return useContext(DriverContext).resolved;
}
export function useMotionComparison() {
	return useContext(DriverContext).comparison;
}
