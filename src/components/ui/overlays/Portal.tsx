import { type ReactNode, useEffect, useState } from "react";
import { createPortal } from "react-dom";

interface PortalProps {
	children: ReactNode;
	target?: string; // optional id
}

const Portal: React.FC<PortalProps> = ({ children, target }) => {
	const [mounted, setMounted] = useState(false);

	useEffect(() => {
		setMounted(true);
	}, []);

	if (!mounted) return null;

	const defaultTarget = document.body;
	const portalTarget = target
		? (document.getElementById(target) ?? defaultTarget)
		: defaultTarget;

	return createPortal(children, portalTarget);
};

export default Portal;
