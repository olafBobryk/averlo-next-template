/**
 * Deterministic, center-out rectangle packing. No DOM or framework dependency.
 * The first item is centred on `start`; items marked `keepClear` never
 * overlap `avoid`. The result is centred on the packed content's bounds, whose
 * size it returns with that centre (`offset`) in the input coordinates.
 */
export function packCenterOut(
	items,
	{ gap = 14, aspect = 984 / 1180, avoid, start = { x: 0, y: 0 } } = {},
) {
	if (
		!Number.isFinite(gap) ||
		gap < 0 ||
		!Number.isFinite(aspect) ||
		aspect <= 0
	)
		throw new Error("Invalid packing options");
	const placed = [];
	let bounds = { left: 0, top: 0, right: 0, bottom: 0 };
	const ordered = items
		.map((item, index) => ({ ...item, index }))
		.sort(
			(a, b) =>
				(b.priority ?? 0) - (a.priority ?? 0) ||
				b.width * b.height - a.width * a.height ||
				a.index - b.index,
		);
	for (const item of ordered) {
		if (
			!(
				item.width > 0 &&
				item.height > 0 &&
				Number.isFinite(item.width) &&
				Number.isFinite(item.height)
			)
		)
			throw new Error("Invalid rectangle");
		let best;
		const candidates = placed.length
			? placed.flatMap((r) => [
					...[
						r.y,
						r.y + r.height - item.height,
						r.y + (r.height - item.height) / 2,
					].flatMap((y) => [
						{ x: r.x - item.width - gap, y },
						{ x: r.x + r.width + gap, y },
					]),
					...[
						r.x,
						r.x + r.width - item.width,
						r.x + (r.width - item.width) / 2,
					].flatMap((x) => [
						{ x, y: r.y - item.height - gap },
						{ x, y: r.y + r.height + gap },
					]),
				])
			: [{ x: start.x - item.width / 2, y: start.y - item.height / 2 }];
		for (const candidate of candidates) {
			const r = { ...item, ...candidate };
			if (
				avoid &&
				item.keepClear &&
				r.x < avoid.right + gap &&
				r.x + r.width + gap > avoid.left &&
				r.y < avoid.bottom + gap &&
				r.y + r.height + gap > avoid.top
			)
				continue;
			if (
				placed.some(
					(p) =>
						r.x < p.x + p.width + gap - 0.01 &&
						r.x + r.width + gap > p.x + 0.01 &&
						r.y < p.y + p.height + gap - 0.01 &&
						r.y + r.height + gap > p.y + 0.01,
				)
			)
				continue;
			const b = placed.length
				? {
						left: Math.min(bounds.left, r.x),
						top: Math.min(bounds.top, r.y),
						right: Math.max(bounds.right, r.x + r.width),
						bottom: Math.max(bounds.bottom, r.y + r.height),
					}
				: { left: r.x, top: r.y, right: r.x + r.width, bottom: r.y + r.height };
			const w = b.right - b.left,
				h = b.bottom - b.top;
			// Minimize the envelope in the requested canvas ratio; reward compactness
			// and nearby placements as deterministic tie-breakers.
			const score =
				Math.max(w / aspect, h) ** 2 +
				w * h * 0.15 +
				((r.x + r.width / 2) ** 2 + (r.y + r.height / 2) ** 2) * 0.08;
			if (!best || score < best.score) best = { r, b, score };
		}
		if (!best) throw new Error("No non-overlapping placement");
		placed.push(best.r);
		bounds = best.b;
	}
	const centerX = (bounds.left + bounds.right) / 2,
		centerY = (bounds.top + bounds.bottom) / 2;
	const width = bounds.right - bounds.left,
		height = bounds.bottom - bounds.top;
	return {
		width,
		height,
		offset: { x: centerX, y: centerY },
		items: placed
			.sort((a, b) => a.index - b.index)
			.map(({ index, ...r }) => ({
				...r,
				x: r.x - centerX,
				y: r.y - centerY,
			})),
	};
}
