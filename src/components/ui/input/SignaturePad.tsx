// components/ui/input/SignaturePad.tsx
"use client";

import * as React from "react";

type Point = { x: number; y: number; p: number; t: number };

export type SignaturePadHandle = {
	clear: () => void;
	isEmpty: () => boolean;
	toBlob: () => Promise<Blob | null>;
};

type SignaturePadProps = {
	className?: string;

	width?: number;
	height?: number;

	disabled?: boolean;

	onInk?: () => void;
};

function now() {
	return typeof performance !== "undefined" ? performance.now() : Date.now();
}

function clamp(n: number, min: number, max: number) {
	return Math.max(min, Math.min(max, n));
}

export const SignaturePad = React.forwardRef<
	SignaturePadHandle,
	SignaturePadProps
>(function SignaturePad({ className, width, height, disabled, onInk }, ref) {
	const canvasRef = React.useRef<HTMLCanvasElement | null>(null);
	const ctxRef = React.useRef<CanvasRenderingContext2D | null>(null);

	const drawingRef = React.useRef(false);
	const pointsRef = React.useRef<Point[]>([]);
	const lastDrawnIndexRef = React.useRef(0);

	const rafRef = React.useRef<number | null>(null);
	const needsDrawRef = React.useRef(false);

	const setupCanvas = React.useCallback(() => {
		const canvas = canvasRef.current;
		if (!canvas) return;

		const rect = canvas.getBoundingClientRect();
		const dpr = window.devicePixelRatio || 1;

		// save existing pixels if you ever resize (optional: skip for signatures)
		canvas.width = Math.max(1, Math.floor(rect.width * dpr));
		canvas.height = Math.max(1, Math.floor(rect.height * dpr));

		const ctx = canvas.getContext("2d");
		if (!ctx) return;

		ctxRef.current = ctx;
		ctx.setTransform(dpr, 0, 0, dpr, 0, 0);

		ctx.lineCap = "round";
		ctx.lineJoin = "round";
		ctx.strokeStyle = "#020202";
		ctx.fillStyle = "#020202";
	}, []);

	React.useEffect(() => {
		setupCanvas();
		const onResize = () => setupCanvas();
		window.addEventListener("resize", onResize);
		return () => window.removeEventListener("resize", onResize);
	}, [setupCanvas]);

	const draw = React.useCallback(() => {
		const ctx = ctxRef.current;
		const canvas = canvasRef.current;
		if (!ctx || !canvas) return;

		const pts = pointsRef.current;
		const start = Math.max(0, lastDrawnIndexRef.current - 2); // keep continuity
		const end = pts.length;
		if (end - start < 2) {
			lastDrawnIndexRef.current = end;
			return;
		}

		// Draw segments from start -> end, in one batch, so we never skip points
		for (let i = Math.max(1, start); i < end; i++) {
			const a = pts[i - 1];
			const b = pts[i];

			// width from pressure (stable range)
			const pressure = b.p || 0.5;
			const w = 1.6 + clamp(pressure, 0.1, 1) * 2.6;
			ctx.lineWidth = w;

			// Quadratic smoothing, but ensure continuity by anchoring at a
			// Use midpoint between a and b as the end of curve
			const midX = (a.x + b.x) / 2;
			const midY = (a.y + b.y) / 2;

			ctx.beginPath();
			ctx.moveTo(a.x, a.y);
			ctx.quadraticCurveTo(a.x, a.y, midX, midY);
			ctx.stroke();

			// Also draw a tiny line to b to close any small gap at speed
			ctx.beginPath();
			ctx.moveTo(midX, midY);
			ctx.lineTo(b.x, b.y);
			ctx.stroke();
		}

		lastDrawnIndexRef.current = end;
	}, []);

	const scheduleDraw = React.useCallback(() => {
		if (rafRef.current != null) return;

		rafRef.current = window.requestAnimationFrame(() => {
			rafRef.current = null;
			if (needsDrawRef.current) {
				needsDrawRef.current = false;
				draw();
			}
			// if more points came in while drawing, schedule again
			if (needsDrawRef.current) scheduleDraw();
		});
	}, [draw]);

	const getLocalPoint = React.useCallback((e: PointerEvent) => {
		const canvas = canvasRef.current;
		if (!canvas) return null;

		const rect = canvas.getBoundingClientRect();
		const x = e.clientX - rect.left;
		const y = e.clientY - rect.top;

		return {
			x,
			y,
			p: typeof e.pressure === "number" && e.pressure > 0 ? e.pressure : 0.5,
			t: now(),
		} satisfies Point;
	}, []);

	const pushPoint = React.useCallback(
		(pt: Point) => {
			pointsRef.current.push(pt);
			needsDrawRef.current = true;
			scheduleDraw();
		},
		[scheduleDraw],
	);

	const onPointerDown = React.useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (disabled) return;
			if (e.pointerType === "mouse" && e.buttons !== 1) return;

			const pt = getLocalPoint(e.nativeEvent);
			if (!pt) return;

			drawingRef.current = true;
			pointsRef.current.push(pt);

			// tiny dot
			const ctx = ctxRef.current;
			if (ctx) {
				ctx.beginPath();
				ctx.arc(pt.x, pt.y, 1.2, 0, Math.PI * 2);
				ctx.fill();
			}

			lastDrawnIndexRef.current = pointsRef.current.length;
			onInk?.();

			(e.target as HTMLCanvasElement).setPointerCapture(e.pointerId);
		},
		[disabled, getLocalPoint, onInk],
	);

	const onPointerMove = React.useCallback(
		(e: React.PointerEvent<HTMLCanvasElement>) => {
			if (disabled) return;
			if (!drawingRef.current) return;

			// Prefer coalesced events (prevents gaps at normal speed)
			const native = e.nativeEvent as PointerEvent & {
				getCoalescedEvents?: () => PointerEvent[];
			};

			const coalesced = native.getCoalescedEvents?.() ?? [native];

			for (const ev of coalesced) {
				const pt = getLocalPoint(ev);
				if (!pt) continue;
				pushPoint(pt);
			}

			onInk?.();
		},
		[disabled, getLocalPoint, onInk, pushPoint],
	);

	const onPointerUpOrCancel = React.useCallback(() => {
		drawingRef.current = false;
	}, []);

	const clear = React.useCallback(() => {
		const canvas = canvasRef.current;
		const ctx = ctxRef.current;
		if (!canvas || !ctx) return;

		const rect = canvas.getBoundingClientRect();
		ctx.clearRect(0, 0, rect.width, rect.height);

		pointsRef.current = [];
		lastDrawnIndexRef.current = 0;
		needsDrawRef.current = false;

		if (rafRef.current != null) {
			cancelAnimationFrame(rafRef.current);
			rafRef.current = null;
		}
	}, []);

	const isEmpty = React.useCallback(() => pointsRef.current.length < 2, []);

	const toBlob = React.useCallback(async (): Promise<Blob | null> => {
		const canvas = canvasRef.current;
		if (!canvas) return null;

		return await new Promise((resolve) => {
			canvas.toBlob((b) => resolve(b), "image/png");
		});
	}, []);

	React.useImperativeHandle(ref, () => ({ clear, isEmpty, toBlob }), [
		clear,
		isEmpty,
		toBlob,
	]);

	return (
		<div className={className}>
			<canvas
				ref={canvasRef}
				style={{
					width: width ? `${width}px` : "100%",
					height: height ? `${height}px` : "200px",
					touchAction: "none",
				}}
				className={[
					"block w-full rounded-[10px] border border-[#020202]/[0.15]",
					"shadow-[2px_4px_15px_rgba(2,2,2,0.03)]",
					disabled ? "opacity-60 pointer-events-none" : "",
				].join(" ")}
				onPointerDown={onPointerDown}
				onPointerMove={onPointerMove}
				onPointerUp={onPointerUpOrCancel}
				onPointerCancel={onPointerUpOrCancel}
			/>
		</div>
	);
});
