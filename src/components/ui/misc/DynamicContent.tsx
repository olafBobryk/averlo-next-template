"use client";

import { AnimatePresence, motion } from "framer-motion";
import type * as React from "react";
import { Loader } from "@/components/ui/misc/Loader";
import { Button } from "@/components/ui/primitives/Button";
import { Text } from "@/components/ui/primitives/Text";

const transition = {
	duration: 0.26,
	ease: [0.16, 1, 0.3, 1] as [number, number, number, number],
};

type Tag = keyof React.JSX.IntrinsicElements;

type DynamicContentProps = {
	loading: boolean;
	error: Error | null;
	onRetry?: () => void;
	children: React.ReactNode;
	className?: string;
	load?: React.ReactNode;

	/**
	 * Which HTML tag to animate as.
	 * - "div" (default) for normal blocks / cards / modals
	 * - "tr" for table rows inside <tbody>
	 */
	tag?: Tag;

	/**
	 * Only used when tag === "tr"
	 */
	colSpan?: number;
};

export function DynamicContent({
	loading,
	error,
	onRetry,
	children,
	tag = "div",
	colSpan = 1,
	className = "",
	load,
}: DynamicContentProps) {
	const state = loading ? "loading" : error ? "error" : "content";
	const loadNode = load ?? <Loader className="text-foreground" />;

	// map tag -> motion[tag]
	const MotionTag: any = (motion as any)[tag] ?? motion.div;

	// Special handling for table-row mode
	if (tag === "tr") {
		return (
			<AnimatePresence mode="wait" initial={false}>
				{state === "loading" && (
					<MotionTag
						key="loading"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={transition}
						className={className}
					>
						<td
							colSpan={colSpan}
							className="px-8 py-[31px] text-center align-middle"
						>
							{loadNode}
						</td>
					</MotionTag>
				)}

				{state === "error" && (
					<MotionTag
						key="error"
						initial={{ opacity: 0, y: 6 }}
						animate={{ opacity: 1, y: 0 }}
						exit={{ opacity: 0, y: -6 }}
						transition={transition}
						className={className}
					>
						<td
							colSpan={colSpan}
							className="py-4 px-4 text-center align-middle"
						>
							<div className="inline-flex w-full items-center justify-between gap-3 rounded-[12px] border border-danger/20 bg-danger/10 px-4 py-3 text-left">
								<Text variant="muted">
									{error?.message ||
										"Something went wrong while loading this content."}
								</Text>
								{onRetry && (
									<Button variant="outline" size="sm" onClick={onRetry}>
										Retry
									</Button>
								)}
							</div>
						</td>
					</MotionTag>
				)}

				{state === "content" && <>{children}</>}
			</AnimatePresence>
		);
	}

	// Default block mode
	return (
		<AnimatePresence mode="wait" initial={false}>
			{state === "loading" && (
				<MotionTag
					key="loading"
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -6 }}
					transition={transition}
					className={`${className} h-[54px] flex justify-center`}
				>
					{loadNode}
				</MotionTag>
			)}

			{state === "error" && (
				<MotionTag
					key="error"
					initial={{ opacity: 0, y: 6 }}
					animate={{ opacity: 1, y: 0 }}
					exit={{ opacity: 0, y: -6 }}
					transition={transition}
					className={className}
				>
					<div className="flex items-center justify-between gap-3 rounded-[12px] border border-danger/20 bg-danger/10 px-4 py-3">
						<Text variant="muted">
							{error?.message ||
								"Something went wrong while loading this content."}
						</Text>
						{onRetry && (
							<Button variant="outline" size="sm" onClick={onRetry}>
								Retry
							</Button>
						)}
					</div>
				</MotionTag>
			)}

			{state === "content" && <>{children}</>}
		</AnimatePresence>
	);
}
