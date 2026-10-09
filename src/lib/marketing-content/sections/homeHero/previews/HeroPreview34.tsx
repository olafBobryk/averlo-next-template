"use client";
// Native specimen adapted from @/components/ui/input/choice/MultiselectInput.catalog.
import { MultiselectInput } from "@/components/ui/input/choice/MultiselectInput";

const onChange = () => undefined;
const options = [
	{ value: "email", label: "Email" },
	{ value: "sms", label: "SMS" },
];
function CatalogPreview1() {
	const render = () => (
		<MultiselectInput
			defaultValue={["email"]}
			label="Notifications"
			name="notifications"
			onChange={onChange}
			options={options}
		/>
	);
	return render();
}
export default CatalogPreview1;
