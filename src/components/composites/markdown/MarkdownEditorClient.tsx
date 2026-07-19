"use client";

import {
	BlockTypeSelect,
	BoldItalicUnderlineToggles,
	CodeToggle,
	CreateLink,
	codeBlockPlugin,
	codeMirrorPlugin,
	DiffSourceToggleWrapper,
	diffSourcePlugin,
	headingsPlugin,
	ListsToggle,
	linkDialogPlugin,
	linkPlugin,
	listsPlugin,
	MDXEditor,
	type MDXEditorMethods,
	markdownShortcutPlugin,
	quotePlugin,
	Separator,
	thematicBreakPlugin,
	toolbarPlugin,
	UndoRedo,
} from "@mdxeditor/editor";
import * as React from "react";
import { createMarkdownUserMention } from "@/lib/markdown-mentions";
import type {
	MarkdownEditorDensity,
	MarkdownEditorMentionOption,
} from "./MarkdownEditor";

type MarkdownEditorClientProps = {
	ariaLabel: string;
	density: MarkdownEditorDensity;
	disabled: boolean;
	markdown: string;
	mentions?: MarkdownEditorMentionOption[];
	onChange: (markdown: string) => void;
	placeholder?: string;
};

export function MarkdownEditorClient({
	ariaLabel,
	density,
	disabled,
	markdown,
	mentions = [],
	onChange,
	placeholder,
}: MarkdownEditorClientProps) {
	const editorRef = React.useRef<MDXEditorMethods>(null);

	React.useEffect(() => {
		const editor = editorRef.current;
		if (!editor || editor.getMarkdown() === markdown) return;
		editor.setMarkdown(markdown);
	}, [markdown]);

	function insertMention(member: MarkdownEditorMentionOption) {
		editorRef.current?.focus(() => {
			editorRef.current?.insertMarkdown(createMarkdownUserMention(member.id));
		});
	}

	return (
		<div
			className="markdown-editor"
			data-density={density}
			data-disabled={disabled || undefined}
		>
			<MDXEditor
				aria-label={ariaLabel}
				contentEditableClassName="markdown-content markdown-content--compact markdown-editor-content"
				markdown={markdown}
				onChange={onChange}
				placeholder={placeholder ?? "Start writing"}
				plugins={[
					headingsPlugin({ allowedHeadingLevels: [2, 3, 4] }),
					quotePlugin(),
					listsPlugin(),
					linkPlugin(),
					linkDialogPlugin(),
					thematicBreakPlugin(),
					codeBlockPlugin({ defaultCodeBlockLanguage: "" }),
					codeMirrorPlugin({ codeBlockLanguages: {} }),
					markdownShortcutPlugin(),
					diffSourcePlugin(),
					toolbarPlugin({
						toolbarClassName: "markdown-editor-toolbar-shell",
						toolbarContents: () => (
							<DiffSourceToggleWrapper options={["rich-text", "source"]}>
								<UndoRedo />
								<Separator />
								<BlockTypeSelect />
								<Separator />
								<BoldItalicUnderlineToggles />
								<CodeToggle />
								<CreateLink />
								<Separator />
								<ListsToggle />
							</DiffSourceToggleWrapper>
						),
					}),
				]}
				readOnly={disabled}
				ref={editorRef}
			/>
			{mentions.length > 0 ? (
				<fieldset className="markdown-editor-mentions">
					<legend className="text-xs font-medium text-muted-foreground">
						Mention
					</legend>
					{mentions.map((member) => (
						<button
							className="rounded-md border border-border bg-card px-2 py-1 text-xs text-foreground transition-colors hover:bg-muted disabled:opacity-50"
							disabled={disabled}
							key={member.id}
							onClick={() => insertMention(member)}
							type="button"
						>
							@{member.label}
						</button>
					))}
				</fieldset>
			) : null}
		</div>
	);
}
