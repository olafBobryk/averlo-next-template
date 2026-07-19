export const focusRing = {
	fieldDefault:
		"focus-within:border-ring focus-within:ring-3 focus-within:ring-ring/30",
	fieldError:
		"border-danger ring-3 ring-danger/20 dark:border-danger/50 dark:ring-danger/40",
	fieldSuccess: "border-success/70 ring-3 ring-success/20",
	visibleDefault:
		"focus-visible:border-ring focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30",
	visibleInner:
		"focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-ring/30 focus-visible:ring-inset",
	visibleError:
		"focus-visible:border-danger/40 focus-visible:outline-none focus-visible:ring-3 focus-visible:ring-danger/20",
	peerDefault:
		"peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-ring/50",
	peerError:
		"group-data-[tone=error]/field:peer-focus-visible:outline-danger/35",
} as const;
