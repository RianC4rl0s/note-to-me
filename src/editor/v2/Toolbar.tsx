import { useSlate } from 'slate-react'
import { toggleMark, toggleBlock, toggleAlign, insertDivider, insertLink, removeLink, isLinkActive } from './editorCommands'
import { isMarkActive, isBlockActive, isAlignActive } from './esditorState'
import { ToolbarButton } from './ToolbarButton'

import { CiTextAlignJustify, CiTextAlignCenter, CiTextAlignRight, CiTextAlignLeft, CiCircleList } from 'react-icons/ci'
import { GoListOrdered } from 'react-icons/go'
import { IoCodeSlashOutline } from 'react-icons/io5'
import { RiDoubleQuotesR } from 'react-icons/ri'
import { TbCodeDots } from 'react-icons/tb'
import { FiCheckSquare, FiMinus, FiLink } from 'react-icons/fi'


export function Toolbar() {
  const editor = useSlate()

  return (
    <div className="flex flex-wrap gap-1 border-b border-border px-3 py-1">
      {/* Marks */}
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
        active={isMarkActive(editor, 'strikethrough')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'strikethrough') }}
      >
        <FiMinus />
      </ToolbarButton>

      <ToolbarButton
        active={isMarkActive(editor, 'code')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'code') }}
      >
        <IoCodeSlashOutline />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      {/* Blocks */}
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
        active={isBlockActive(editor, 'block-quote')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'block-quote') }}
      >
        <RiDoubleQuotesR />
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'code-block')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'code-block') }}
      >
        <TbCodeDots />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      {/* Lists */}
      <ToolbarButton
        active={isBlockActive(editor, 'bulleted-list')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'bulleted-list') }}
      >
        <CiCircleList />
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'numbered-list')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'numbered-list') }}
      >
        <GoListOrdered />
      </ToolbarButton>

      <ToolbarButton
        active={isBlockActive(editor, 'check-list-item')}
        onMouseDown={e => { e.preventDefault(); toggleBlock(editor, 'check-list-item') }}
      >
        <FiCheckSquare />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      {/* Alignment */}
      <ToolbarButton
        active={isAlignActive(editor, 'left')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'left') }}
      >
        <CiTextAlignLeft />
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'center')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'center') }}
      >
        <CiTextAlignCenter />
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'right')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'right') }}
      >
        <CiTextAlignRight />
      </ToolbarButton>

      <ToolbarButton
        active={isAlignActive(editor, 'justify')}
        onMouseDown={e => { e.preventDefault(); toggleAlign(editor, 'justify') }}
      >
        <CiTextAlignJustify />
      </ToolbarButton>

      <div className="mx-1 w-px bg-border" />

      {/* Insert */}
      <ToolbarButton
        active={isLinkActive(editor)}
        onMouseDown={e => {
          e.preventDefault()
          if (isLinkActive(editor)) {
            removeLink(editor)
          } else {
            const url = window.prompt('URL:')
            if (url) insertLink(editor, url)
          }
        }}
      >
        <FiLink />
      </ToolbarButton>

      <ToolbarButton
        active={false}
        onMouseDown={e => { e.preventDefault(); insertDivider(editor) }}
      >
        <span className="text-[10px]">―</span>
      </ToolbarButton>
    </div>
  )
}
