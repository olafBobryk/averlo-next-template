"use client";
// Native specimen adapted from @/components/domain/assistant/Controls.catalog.
import { Composer } from "@/components/domain/assistant/Composer";

function Preview() {
	return (
		<Composer
			attachments={[]}
			busy={false}
			canWrite
			onAddFiles={() => {}}
			onRemoveAttachment={() => {}}
			onStop={() => {}}
			onSubmit={() => {}}
			onToolModeChange={() => {}}
			toolMode="read_write"
		/>
	);
}
export default Preview;
