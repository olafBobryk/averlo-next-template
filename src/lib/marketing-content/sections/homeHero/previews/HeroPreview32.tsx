"use client";
// Native specimen adapted from @/components/ui/input/choice/ChoiceField.catalog.
import { useState } from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import { ChoiceIndicatorMulti } from "@/components/ui/input/choice/ChoiceIndicators";

function ChoiceFieldExample() {
	const [checked, setChecked] = useState(false);
	return (
		<ChoiceField
			checked={checked}
			description="Receive release notes by email."
			id="choice-field-updates"
			indicator={<ChoiceIndicatorMulti checked={checked} />}
			inputType="checkbox"
			label="Product updates"
			onChange={(_, nextChecked) => setChecked(nextChecked)}
			value="updates"
		/>
	);
}
function CatalogPreview1() {
	const render = () => <ChoiceFieldExample />;
	return render();
}
export default CatalogPreview1;
