// expect 9
export const Scroll = () => <div className="max-h-80 overflow-y-auto" />;
export const Both = () => <div className="overflow-auto" />;
export const Horizontal = () => <div className={`flex ${x} overflow-x-scroll`} />;
export const Variant = () => <div className="md:overflow-y-scroll" />;
export const Collapse = () => <div className="max-h-0 overflow-hidden" />;
export const Grid = () => <div className="grid data-[open=false]:grid-rows-[0fr]" />;
export const GridTransition = () => <div className="transition-[grid-template-rows,opacity]" />;
export const Interpolate = () => <div className="[interpolate-size:allow-keywords]" />;
export const style = { overflowY: "auto" };
