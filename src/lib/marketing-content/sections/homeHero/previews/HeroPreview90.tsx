"use client";
// Native specimen adapted from @/components/ui/primitives/Field.catalog.
import { Field } from "@/components/ui/primitives/Field";
import {
	InputFrame,
	inputVariants,
} from "@/components/ui/primitives/InputFrame";

function CatalogPreview1() {
	const render = () => (
		<Field
			label="Project name"
			description="Use a name teammates will recognize."
			message="A project name is required."
			tone="error"
			required
			inputId="project-name"
			descriptionId="project-name-description"
			messageId="project-name-message"
		>
			<InputFrame fullWidth tone="error">
				<input
					id="project-name"
					aria-describedby="project-name-description"
					aria-errormessage="project-name-message"
					aria-invalid="true"
					className={inputVariants()}
				/>
			</InputFrame>
		</Field>
	);
	return render();
}
export default CatalogPreview1;
