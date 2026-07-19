import clsx from "clsx";
import type {
	AccordionProps,
	AccordionSkeletonProps,
} from "@/components/ui/misc/Accordion.shared";
import { AccordionClient } from "@/components/ui/misc/AccordionClient";
import { Skeleton } from "@/components/ui/misc/Skeleton";

export type { AccordionProps, AccordionSkeletonProps };

function AccordionRoot(props: AccordionProps) {
	return <AccordionClient {...props} />;
}

export function AccordionSkeleton({
	className,
	titleClassName,
	triggerClassName,
}: AccordionSkeletonProps) {
	return (
		<div
			aria-hidden="true"
			className={clsx(
				"rounded-md border border-border/70 bg-surface/60",
				className,
			)}
		>
			<div
				className={clsx(
					"flex min-h-11 w-full items-center gap-1.5 rounded-md px-3 py-2.5",
					triggerClassName,
				)}
			>
				<span className="grid size-6 shrink-0 place-items-center">
					<Skeleton as="span" className="size-3.5 rounded-sm" />
				</span>
				<span className="grid min-w-0 flex-1 gap-0.5">
					<Skeleton
						as="span"
						className={clsx(
							"block h-4 w-36 rounded-md bg-muted/80",
							titleClassName,
						)}
					/>
				</span>
				<span className="grid size-6 shrink-0 place-items-center">
					<Skeleton as="span" className="size-3.5 rounded-sm" />
				</span>
			</div>
		</div>
	);
}

export const Accordion = Object.assign(AccordionRoot, {
	Skeleton: AccordionSkeleton,
});
