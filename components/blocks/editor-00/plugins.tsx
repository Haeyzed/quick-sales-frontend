"use client"

import { useState } from "react"
import { LexicalErrorBoundary } from "@lexical/react/LexicalErrorBoundary"
import { RichTextPlugin } from "@lexical/react/LexicalRichTextPlugin"
import { HistoryPlugin } from "@lexical/react/LexicalHistoryPlugin"
import { ListPlugin } from "@lexical/react/LexicalListPlugin"
import {
  $convertFromMarkdownString,
  $convertToMarkdownString,
  TRANSFORMERS,
} from "@lexical/markdown"

import { ContentEditable } from "@/components/editor/editor-ui/content-editable"
import { ToolbarPlugin } from "@/components/editor/plugins/toolbar/toolbar-plugin"
import { BlockFormatDropDown } from "@/components/editor/plugins/toolbar/block-format-toolbar-plugin"
import { FormatParagraph } from "@/components/editor/plugins/toolbar/block-format/format-paragraph"
import { FormatHeading } from "@/components/editor/plugins/toolbar/block-format/format-heading"
import { FormatBulletedList } from "@/components/editor/plugins/toolbar/block-format/format-bulleted-list"
import { FormatNumberedList } from "@/components/editor/plugins/toolbar/block-format/format-numbered-list"
import { FormatCheckList } from "@/components/editor/plugins/toolbar/block-format/format-check-list"
import { FormatQuote } from "@/components/editor/plugins/toolbar/block-format/format-quote"
import { FormatCodeBlock } from "@/components/editor/plugins/toolbar/block-format/format-code-block"
import { FontFormatToolbarPlugin } from "@/components/editor/plugins/toolbar/font-format-toolbar-plugin"
// import { FontColorToolbarPlugin } from "@/components/editor/plugins/toolbar/font-color-toolbar-plugin" // Requires color-picker component
import { FontFamilyToolbarPlugin } from "@/components/editor/plugins/toolbar/font-family-toolbar-plugin"
import { FontSizeToolbarPlugin } from "@/components/editor/plugins/toolbar/font-size-toolbar-plugin"
import { ClearFormattingToolbarPlugin } from "@/components/editor/plugins/toolbar/clear-formatting-toolbar-plugin"
import { SubSuperToolbarPlugin } from "@/components/editor/plugins/toolbar/subsuper-toolbar-plugin"
import { HistoryToolbarPlugin } from "@/components/editor/plugins/toolbar/history-toolbar-plugin"
import { LinkToolbarPlugin } from "@/components/editor/plugins/toolbar/link-toolbar-plugin"
import { BlockInsertPlugin } from "@/components/editor/plugins/toolbar/block-insert-plugin"
import { InsertImage } from "@/components/editor/plugins/toolbar/block-insert/insert-image"
import { InsertTable } from "@/components/editor/plugins/toolbar/block-insert/insert-table"
import { ImagesPlugin } from "@/components/editor/plugins/images-plugin"
import { LinkPlugin } from "@/components/editor/plugins/link-plugin"
import { FloatingLinkEditorPlugin } from "@/components/editor/plugins/floating-link-editor-plugin"
import { AutoLinkPlugin } from "@/components/editor/plugins/auto-link-plugin"
import { TablePlugin } from "@/components/editor/plugins/table-plugin"
import { FloatingTextFormatToolbarPlugin } from "@/components/editor/plugins/floating-text-format-plugin"
import { CodeHighlightPlugin } from "@/components/editor/plugins/code-highlight-plugin"
import { CodeActionMenuPlugin } from "@/components/editor/plugins/code-action-menu-plugin"
import { EmojisPlugin } from "@/components/editor/plugins/emojis-plugin"
import { EmojiPickerPlugin } from "@/components/editor/plugins/emoji-picker-plugin"
import { DragDropPastePlugin } from "@/components/editor/plugins/drag-drop-paste-plugin"
import { MarkdownTogglePlugin } from "@/components/editor/plugins/actions/markdown-toggle-plugin"
import { AutoEmbedPlugin } from "@/components/editor/plugins/embeds/auto-embed-plugin"
import { ContextMenuPlugin } from "@/components/editor/plugins/context-menu-plugin"
import { ComponentPickerMenuPlugin } from "@/components/editor/plugins/component-picker-menu-plugin"
import { DraggableBlockPlugin } from "@/components/editor/plugins/draggable-block-plugin"
// import { AutocompletePlugin } from "@/components/editor/plugins/autocomplete-plugin" // Requires swipe utility
import { Separator } from "@/components/ui/separator"

