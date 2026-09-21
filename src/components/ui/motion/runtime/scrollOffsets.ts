/** Translate Motion's vertical edge syntax without changing numeric fractions. */
function point(value: unknown) {
	if (typeof value === "number") return `${value * 100}%`;
	if (value === "start") return "top";
	if (value === "end") return "bottom";
	if (typeof value === "string" && /^-?(?:\d+\.?\d*|\.\d+)$/.test(value))
		return `${Number(value) * 100}%`;
	return String(value);
}
export function toScrollTriggerPosition(value: unknown, fallback: string) {
	if (Array.isArray(value)) return value.map(point).join(" ");
	if (typeof value === "number") return `${point(value)} ${point(value)}`;
	if (typeof value === "string") {
		const points = value.trim().split(/\s+/);
		if (points.length === 1)
			points.push(
				["start", "center", "end"].includes(points[0]) ? points[0] : "0",
			);
		return points.map(point).join(" ");
	}
	return fallback;
}
