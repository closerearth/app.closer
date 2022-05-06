import 'tippy.js/dist/tippy.css'
import ReactDOM from 'react-dom'
import React, { useState, useMemo, useEffect, useRef } from 'react'
import {
  createPlateUI,
  HeadingToolbar,
  MentionCombobox,
  Plate,
  createAlignPlugin,
  createAutoformatPlugin,
  createBlockquotePlugin,
  createBoldPlugin,
  createCodePlugin,
  createExitBreakPlugin,
  createHeadingPlugin,
  createHighlightPlugin,
  createKbdPlugin,
  createImagePlugin,
  createItalicPlugin,
  createLinkPlugin,
  createListPlugin,
  createMediaEmbedPlugin,
  createNodeIdPlugin,
  createParagraphPlugin,
  createResetNodePlugin,
  createSelectOnBackspacePlugin,
  createSoftBreakPlugin,
  createStrikethroughPlugin,
  createSubscriptPlugin,
  createSuperscriptPlugin,
  createTablePlugin,
  createTodoListPlugin,
  createTrailingBlockPlugin,
  createUnderlinePlugin,
  createComboboxPlugin,
  createMentionPlugin,
  createIndentPlugin,
  createFontColorPlugin,
  createFontBackgroundColorPlugin,
  createDeserializeMdPlugin,
  createDeserializeCsvPlugin,
  createNormalizeTypesPlugin,
  createFontSizePlugin,
  createHorizontalRulePlugin,
  createPlugins,
  createDeserializeDocxPlugin,
  createJuicePlugin,
  serializeHtml,
  deserializeHtml,
  createPlateEditor,
  deserializeHtmlNode,
} from '@udecode/plate'
import { ToolbarButtons } from './config/components/Toolbars'
import { withStyledPlaceHolders } from './config/components/withStyledPlaceHolders'
import { CONFIG } from './config/config'




const id = 'Examples/Playground'

let components = createPlateUI({})
components = withStyledPlaceHolders(components)

const TextEditor = ( { value, onChange } ) => {

  const [editorValue, setEditorValue] = useState([{ children: [{ text: '' }] }])

  useEffect(() => {

    const deserialized = deserializeHtml(editor, { element : value })
    setEditorValue(deserialized)
  }, [editorValue]);

  
  const plugins = createPlugins(
    [
      createParagraphPlugin(),
      createBlockquotePlugin(),
      createTodoListPlugin(),
      createHeadingPlugin(),
      createImagePlugin(),
      createHorizontalRulePlugin(),
      createLinkPlugin(),
      createListPlugin(),
      createTablePlugin(),
      createMediaEmbedPlugin(),
      createAlignPlugin(CONFIG.align),
      createBoldPlugin(),
      createCodePlugin(),
      createItalicPlugin(),
      createHighlightPlugin(),
      createUnderlinePlugin(),
      createStrikethroughPlugin(),
      createSubscriptPlugin(),
      createSuperscriptPlugin(),
      createFontColorPlugin(),
      createFontBackgroundColorPlugin(),
      createFontSizePlugin(),
      createKbdPlugin(),
      createNodeIdPlugin(),
      createIndentPlugin(CONFIG.indent),
      createAutoformatPlugin(CONFIG.autoformat),
      createResetNodePlugin(CONFIG.resetBlockType),
      createSoftBreakPlugin(CONFIG.softBreak),
      createExitBreakPlugin(CONFIG.exitBreak),
      createNormalizeTypesPlugin(CONFIG.forceLayout),
      createTrailingBlockPlugin(CONFIG.trailingBlock),
      createSelectOnBackspacePlugin(CONFIG.selectOnBackspace),
      createComboboxPlugin(),
      createMentionPlugin(),
      createDeserializeMdPlugin(),
      createDeserializeCsvPlugin(),
      createDeserializeDocxPlugin(),
      createJuicePlugin(),
    ],
    {
      components,
    }
  )
  
  const editor = useMemo(
    () => createPlateEditor({
      id: id,
      plugins: plugins
    }), []);

  

  const serializeState = (update) => {
    setEditorValue(update);
    const html = serializeHtml(editor, { nodes: editorValue })
    onChange && onChange(html);
  }


  return (
    <Plate
      id={id}
      editableProps={CONFIG.editableProps}
      initialValue={editorValue}
      onChange={((update) => serializeState(update))}
      plugins={plugins}
    >
      <HeadingToolbar>
        <ToolbarButtons />
      </HeadingToolbar>

      <MentionCombobox />

    </Plate>

  )
}


export default TextEditor;