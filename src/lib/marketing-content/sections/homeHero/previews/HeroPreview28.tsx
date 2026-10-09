"use client";
// Native specimen adapted from @/components/ui/helpers/CopyAction.catalog.
import { useState } from "react";
import {
	CopyStatusIcon,
	useCopyAction,
} from "@/components/ui/helpers/useCopyAction";
import { Button } from "@/components/ui/primitives/Button";

function CopyHarness() {
	const [lastCopied, setLastCopied] = useState("Nothing copied");
	const { copied, handleCopy } = useCopyAction({
		value: "Averlo",
		onCopy: async (value) => setLastCopied(`Copied ${value}`),
		toastMessage: false,
	});
	return (
		<div className="grid gap-3">
			<Button
				onClick={handleCopy}
				leadingIcon={<CopyStatusIcon copied={copied} />}
			>
				Copy name
			</Button>
			<output aria-live="polite">{lastCopied}</output>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => <CopyHarness />;
	return render();
}
export default CatalogPreview1;
