"use client";

import { memo } from "react";
import * as Markdown from "@/components/composites/markdown";

export const Response = memo(function AssistantResponse({
	streaming = false,
	text,
}: {
	streaming?: boolean;
	text: string;
}) {
	return (
		<Markdown.Render
			className="[&>:first-child]:!mt-0 [&>:last-child]:!mb-0 [&>.markdown-streaming-engine>:first-child]:!mt-0 [&>.markdown-streaming-engine>:last-child]:!mb-0"
			density="compact"
			markdown={text}
			streaming={streaming}
			variant="result"
		/>
	);
});
