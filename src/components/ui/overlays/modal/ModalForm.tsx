"use client";

import clsx from "clsx";
import type * as React from "react";
import {
	ModalStepIndicator,
	type StepIndicatorStep,
} from "@/components/ui/misc/StepIndicator";
import { Button } from "@/components/ui/primitives/Button";
import { ModalContent, ModalFooter } from "./ModalShell";

export type ModalFormProps = Omit<
	React.ComponentPropsWithoutRef<"form">,
	"children"
> & {
	children: React.ReactNode;
	contentClassName?: string;
	footer: React.ReactNode;
	footerClassName?: string;
	formRef?: React.Ref<HTMLFormElement>;
	hiddenFields?: React.ReactNode;
};

export function ModalForm({
	children,
	className,
	contentClassName,
	footer,
	footerClassName,
	formRef,
	hiddenFields,
	noValidate = true,
	...props
}: ModalFormProps) {
	return (
		<form
			className={clsx("contents", className)}
			noValidate={noValidate}
			ref={formRef}
			{...props}
		>
			{hiddenFields}
			<ModalContent className={contentClassName}>{children}</ModalContent>
			<ModalFooter className={footerClassName}>{footer}</ModalFooter>
		</form>
	);
}

export type ModalStepFormPanel<TStep extends string = string> = {
	children: React.ReactNode;
	className?: string;
	id: TStep;
};

export type ModalStepFormProps<TStep extends string = string> = Omit<
	ModalFormProps,
	"children" | "footer"
> & {
	"aria-label"?: string;
	backLabel?: React.ReactNode;
	cancelLabel?: React.ReactNode;
	currentStep: TStep;
	nextLabel?: React.ReactNode;
	onCancel?: () => void;
	onStepChange: (step: TStep) => void;
	panelClassName?: string;
	panels: readonly ModalStepFormPanel<TStep>[];
	stepIndicatorClassName?: string;
	steps: readonly StepIndicatorStep<TStep>[];
	submitAction: React.ReactNode;
};

const stepNavigationAttribute = "data-modal-step-navigation";

export function ModalStepForm<TStep extends string = string>({
	"aria-label": ariaLabel,
	backLabel = "Back",
	cancelLabel = "Cancel",
	contentClassName,
	currentStep,
	nextLabel = "Next",
	onCancel,
	onStepChange,
	onSubmit,
	panelClassName,
	panels,
	stepIndicatorClassName,
	steps,
	submitAction,
	...props
}: ModalStepFormProps<TStep>) {
	const currentIndex = getCurrentStepIndex(steps, currentStep);
	const previousStep = getAdjacentEnabledStep(steps, currentIndex, -1);
	const nextStep = getAdjacentEnabledStep(steps, currentIndex, 1);
	const isFinalStep = !nextStep;

	function handleSubmit(event: React.SubmitEvent<HTMLFormElement>) {
		if (!isFinalStep || isStepNavigationSubmit(event)) {
			event.preventDefault();
			return;
		}
		onSubmit?.(event);
	}

	function goToStep(
		step: TStep | undefined,
		event: React.MouseEvent<HTMLElement>,
	) {
		event.preventDefault();
		event.stopPropagation();
		if (step) onStepChange(step);
	}

	return (
		<ModalForm
			contentClassName={clsx("grid gap-3", contentClassName)}
			footer={
				<>
					{previousStep ? (
						<Button
							{...{ [stepNavigationAttribute]: "true" }}
							leadingIcon="arrow-left"
							onClick={(event) => goToStep(previousStep.id, event)}
							type="button"
							variant="ghost"
						>
							{backLabel}
						</Button>
					) : onCancel ? (
						<Button onClick={onCancel} type="button" variant="ghost">
							{cancelLabel}
						</Button>
					) : null}
					{isFinalStep ? (
						submitAction
					) : (
						<Button
							{...{ [stepNavigationAttribute]: "true" }}
							onClick={(event) => goToStep(nextStep?.id, event)}
							trailingIcon="arrow-right"
							type="button"
						>
							{nextLabel}
						</Button>
					)}
				</>
			}
			onSubmit={handleSubmit}
			{...props}
		>
			<ModalStepIndicator
				aria-label={ariaLabel}
				className={stepIndicatorClassName}
				currentStep={currentStep}
				onStepChange={onStepChange}
				steps={steps}
			/>
			{panels.map((panel) => (
				<div
					className={clsx("grid gap-3", panelClassName, panel.className)}
					hidden={panel.id !== currentStep}
					key={panel.id}
				>
					{panel.children}
				</div>
			))}
		</ModalForm>
	);
}

function getCurrentStepIndex<TStep extends string>(
	steps: readonly StepIndicatorStep<TStep>[],
	currentStep: TStep,
) {
	const currentIndex = steps.findIndex((step) => step.id === currentStep);
	return currentIndex >= 0 ? currentIndex : 0;
}

function getAdjacentEnabledStep<TStep extends string>(
	steps: readonly StepIndicatorStep<TStep>[],
	currentIndex: number,
	direction: -1 | 1,
) {
	for (
		let index = currentIndex + direction;
		index >= 0 && index < steps.length;
		index += direction
	) {
		const step = steps[index];
		if (!step?.disabled) return step;
	}
	return undefined;
}

function isStepNavigationSubmit(event: React.SubmitEvent<HTMLFormElement>) {
	const submitter = (event.nativeEvent as SubmitEvent).submitter;
	return (
		submitter instanceof HTMLElement &&
		submitter.getAttribute(stepNavigationAttribute) === "true"
	);
}
