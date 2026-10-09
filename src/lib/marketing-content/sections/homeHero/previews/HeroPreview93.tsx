"use client";
// Native specimen adapted from @/components/ui/primitives/Listbox.catalog.
import {
	Listbox,
	type ListboxOption,
} from "@/components/ui/primitives/Listbox";
import { Text } from "@/components/ui/primitives/Text";

const stateOptions: ListboxOption<string>[] = [
	{ value: "alpha", content: "Alpha workspace", selected: true },
	{ value: "disabled", content: "Archived workspace", disabled: true },
	{
		value: "warning",
		content: "Needs review",
		tone: "warning",
		dividerBefore: true,
	},
	{ value: "danger", content: "Remove access", tone: "danger" },
	{
		value: "presentation",
		layout: "presentation",
		content: (
			<div className="grid gap-1">
				<Text variant="bodyStrong">Presentation row</Text>
				<Text tone="muted" variant="caption">
					Allows owned multi-line content.
				</Text>
			</div>
		),
	},
];
const semanticSelect = () => undefined;
function CatalogPreview1() {
	const render = () => (
		<Listbox
			ariaLabel="Workspace states"
			listTabIndex={0}
			onSelect={semanticSelect}
			options={stateOptions}
		/>
	);
	return render();
}
export default CatalogPreview1;
