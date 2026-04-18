"use client";

import clsx from "clsx";
import Logo from "@/components/branding/Logo";
import { MotionScene } from "@/components/ui/motion/MotionScene";
import { RevealGroup, RevealItem } from "@/components/ui/motion/Reveal";
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
						<RevealItem>
							<Logo size="md" variant="mark" />
						</RevealItem>
						<RevealItem>
							<Text as="h1" variant="headingXl">
								{heading}
							</Text>
						</RevealItem>
						<RevealItem>
							<Text variant="body" tone="muted">
								{body}
							</Text>
						</RevealItem>
						{actions ? (
							<RevealItem>
								<div className="mt-2 flex flex-wrap items-center justify-center gap-3">
									{actions}
								</div>
							</RevealItem>
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
