import { ModalShell } from "@/components/ui/floating/modal/ModalShell";
import { Button } from "@/components/ui/primitives/Button";
import { Icon } from "@/components/ui/primitives/Icon";
import { Text } from "@/components/ui/primitives/Text";
import { NAV_LINKS } from "@/config/navConfig";

export default function HeaderCompactModal({
	navLinks = NAV_LINKS,
	isModalOpen = false,
	handleChangeModal,
}: {
	navLinks?: { name: string; link: string }[];
	isModalOpen: boolean;
	handleChangeModal: () => void;
}) {
	return (
		<ModalShell
			animate={{ y: false }}
			onClose={handleChangeModal}
			portalTargetId="header-compact-modal-root"
			wrapperClassName="items-start justify-start !p-0"
			backdropClassName="bg-black/30"
			data-open={isModalOpen}
			panelClassName="h-screen w-full max-w-none rounded-none border-0 bg-white shadow-none px-section-x data-[open=false]:pointer-events-none"
			panelStyle={{ boxShadow: "none" }}
		>
			<nav className="flex h-full w-full flex-col divide-y divide-border/15 pt-[100px] ">
				{navLinks.map((obj) => (
					<Button
						key={obj.name}
						href={obj.link}
						variant="ghost"
						align="left"
						className="group flex !w-full !items-center !justify-between rounded-none !py-4 text-foreground"
						onClick={handleChangeModal}
					>
						<Text variant="bodyStrong" className="capitalize !text-lg">
							{obj.name}
						</Text>
						<Icon
							name="arrow-right"
							size="lg"
							className="text-muted-foreground transition-transform duration-200 group-hover:translate-x-1"
						/>
					</Button>
				))}
			</nav>
		</ModalShell>
	);
}
