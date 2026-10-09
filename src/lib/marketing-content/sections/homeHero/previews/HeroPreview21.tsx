"use client";
// Native specimen adapted from @/components/domain/marketing/DocumentPage.catalog.
import { DocumentPage } from "@/components/domain/marketing/DocumentPage";

const documentPageProps = {
	date: "2026-08-15T12:00:00.000Z",
	title: "Motion and interaction guidelines",
	markdown: `## Overview

Motion should clarify hierarchy, causality, and change. It should never be required to understand the interface.

## Details

The document owner composes canonical page metadata with pure Markdown rendering.`,
};
function CatalogPreview() {
	return <DocumentPage {...documentPageProps} />;
}
export default CatalogPreview;
