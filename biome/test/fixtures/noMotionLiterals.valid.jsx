// expect 0
export const snap = { duration: 0, delay: 0, bounce: 0 };
export const tokens = { duration: motionTiming.smooth.duration };
export const converted = (ms: number) => ({ duration: ms / 1000 });
export const Prop = () => <Motion duration={token} transition={{ duration: 0 }} />;
export const Classes = () => (
	<div className="motion-smooth transition-opacity duration-(--motion-snap-duration)" />
);
export const fallback = "transform var(--motion-quick-duration, 160ms)";
export const unrelated = { timeout: 300, durationMs: undefined };
