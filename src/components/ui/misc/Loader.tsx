// components/ui/misc/LoaderDots.tsx

import clsx from "clsx";
import type { HTMLAttributes } from "react";

const DOTS = [0, 1, 2] as const;

/**
 * Three-dot loader with staggered rise + slower decay.
 * Scoped keyframes live inline to avoid global CSS.
 */
export function Loader({ className, ...rest }: HTMLAttributes<HTMLDivElement>) {
	return (
		<div
			className={clsx("inline-flex items-center gap-1.5", className)}
			{...rest}
		>
			<style jsx>{`
				@keyframes loader-dot-local {
					0% {
						opacity: 0.1;
					}
					35% {
						opacity: 1;
					}
					100% {
						opacity: 0;
					}
				}
			`}</style>
			{DOTS.map((i) => (
				<span
					// eslint-disable-next-line react/no-array-index-key
					key={i}
					className="h-1.5 w-1.5 rounded-full bg-current"
					style={{
						opacity: 0,
						animation: "loader-dot-local 1.4s ease-in-out infinite",
						animationDelay: `${i * 260}ms`,
						animationTimingFunction: "cubic-bezier(0.25, 0.1, 0.25, 1)",
					}}
				/>
			))}
		</div>
	);
}
