export type Rectangle = {
	id: string;
	width: number;
	height: number;
	priority?: number;
};
export type Placement = Rectangle & { x: number; y: number };
export function packCenterOut(
	items: Rectangle[],
	options?: { gap?: number; aspect?: number; centerIds?: string[] },
): { width: number; height: number; items: Placement[] };
