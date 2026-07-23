export function AuthShell({
	children,
}: Readonly<{
	children: React.ReactNode;
}>) {
	return (
		<main className="grid min-h-dvh place-items-center bg-background px-4 py-12 text-foreground">
			<div className="w-full max-w-md">{children}</div>
		</main>
	);
}
