// expect 0
export const Hidden = () => <div className="overflow-hidden overflow-x-clip overflow-visible" />;
export const Capped = () => <div className="max-h-80 max-h-[70vh] min-h-0" />;
export const Rows = () => <div className="grid grid-rows-[auto_1fr]" />;
export const style = { overflow: "hidden" };
