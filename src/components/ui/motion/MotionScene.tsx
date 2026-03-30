"use client";

import {
	createContext,
	type ReactNode,
	useContext,
	useEffect,
	useState,
} from "react";
import { useAppReady } from "@/hooks/useAppReady";

export type MotionSceneStageInput = string | string[] | undefined;

type MotionSceneContextValue = {
	isStageReady: (stages: MotionSceneStageInput) => boolean;
	markStages: (stages: MotionSceneStageInput) => void;
};

const MotionSceneContext = createContext<MotionSceneContextValue | null>(null);
const warnedWithoutScene = new Set<string>();

function normalizeStages(stages: MotionSceneStageInput): string[] {
	if (!stages) return [];
	const values = Array.isArray(stages) ? stages : [stages];
	return values
		.map((value) => value.trim())
		.filter(Boolean)
		.filter((value, index, array) => array.indexOf(value) === index);
}

function warnScenePropWithoutProvider(
	componentName: string,
	propName: "waitFor" | "unlockStage",
) {
	if (process.env.NODE_ENV === "production") return;
	const key = `${componentName}:${propName}`;
	if (warnedWithoutScene.has(key)) return;
	warnedWithoutScene.add(key);
	console.warn(
		`[${componentName}] \`${propName}\` requires a MotionScene ancestor and will be ignored.`,
	);
}

export function MotionScene({ children }: { children: ReactNode }) {
	const appReady = useAppReady();
	const [readyStages, setReadyStages] = useState<Set<string>>(() =>
		appReady ? new Set(["app"]) : new Set(),
	);

	useEffect(() => {
		if (!appReady) return;
		setReadyStages((previous) => {
			if (previous.has("app")) return previous;
			const next = new Set(previous);
			next.add("app");
			return next;
		});
	}, [appReady]);

	const isStageReady = (stages: MotionSceneStageInput) => {
		const normalized = normalizeStages(stages);
		return normalized.every((stage) => readyStages.has(stage));
	};

	const markStages = (stages: MotionSceneStageInput) => {
		const normalized = normalizeStages(stages);
		if (normalized.length === 0) return;
		setReadyStages((previous) => {
			let next: Set<string> | null = null;
			for (const stage of normalized) {
				if (previous.has(stage)) continue;
				if (next === null) next = new Set(previous);
				next.add(stage);
			}
			return next ?? previous;
		});
	};

	return (
		<MotionSceneContext.Provider value={{ isStageReady, markStages }}>
			{children}
		</MotionSceneContext.Provider>
	);
}

export function useOptionalMotionScene() {
	return useContext(MotionSceneContext);
}

export function useMotionSceneGate(
	componentName: string,
	{
		waitFor,
		unlockStage,
	}: {
		waitFor?: MotionSceneStageInput;
		unlockStage?: MotionSceneStageInput;
	},
) {
	const scene = useOptionalMotionScene();
	const waitStages = normalizeStages(waitFor);
	const unlockStages = normalizeStages(unlockStage);

	if (!scene) {
		if (waitStages.length > 0) {
			warnScenePropWithoutProvider(componentName, "waitFor");
		}
		if (unlockStages.length > 0) {
			warnScenePropWithoutProvider(componentName, "unlockStage");
		}
	}

	return {
		scene,
		hasWaitFor: waitStages.length > 0,
		sceneReady: scene ? scene.isStageReady(waitStages) : true,
		markReady: () => {
			if (!scene) return;
			scene.markStages(unlockStages);
		},
	};
}
