// expect 0
export const snap = { duration: 0, delay: 0, bounce: 0 };
export const tokens = { duration: motionTiming.disclosure.duration };
export const converted = (ms: number) => ({ duration: ms / 1000 });
export const Prop = () => <Motion duration={token} transition={{ duration: 0 }} />;
export const Classes = () => (
	<div className="motion-component transition-opacity duration-(--motion-feedback-duration)" />
);
export const fallback = "transform var(--motion-interaction-duration, 200ms)";
export const unrelated = { timeout: 300, durationMs: undefined };
