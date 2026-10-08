/** Shared chrome for full and thin-start input frames. */
export const inputFrameBaseClassName =
	"min-w-0 rounded-[9px] border-0 text-foreground";

export const inputFrameVariantStyles = {
	default:
		"bg-[var(--input-frame-background)] shadow-[var(--input-frame-shadow)]",
	muted: "bg-foreground/5 shadow-none",
} as const;

/** Default chrome for non-interactive surfaces that deliberately share input styling. */
export const inputFrameChromeClassName = `${inputFrameBaseClassName} ${inputFrameVariantStyles.default}`;
