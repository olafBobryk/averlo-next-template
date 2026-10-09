"use client";
// Native specimen adapted from @/components/ui/input/choice/ChoiceIndicators.catalog.
import { useState } from "react";
import { ChoiceField } from "@/components/ui/input/choice/ChoiceField";
import {
	ChoiceIndicatorMulti,
	ChoiceIndicatorRadio,
	ChoiceIndicatorToggle,
} from "@/components/ui/input/choice/ChoiceIndicators";

function IndicatorExample() {
	const [radio, setRadio] = useState("team");
	const [multi, setMulti] = useState(["mentions"]);
	const [toggles, setToggles] = useState(["motion"]);
	const toggleMulti = (value: string, checked: boolean) =>
		setMulti((current) =>
			checked
				? Array.from(new Set([...current, value]))
				: current.filter((item) => item !== value),
		);
	const toggleSetting = (value: string, checked: boolean) =>
		setToggles((current) =>
			checked
				? Array.from(new Set([...current, value]))
				: current.filter((item) => item !== value),
		);
	return (
		<div className="grid gap-4">
			<ChoiceField
				checked={radio === "team"}
				id="indicator-radio-team"
				indicator={<ChoiceIndicatorRadio checked={radio === "team"} />}
				label="Team workspace"
				name="indicator-radio"
				onChange={setRadio}
				value="team"
			/>
			<ChoiceField
				checked={radio === "private"}
				id="indicator-radio-private"
				indicator={<ChoiceIndicatorRadio checked={radio === "private"} />}
				label="Private drafts"
				name="indicator-radio"
				onChange={setRadio}
				value="private"
			/>
			<ChoiceField
				checked={multi.includes("mentions")}
				id="indicator-checkbox-mentions"
				indicator={
					<ChoiceIndicatorMulti checked={multi.includes("mentions")} />
				}
				inputType="checkbox"
				label="Mentions"
				name="indicator-checkbox"
				onChange={(value, checked) => toggleMulti(value, checked)}
				value="mentions"
			/>
			<ChoiceField
				checked={multi.includes("sms")}
				disabled
				id="indicator-checkbox-sms"
				indicator={
					<ChoiceIndicatorMulti checked={multi.includes("sms")} disabled />
				}
				inputType="checkbox"
				label="SMS alerts"
				name="indicator-checkbox"
				onChange={(value, checked) => toggleMulti(value, checked)}
				value="sms"
			/>
			<ChoiceField
				checked={toggles.includes("motion")}
				id="indicator-toggle-motion"
				indicator={
					<ChoiceIndicatorToggle checked={toggles.includes("motion")} />
				}
				inputType="checkbox"
				label="Reduced motion"
				name="indicator-toggle"
				onChange={(value, checked) => toggleSetting(value, checked)}
				value="motion"
			/>
			<ChoiceField
				checked={toggles.includes("scroll")}
				id="indicator-toggle-scroll"
				indicator={
					<ChoiceIndicatorToggle checked={toggles.includes("scroll")} />
				}
				inputType="checkbox"
				label="Smooth scrolling"
				name="indicator-toggle"
				onChange={(value, checked) => toggleSetting(value, checked)}
				value="scroll"
			/>
		</div>
	);
}
function CatalogPreview1() {
	const render = () => <IndicatorExample />;
	return render();
}
export default CatalogPreview1;
