// components/ui/input/UnitNumberInput.tsx
"use client";

import type * as React from "react";
import { NumberInput } from "@/components/ui/input/NumberInput";

type UnitNumberInputProps = Omit<
	React.ComponentProps<typeof NumberInput>,
	"unit"
> & {
	unit: React.ReactNode;
};

function UnitNumberInputRoot({ unit, ...props }: UnitNumberInputProps) {
	return <NumberInput {...props} unit={unit} />;
}

export const UnitNumberInput = Object.assign(UnitNumberInputRoot, {
	Skeleton: NumberInput.Skeleton,
});
