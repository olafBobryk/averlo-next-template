"use client";
// Native specimen adapted from @/components/ui/misc/ProfilePicture.catalog.
import { Icon } from "@/components/ui/icons/Icon";
import { ProfilePicture } from "@/components/ui/misc/ProfilePicture";
import heroImage0 from "../../../../../../public/test/placeholder-portrait.jpg";

function CatalogPreview1() {
	const render = () => (
		<div className="flex items-end gap-3">
			<ProfilePicture name="Ada Lovelace" size="sm" src={heroImage0.src} />
			<ProfilePicture
				fallback="?"
				alt="Unknown profile"
				size="lg"
				tone="neutral"
			/>
			<ProfilePicture
				alt="Organization"
				fallback={<Icon name="building" size="sm" />}
				size="md"
			/>
			<ProfilePicture.Skeleton size="xl" />
		</div>
	);
	return render();
}
export default CatalogPreview1;
