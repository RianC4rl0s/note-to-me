import { useEffect, useRef } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Range } from 'slate'
import { useSlate } from 'slate-react'
import { toggleMark, insertLink, removeLink, isLinkActive } from './editorCommands'
import { isMarkActive } from './esditorState'
import { ToolbarButton } from './ToolbarButton'
import { IoCodeSlashOutline } from 'react-icons/io5'
import { FiMinus, FiLink } from 'react-icons/fi'

export function HoveringToolbar() {
  const editor = useSlate()
  const ref = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const el = ref.current
    if (!el) return

    const { selection } = editor

    if (
      !selection ||
      Range.isCollapsed(selection) ||
      Editor.string(editor, selection) === ''
    ) {
      el.style.opacity = '0'
      el.style.pointerEvents = 'none'
      return
    }

    const domSelection = window.getSelection()
    if (!domSelection || domSelection.rangeCount === 0) return

    const domRange = domSelection.getRangeAt(0)
    const rect = domRange.getBoundingClientRect()

    el.style.opacity = '1'
    el.style.pointerEvents = 'auto'
    el.style.top = `${rect.top - el.offsetHeight - 8}px`
    el.style.left = `${rect.left + rect.width / 2 - el.offsetWidth / 2}px`
  })

  return createPortal(
    <div
      ref={ref}
      className="fixed z-50 flex gap-1 rounded-lg border border-border bg-bg-elevated px-2 py-1 shadow-lg transition-opacity"
      style={{ opacity: 0, pointerEvents: 'none' }}
      onMouseDown={e => e.preventDefault()}
    >
      <ToolbarButton
        active={isMarkActive(editor, 'bold')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'bold') }}
      >
        <span className="text-xs font-bold">B</span>
      </ToolbarButton>
      <ToolbarButton
        active={isMarkActive(editor, 'italic')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'italic') }}
      >
        <span className="text-xs italic">I</span>
      </ToolbarButton>
      <ToolbarButton
        active={isMarkActive(editor, 'underline')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'underline') }}
      >
        <span className="text-xs underline">U</span>
      </ToolbarButton>
      <ToolbarButton
        active={isMarkActive(editor, 'strikethrough')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'strikethrough') }}
      >
        <FiMinus className="h-3.5 w-3.5" />
      </ToolbarButton>
      <ToolbarButton
        active={isMarkActive(editor, 'code')}
        onMouseDown={e => { e.preventDefault(); toggleMark(editor, 'code') }}
      >
        <IoCodeSlashOutline className="h-3.5 w-3.5" />
      </ToolbarButton>
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
        <FiLink className="h-3.5 w-3.5" />
      </ToolbarButton>
    </div>,
    document.body,
  )
}