const placeholder = "Start typing..."

export function Plugins() {
  const [floatingAnchorElem, setFloatingAnchorElem] =
    useState<HTMLDivElement | null>(null)
  const [isLinkEditMode, setIsLinkEditMode] = useState(false)

  const onRef = (_floatingAnchorElem: HTMLDivElement) => {
    if (_floatingAnchorElem !== null) {
      setFloatingAnchorElem(_floatingAnchorElem)
    }
  }

  return (
    <div className="relative">
      {/* toolbar plugins */}
      <ToolbarPlugin>
        {({ blockType }) => (
          <div className="sticky top-0 z-10 flex gap-2 overflow-auto border-b bg-background p-1">
            <BlockInsertPlugin>
              <InsertImage />
              <InsertTable />
            </BlockInsertPlugin>
            <Separator orientation="vertical" className="h-8" />
            <BlockFormatDropDown>
              <FormatParagraph />
              <FormatHeading levels={["h1", "h2", "h3"]} />
              <FormatBulletedList />
              <FormatNumberedList />
              <FormatCheckList />
              <FormatQuote />
              <FormatCodeBlock />
            </BlockFormatDropDown>
            <Separator orientation="vertical" className="h-8" />
            <FontFormatToolbarPlugin />
            {/* <FontColorToolbarPlugin /> Requires color-picker component */}
            <FontFamilyToolbarPlugin />
            <FontSizeToolbarPlugin />
            <SubSuperToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <ClearFormattingToolbarPlugin />
            <Separator orientation="vertical" className="h-8" />
            <LinkToolbarPlugin setIsLinkEditMode={setIsLinkEditMode} />
            <Separator orientation="vertical" className="h-8" />
            <HistoryToolbarPlugin />
          </div>
        )}
      </ToolbarPlugin>

      <div className="relative">
        <RichTextPlugin
          contentEditable={
            <div className="">
              <div className="" ref={onRef}>
                <ContentEditable
                  placeholder={placeholder}
                  className="ContentEditable__root relative block min-h-[500px] overflow-auto px-8 py-4 focus:outline-none"
                />
              </div>
            </div>
          }
          ErrorBoundary={LexicalErrorBoundary}
        />
        {/* editor plugins */}
        <HistoryPlugin />
        <ListPlugin />
        <ImagesPlugin />
        <LinkPlugin />
        <AutoLinkPlugin />
        <FloatingLinkEditorPlugin
          anchorElem={floatingAnchorElem}
          isLinkEditMode={isLinkEditMode}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <TablePlugin
          cellEditorConfig={{
            namespace: "TableEditor",
            nodes: [],
            onError: () => {},
            theme: {},
          }}
        >
          <RichTextPlugin
            contentEditable={
              <ContentEditable
                placeholder=""
                className="TableNode__contentEditable"
              />
            }
            ErrorBoundary={LexicalErrorBoundary}
          />
        </TablePlugin>
        <FloatingTextFormatToolbarPlugin
          anchorElem={floatingAnchorElem}
          setIsLinkEditMode={setIsLinkEditMode}
        />
        <CodeHighlightPlugin />
        <CodeActionMenuPlugin anchorElem={floatingAnchorElem} />
        <EmojisPlugin />
        <EmojiPickerPlugin />
        <DragDropPastePlugin />
        <AutoEmbedPlugin />
        <ContextMenuPlugin />
        <ComponentPickerMenuPlugin />
        <DraggableBlockPlugin anchorElem={floatingAnchorElem} />
        {/* <AutocompletePlugin /> Requires swipe utility */}
      </div>
      {/* actions plugins */}
      <MarkdownTogglePlugin
        shouldPreserveNewLinesInMarkdown={false}
        transformers={TRANSFORMERS}
      />
    </div>
  )
}
