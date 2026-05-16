"use client";

import clsx from "clsx";
import Logo from "@/components/branding/Logo";
import { MotionScene } from "@/components/ui/motion/MotionScene";
import { RevealGroup, RevealGroupItem } from "@/components/ui/motion/Reveal";
import { Text } from "@/components/ui/primitives/Text";

type StatusContentProps = {
	heading: React.ReactNode;
	body: React.ReactNode;
	actions?: React.ReactNode;
	details?: React.ReactNode;
	className?: string;
	enableRevealMotion?: boolean;
};

export function StatusContent({
	heading,
	body,
	actions,
	details,
	className,
	enableRevealMotion = true,
}: StatusContentProps) {
	return (
		<div
			className={clsx(
				"flex w-full max-w-xl flex-col items-center justify-center gap-3 text-center",
				className,
			)}
		>
			{enableRevealMotion ? (
				<MotionScene>
					<RevealGroup className="flex w-full flex-col items-center justify-center gap-3">
						<RevealGroupItem>
							<Logo size="md" variant="mark" />
						</RevealGroupItem>
						<RevealGroupItem>
							<Text as="h1" variant="headingXl">
								{heading}
							</Text>
						</RevealGroupItem>
						<RevealGroupItem>
							<Text variant="body" tone="muted">
								{body}
							</Text>
						</RevealGroupItem>
						{actions ? (
							<RevealGroupItem>
								<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
									{actions}
								</div>
							</RevealGroupItem>
						) : null}
					</RevealGroup>
				</MotionScene>
			) : (
				<>
					<Logo size="md" variant="mark" />
					<Text as="h1" variant="headingXl">
						{heading}
					</Text>
					<Text variant="body" tone="muted">
						{body}
					</Text>
					{actions ? (
						<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
							{actions}
						</div>
					) : null}
				</>
			)}
			{details}
		</div>
	);
}
