"use client";
// Native specimen adapted from @/components/ui/helpers/IconSwap.catalog.
import { useState } from "react";
import { IconSwap } from "@/components/ui/helpers/IconSwap";
import { Icon } from "@/components/ui/icons/Icon";
import { Button } from "@/components/ui/primitives/Button";

function IconSwapHarness() {
	const [activeIndex, setActiveIndex] = useState(0);
	return (
		<Button
			aria-label={activeIndex === 0 ? "Show password" : "Hide password"}
			onClick={() => setActiveIndex((current) => (current === 0 ? 1 : 0))}
			variant="secondary"
		>
			<span data-testid="swap">
				<IconSwap
					activeIndex={activeIndex}
					items={[
						{ icon: <Icon name="eye" /> },
						{ icon: <Icon name="eye-closed" /> },
					]}
				/>
			</span>
			Password
		</Button>
	);
}
function CatalogPreview1() {
	const render = () => <IconSwapHarness />;
	return render();
}
export default CatalogPreview1;
