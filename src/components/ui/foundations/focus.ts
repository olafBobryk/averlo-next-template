export const focusRing = {
	fieldDefault:
		"focus-within:!border-primary/60 focus-within:ring-4 focus-within:ring-primary/10",
	fieldError:
		"focus-within:!border-danger focus-within:ring-4 focus-within:ring-danger/10",
	fieldSuccess:
		"focus-within:!border-success/70 focus-within:ring-4 focus-within:ring-success/10",
	visibleDefault:
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
	visibleError:
		"focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-danger/40 focus-visible:ring-offset-2 focus-visible:ring-offset-background",
	peerDefault:
		"peer-focus-visible:outline peer-focus-visible:outline-offset-2 peer-focus-visible:outline-primary/35",
	peerError:
		"group-data-[tone=error]/field:peer-focus-visible:outline-danger/35",
} as const;
