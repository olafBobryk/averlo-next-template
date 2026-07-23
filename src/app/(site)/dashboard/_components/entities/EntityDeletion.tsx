"use client";

import { useRouter } from "next/navigation";
import { useConfirmationModal } from "@/components/ui/overlays/modal/useConfirmationModal";
import {
	Dropdown,
	type DropdownMenuOption,
} from "@/components/ui/primitives/Dropdown";
import { showToast } from "@/lib/feedback/toast";
import type {
	DashboardEntityDeletionDefinition,
	DashboardEntityMutationResult,
} from "../../_lib/entity-lifecycle";

type EntityDeletionOptionProps = {
	deleteEntity: () => Promise<DashboardEntityMutationResult>;
	definition: DashboardEntityDeletionDefinition;
	onDeleted?: () => void;
	onOptimisticDelete?: () => void;
	onRollback?: () => void;
};

export function useEntityDeletionOption({
	deleteEntity,
	definition,
	onDeleted,
	onOptimisticDelete,
	onRollback,
}: EntityDeletionOptionProps): DropdownMenuOption {
	const router = useRouter();
	const { openConfirmation } = useConfirmationModal();
	return Dropdown.menuOptions.delete({
		disabled: Boolean(definition.disabledReason),
		label: definition.disabledReason ?? "Delete",
		onSelect: (event) => {
			event.preventDefault();
			openConfirmation({
				confirmLabel: "Delete",
				confirmTone: "danger",
				description:
					definition.summary ??
					`This will delete the ${definition.entityTypeLabel.toLowerCase()} “${definition.entityLabel}”.`,
				details: definition.impacts,
				onConfirm: async () => {
					onOptimisticDelete?.();
					const result = await deleteEntity();
					if (!result.ok) {
						onRollback?.();
						showToast.error(result.message, { title: "Deletion failed" });
						return false;
					}
					showToast.success(result.message, { title: "Deleted" });
					onDeleted?.();
					router.refresh();
					return true;
				},
				title: `Delete ${definition.entityLabel}?`,
				warning: definition.warning,
			});
		},
	});
}

export function EntityDeletionDetailMenu({
	ariaLabel,
	deleteEntity,
	definition,
	onDeleted,
	onOptimisticDelete,
	onRollback,
}: EntityDeletionOptionProps & { ariaLabel?: string }) {
	const option = useEntityDeletionOption({
		deleteEntity,
		definition,
		onDeleted,
		onOptimisticDelete,
		onRollback,
	});
	return (
		<Dropdown.Menu
			ariaLabel={ariaLabel ?? `Open actions for ${definition.entityLabel}`}
			openOnHover={false}
			options={[option]}
			positionStrategy="fixed"
		/>
	);
}
