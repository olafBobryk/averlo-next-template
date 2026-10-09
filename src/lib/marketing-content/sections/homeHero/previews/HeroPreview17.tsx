"use client";
// Native specimen adapted from @/components/composites/markdown/Markdown.catalog.
import { MarkdownRenderer } from "@/components/composites/markdown/MarkdownRenderer";

const teachingMarkdown = `# Release notes

Markdown output uses shared typography, links, controls, and task indicators.

- [x] Preserve semantic headings
- [ ] Verify the next release

| Surface | Owner |
| --- | --- |
| Actions | Button |
| Tasks | ChoiceIndicatorMulti |

<u>Allowlisted underline</u>

::button[Read the guide]{href=/docs variant=primary tone=default size=md}`;
function CatalogPreview1() {
	return <MarkdownRenderer markdown={teachingMarkdown} />;
}
export default CatalogPreview1;
