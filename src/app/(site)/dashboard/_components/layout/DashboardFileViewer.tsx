"use client";

import { usePathname } from "next/navigation";
import type { ReactNode } from "react";
import { FileViewerLayout } from "@/components/composites/file-viewer";
import { useDashboardAuth } from "../providers/DashboardAuthProvider";

export function DashboardFileViewer({ children }: { children: ReactNode }) {
	const path = usePathname();
	const { user, organization } = useDashboardAuth();
	return (
		<FileViewerLayout resetKey={`${path}:${user?.id}:${organization.id}`}>
			{children}
		</FileViewerLayout>
	);
}
