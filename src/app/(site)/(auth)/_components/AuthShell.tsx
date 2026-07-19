export function AuthShell({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="relative isolate grid min-h-dvh place-items-center overflow-hidden bg-background px-4 py-12 text-foreground">
			<div
				aria-hidden
				className="pointer-events-none absolute inset-x-0 top-0 h-72 bg-[radial-gradient(circle_at_top,var(--color-spectrum-blue-soft),transparent_68%)] opacity-70 dark:opacity-25"
			/>
			<div className="relative z-10 w-full max-w-md">{children}</div>
		</main>
	);
}
