/**
 * The sheet presentation: a full-width panel docked to the bottom edge. It is
 * safe-area aware, caps at 85svh and stays fixed while its content scrolls
 * inside a ScrollArea. Important modifiers beat anchored width, position and
 * radius classes from the panel and its callers.
 */
export const dropdownSheetClassName =
	"top-auto! right-0! bottom-0! left-0! w-full! min-w-0! max-w-none! max-h-[85svh]! overflow-hidden! rounded-b-none! pb-[env(safe-area-inset-bottom)]!";
