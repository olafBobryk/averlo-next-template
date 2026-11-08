export type Rectangle = {
	id: string;
	width: number;
	height: number;
	priority?: number;
	keepClear?: boolean;
};
export type Placement = Rectangle & { x: number; y: number };
export type Bounds = {
	left: number;
	top: number;
	right: number;
	bottom: number;
};
export function packCenterOut(
	items: Rectangle[],
	options?: {
		gap?: number;
		aspect?: number;
		avoid?: Bounds;
		start?: { x: number; y: number };
	},
): {
	width: number;
	height: number;
	offset: { x: number; y: number };
	items: Placement[];
};
