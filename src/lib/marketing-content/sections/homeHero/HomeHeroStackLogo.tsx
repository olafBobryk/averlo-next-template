import { Text } from "@/components/ui/primitives/Text";
import type { StackLogo } from "./stackLogos";

export function HomeHeroStackLogo({ logo }: { logo: StackLogo }) {
	return (
		<div className="grid justify-items-center gap-4" data-hero-stack-logo="">
			<svg
				viewBox={logo.viewBox}
				fill="currentColor"
				aria-hidden="true"
				className="size-32 text-foreground"
			>
				{logo.paths.map((path) => (
					<path key={path} d={path} />
				))}
			</svg>
			<Text as="span" variant="headingSm">
				{logo.name}
			</Text>
		</div>
	);
}
