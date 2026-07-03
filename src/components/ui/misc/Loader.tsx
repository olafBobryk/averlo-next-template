// components/ui/misc/Loader.tsx

import type { ComponentProps } from "react";
import { Icon } from "@/components/ui/icons/Icon";

type LoaderProps = Omit<ComponentProps<typeof Icon>, "name" | "animate">;

export function Loader({ className, ...rest }: LoaderProps) {
	return <Icon name="spinner" animate className={className} {...rest} />;
}
