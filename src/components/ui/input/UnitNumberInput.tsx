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

export function UnitNumberInput({ unit, ...props }: UnitNumberInputProps) {
	return <NumberInput {...props} unit={unit} />;
}
