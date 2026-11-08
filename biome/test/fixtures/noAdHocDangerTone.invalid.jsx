// expect 4
export const Message = () => <p className="text-danger text-sm">Failed</p>;
export const Variant = () => <p className="mt-2 hover:text-danger-text">Failed</p>;
export const Border = () => <div className={`rounded ${x} border-danger/20`} />;
export const map = { danger: "!text-danger-text" };
