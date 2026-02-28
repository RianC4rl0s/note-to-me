import { useSlate } from 'slate-react'
import { toggleMark, toggleBlock, toggleAlign } from './editorCommands'
import { isMarkActive, isBlockActive, isAlignActive } from './esditorState'
import { ToolbarButton } from './ToolbarButton'

import { CiTextAlignJustify } from "react-icons/ci";
import { CiTextAlignCenter } from "react-icons/ci";
import { CiTextAlignRight } from "react-icons/ci";
import { CiTextAlignLeft } from "react-icons/ci";
import { CiCircleList } from "react-icons/ci";
import { GoListOrdered } from "react-icons/go";
import { IoCodeSlashOutline } from "react-icons/io5";
import { RiDoubleQuotesR } from "react-icons/ri";
import { TbCodeDots } from "react-icons/tb";


export function Toolbar() {
  const editor = useSlate()

  return (
    <div className="flex gap-1 border-b border-border px-3 py-1">

      <ToolbarButton
        active={isMarkActive(editor, 'bold')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'bold') }}
      >
        B
      </ToolbarButton>

      <ToolbarButton
        active={isMarkActive(editor, 'italic')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'italic') }}
      >
        I
      </ToolbarButton>

      <ToolbarButton
        active={isMarkActive(editor, 'underline')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'underline') }}
      >
        U
      </ToolbarButton>
      <ToolbarButton
        active={isMarkActive(editor, 'code')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'code') }}
      >
        <IoCodeSlashOutline/>
      </ToolbarButton>
      <ToolbarButton
        active={isBlockActive(editor, 'block-quote')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'block-quote') }}
      >
        <RiDoubleQuotesR/>
      </ToolbarButton>
      <ToolbarButton
        active={isBlockActive(editor, 'code-block')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'code-block') }}
      >
        <TbCodeDots></TbCodeDots>
      </ToolbarButton>
      <ToolbarButton
        active={isBlockActive(editor, 'paragraph')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'paragraph') }}
      >
        p
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'heading-one')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'heading-one') }}
      >
        H1
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'heading-two')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'heading-two') }}
      >
        H2
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'bulleted-list')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'bulleted-list') }}
      >
        <CiCircleList/>
      </ToolbarButton>
       <ToolbarButton
        active={isBlockActive(editor, 'numbered-list')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'numbered-list') }}
      >
        <GoListOrdered/>
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'left')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'left') }}
      >
        <CiTextAlignLeft/>
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'center')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'center') }}
      >
        <CiTextAlignCenter/>
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'right')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'right') }}
      >
        <CiTextAlignRight/>
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'justify')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'justify') }}
      >
        <CiTextAlignJustify/>
      </ToolbarButton>

    </div>
  )
}
