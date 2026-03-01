import { useState, useRef, useEffect, useLayoutEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Editor, Transforms, Range } from 'slate'
import { ReactEditor, useSlate } from 'slate-react'
import { COMMANDS } from './commands'
import { insertPageLink } from './editorCommands'
import { fetchPages } from '../../projects/api'
import type { Page } from '../../projects/types'
import type { Command } from './commands'
import { FiFileText } from 'react-icons/fi'

type CommandMenuProps = {
  open: boolean
  index: number
  setIndex: (n: number) => void
  close: () => void
  projectId?: string
}

const MENU_WIDTH = 288

export function CommandMenu({
  open,
  index,
  setIndex,
  close,
  projectId,
}: CommandMenuProps) {
  const editor = useSlate()
  const [mode, setMode] = useState<'commands' | 'pages'>('commands')
  const [pages, setPages] = useState<Page[]>([])
  const [pagesLoading, setPagesLoading] = useState(false)
  const activeRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)

  // Reset mode when menu closes
  if (!open && mode !== 'commands') {
    setMode('commands')
  }

  // Position the menu via useLayoutEffect (after DOM updates)
  useLayoutEffect(() => {
    const el = menuRef.current
    if (!el || !open) return

    const { selection } = editor
    if (!selection) return

    try {
      const domRange = ReactEditor.toDOMRange(editor, selection)
      const rect = domRange.getBoundingClientRect()
      const spaceBelow = window.innerHeight - rect.bottom
      const spaceAbove = rect.top
      const menuH = el.offsetHeight

      if (spaceBelow < menuH && spaceAbove > spaceBelow) {
        el.style.top = ''
        el.style.bottom = `${window.innerHeight - rect.top + 4}px`
      } else {
        el.style.bottom = ''
        el.style.top = `${rect.bottom + 4}px`
      }

      el.style.left = `${Math.min(rect.left, window.innerWidth - MENU_WIDTH - 8)}px`
      el.style.opacity = '1'
    } catch {
      // DOM not ready yet — will reposition on next render
    }
  })

  // Scroll active item into view
  useEffect(() => {
    activeRef.current?.scrollIntoView({ block: 'nearest' })
  }, [index])

  const enterPageMode = () => {
    if (!projectId) return
    setMode('pages')
    setPagesLoading(true)
    setIndex(0)
    fetchPages(projectId)
      .then(setPages)
      .catch(() => setPages([]))
      .finally(() => setPagesLoading(false))
  }

  // Read query from editor text: text between last "/" and cursor
  const getQuery = useCallback(() => {
    const { selection } = editor
    if (!selection || !Range.isCollapsed(selection)) return ''
    try {
      const [node] = Editor.node(editor, selection)
      if (!('text' in node)) return ''
      const text = (node as { text: string }).text
      const offset = selection.anchor.offset
      const before = text.slice(0, offset)
      const slashIdx = before.lastIndexOf('/')
      if (slashIdx === -1) return ''
      return before.slice(slashIdx + 1)
    } catch {
      return ''
    }
  }, [editor])

  if (!open) return null

  const query = getQuery()

  // Execute a command: delete the /query text, then run
  const executeCommand = (cmd: Command) => {
    const q = getQuery()
    Transforms.delete(editor, {
      distance: q.length + 1,
      unit: 'character',
      reverse: true,
    })
    cmd.run(editor)
    close()
  }

  const executePageLink = (page: Page) => {
    const q = getQuery()
    Transforms.delete(editor, {
      distance: q.length + 1,
      unit: 'character',
      reverse: true,
    })
    insertPageLink(editor, page.id, page.title)
    close()
  }

  // Page picker mode
  if (mode === 'pages') {
    const filteredPages = pages.filter(p =>
      p.title.toLowerCase().includes(query.toLowerCase()),
    )

    return createPortal(
      <div
        ref={menuRef}
        className="fixed z-50 w-72 overflow-hidden rounded-lg border border-border bg-bg-elevated text-text-primary shadow-xl"
        style={{ opacity: 0 }}
        onMouseDown={e => e.preventDefault()}
      >
        <div className="border-b border-border px-3 py-2 text-xs font-medium text-text-tertiary">
          Selecione uma página
        </div>
        <div className="max-h-64 overflow-y-auto py-1">
          {pagesLoading ? (
            <div className="px-3 py-3 text-center text-xs text-text-tertiary">Carregando...</div>
          ) : filteredPages.length === 0 ? (
            <div className="px-3 py-3 text-center text-xs text-text-tertiary">Nenhuma página encontrada</div>
          ) : (
            filteredPages.map((page, i) => (
              <div
                key={page.id}
                ref={i === index ? activeRef : undefined}
                className={`mx-1 flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 text-sm transition-colors ${
                  i === index ? 'bg-bg-spotlight' : 'hover:bg-bg-spotlight/50'
                }`}
                onMouseEnter={() => setIndex(i)}
                onMouseDown={e => {
                  e.preventDefault()
                  executePageLink(page)
                }}
              >
                <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-container text-text-tertiary">
                  <FiFileText className="h-4 w-4" />
                </span>
                <span className="truncate">{page.title || 'Sem título'}</span>
              </div>
            ))
          )}
        </div>
      </div>,
      document.body,
    )
  }

  // Normal commands mode
  const filtered = COMMANDS.filter(
    cmd =>
      cmd.label.toLowerCase().includes(query.toLowerCase()) ||
      cmd.keywords.some(k => k.includes(query.toLowerCase())),
  )

  if (filtered.length === 0) return null

  return createPortal(
    <div
      ref={menuRef}
      className="fixed z-50 w-72 overflow-hidden rounded-lg border border-border bg-bg-elevated text-text-primary shadow-xl"
      style={{ opacity: 0 }}
      onMouseDown={e => e.preventDefault()}
    >
      {query && (
        <div className="border-b border-border px-3 py-1.5 text-xs text-text-tertiary">
          <span className="text-text-secondary font-mono">/{query}</span>
        </div>
      )}
      <div className="max-h-80 overflow-y-auto py-1">
        {filtered.map((cmd, i) => (
          <div
            key={cmd.id}
            ref={i === index ? activeRef : undefined}
            className={`mx-1 flex cursor-pointer items-center gap-2.5 rounded-md px-2.5 py-2 transition-colors ${
              i === index ? 'bg-bg-spotlight' : 'hover:bg-bg-spotlight/50'
            }`}
            onMouseEnter={() => setIndex(i)}
            onMouseDown={e => {
              e.preventDefault()
              if (cmd.id === 'page' && projectId) {
                enterPageMode()
                return
              }
              executeCommand(cmd)
            }}
          >
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-md border border-border bg-bg-container text-xs font-semibold text-text-secondary">
              {cmd.icon}
            </span>
            <div className="min-w-0 flex-1">
              <div className="text-sm font-medium">{cmd.label}</div>
              <div className="truncate text-xs text-text-tertiary">{cmd.description}</div>
            </div>
          </div>
        ))}
      </div>
    </div>,
    document.body,
  )
}
