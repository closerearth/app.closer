import 'tippy.js/animations/scale.css'
import 'tippy.js/dist/tippy.css'
import React from 'react'
import { CodeAlt } from '@styled-icons/boxicons-regular/CodeAlt'
import { Highlight } from '@styled-icons/boxicons-regular/Highlight'
import { FormatAlignCenter } from '@styled-icons/material/FormatAlignCenter'
import { FormatAlignJustify } from '@styled-icons/material/FormatAlignJustify'
import { FormatAlignLeft } from '@styled-icons/material/FormatAlignLeft'
import { FormatAlignRight } from '@styled-icons/material/FormatAlignRight'
import { FormatBold } from '@styled-icons/material/FormatBold'
import { FormatIndentDecrease } from '@styled-icons/material/FormatIndentDecrease'
import { FormatIndentIncrease } from '@styled-icons/material/FormatIndentIncrease'
import { FormatItalic } from '@styled-icons/material/FormatItalic'
import { FormatListBulleted } from '@styled-icons/material/FormatListBulleted'
import { FormatListNumbered } from '@styled-icons/material/FormatListNumbered'
import { FormatQuote } from '@styled-icons/material/FormatQuote'
import { FormatStrikethrough } from '@styled-icons/material/FormatStrikethrough'
import { FormatUnderlined } from '@styled-icons/material/FormatUnderlined'
import { Keyboard } from '@styled-icons/material/Keyboard'
import { Looks3 } from '@styled-icons/material/Looks3'
import { Looks4 } from '@styled-icons/material/Looks4'
import { Looks5 } from '@styled-icons/material/Looks5'
import { Looks6 } from '@styled-icons/material/Looks6'
import { LooksOne } from '@styled-icons/material/LooksOne'
import { LooksTwo } from '@styled-icons/material/LooksTwo'
import { Check } from '@styled-icons/material/Check'
import {
  ELEMENT_BLOCKQUOTE,
  ELEMENT_H1,
  ELEMENT_H2,
  ELEMENT_H3,
  ELEMENT_H4,
  ELEMENT_H5,
  ELEMENT_H6,
  ELEMENT_OL,
  ELEMENT_UL,
  getPluginType,
  getPreventDefaultHandler,
  indent,
  MARK_BG_COLOR,
  MARK_BOLD,
  MARK_CODE,
  MARK_COLOR,
  MARK_HIGHLIGHT,
  MARK_ITALIC,
  MARK_KBD,
  MARK_STRIKETHROUGH,
  MARK_UNDERLINE,
  outdent,
  AlignToolbarButton,
  ToolbarButton,
  ColorPickerToolbarDropdown,
  BlockToolbarButton,
  ImageToolbarButton,
  LinkToolbarButton,
  ListToolbarButton,
  MarkToolbarButton,
  MediaEmbedToolbarButton,
  usePlateEditorRef,
} from '@udecode/plate'
import { Link } from '@styled-icons/material/Link'
import { Image } from '@styled-icons/material/Image'
import { OndemandVideo } from '@styled-icons/material/OndemandVideo'
import { FontDownload } from '@styled-icons/material/FontDownload'
import { FormatColorText } from '@styled-icons/material/FormatColorText'

export const BasicElementToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H1)}
        icon={<LooksOne />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H2)}
        icon={<LooksTwo />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H3)}
        icon={<Looks3 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H4)}
        icon={<Looks4 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H5)}
        icon={<Looks5 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_H6)}
        icon={<Looks6 />}
      />
      <BlockToolbarButton
        type={getPluginType(editor, ELEMENT_BLOCKQUOTE)}
        icon={<FormatQuote />}
      />
    </>
  )
}

export const IndentToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <ToolbarButton
        onMouseDown={editor && getPreventDefaultHandler(outdent, editor)}
        icon={<FormatIndentDecrease />}
      />
      <ToolbarButton
        onMouseDown={editor && getPreventDefaultHandler(indent, editor)}
        icon={<FormatIndentIncrease />}
      />
    </>
  )
}

export const ListToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_UL)}
        icon={<FormatListBulleted />}
      />
      <ListToolbarButton
        type={getPluginType(editor, ELEMENT_OL)}
        icon={<FormatListNumbered />}
      />
    </>
  )
}

export const AlignToolbarButtons = () => {
  return (
    <>
      <AlignToolbarButton value="left" icon={<FormatAlignLeft />} />
      <AlignToolbarButton value="center" icon={<FormatAlignCenter />} />
      <AlignToolbarButton value="right" icon={<FormatAlignRight />} />
      <AlignToolbarButton value="justify" icon={<FormatAlignJustify />} />
    </>
  )
}

export const BasicMarkToolbarButtons = () => {
  const editor = usePlateEditorRef()

  return (
    <>
      <MarkToolbarButton
        type={getPluginType(editor, MARK_BOLD)}
        icon={<FormatBold />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_ITALIC)}
        icon={<FormatItalic />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_UNDERLINE)}
        icon={<FormatUnderlined />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_STRIKETHROUGH)}
        icon={<FormatStrikethrough />}
      />
      <MarkToolbarButton
        type={getPluginType(editor, MARK_CODE)}
        icon={<CodeAlt />}
      />
    </>
  )
}

export const KbdToolbarButton = () => {
  const editor = usePlateEditorRef()

  return (
    <MarkToolbarButton
      type={getPluginType(editor, MARK_KBD)}
      icon={<Keyboard />}
    />
  )
}

export const HighlightToolbarButton = () => {
  const editor = usePlateEditorRef()

  return (
    <MarkToolbarButton
      type={getPluginType(editor, MARK_HIGHLIGHT)}
      icon={<Highlight />}
    />
  )
}


export const ToolbarButtons = () => (
  <>
    <BasicElementToolbarButtons />
    <ListToolbarButtons />
    <IndentToolbarButtons />
    <BasicMarkToolbarButtons />
    <ColorPickerToolbarDropdown
      pluginKey={MARK_COLOR}
      icon={<FormatColorText />}
      selectedIcon={<Check />}
      tooltip={{ content: 'Text color' }}
    />
    <ColorPickerToolbarDropdown
      pluginKey={MARK_BG_COLOR}
      icon={<FontDownload />}
      selectedIcon={<Check />}
      tooltip={{ content: 'Highlight color' }}
    />
    <AlignToolbarButtons />
    <LinkToolbarButton icon={<Link />} />
    <ImageToolbarButton icon={<Image />} />
    <MediaEmbedToolbarButton icon={<OndemandVideo />} />
  </>
)
