import { useState, useRef, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { FiChevronRight, FiPlus, FiTrash2, FiCheck, FiX } from 'react-icons/fi'
import { usePages } from '../hooks/usePages'
import { PageItem } from './PageItem'

type ProjectItemProps = {
  projectId: string
  name: string
  onRename: (id: string, name: string) => Promise<unknown>
  onDelete: (id: string) => Promise<unknown>
}

export function ProjectItem({ projectId, name, onRename, onDelete }: ProjectItemProps) {
  const [expanded, setExpanded] = useState(false)
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(name)
  const inputRef = useRef<HTMLInputElement>(null)
  const navigate = useNavigate()

  const { pages, addPage, renamePage, removePage, setPages } = usePages(projectId)

  // Listen for title changes from PageTitleInput
  useEffect(() => {
    const handler = (e: Event) => {
      const { pageId, title } = (e as CustomEvent).detail
      setPages(prev => prev.map(p => (p.id === pageId ? { ...p, title } : p)))
    }
    window.addEventListener('page-title-changed', handler)
    return () => window.removeEventListener('page-title-changed', handler)
  }, [setPages])

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleRename = async () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== name) {
      await onRename(projectId, trimmed)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(name)
    setIsEditing(false)
  }

  const handleAddPage = async () => {
    const page = await addPage('Nova página')
    setExpanded(true)
    navigate(`/projects/${projectId}/pages/${page.id}`)
  }

  const handleDeletePage = async (pageId: string) => {
    await removePage(pageId)
  }

  const handleRenamePage = async (pageId: string, title: string) => {
    await renamePage(pageId, title)
  }

  return (
    <div>
      {isEditing ? (
        <div className="flex items-center gap-1 px-2 py-1.5">
          <input
            ref={inputRef}
            value={editValue}
            onChange={e => setEditValue(e.target.value)}
            onKeyDown={e => {
              if (e.key === 'Enter') handleRename()
              if (e.key === 'Escape') handleCancel()
            }}
            className="min-w-0 flex-1 rounded border border-border bg-bg-container px-1.5 py-0.5 text-sm text-text-primary outline-none focus:border-primary"
          />
          <button onClick={handleRename} className="text-text-secondary hover:text-primary">
            <FiCheck className="h-4 w-4" />
          </button>
          <button onClick={handleCancel} className="text-text-secondary hover:text-error">
            <FiX className="h-4 w-4" />
          </button>
        </div>
      ) : (
        <div className="group flex items-center gap-1 rounded-md px-2 py-1.5 text-sm text-text-primary hover:bg-bg-spotlight">
          <button
            onClick={() => setExpanded(e => !e)}
            className="shrink-0 text-text-tertiary"
          >
            <FiChevronRight
              className={`h-4 w-4 transition-transform ${expanded ? 'rotate-90' : ''}`}
            />
          </button>
          <button
            onClick={() => setExpanded(e => !e)}
            className="min-w-0 flex-1 truncate text-left font-medium"
          >
            {name}
          </button>
          <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
            <button
              onClick={handleAddPage}
              className="text-text-tertiary hover:text-primary"
              title="Nova página"
            >
              <FiPlus className="h-3.5 w-3.5" />
            </button>
            <button
              onClick={() => {
                setEditValue(name)
                setIsEditing(true)
              }}
              className="text-text-tertiary hover:text-text-primary"
              title="Renomear"
            >
              <span className="text-[10px]">✏️</span>
            </button>
            <button
              onClick={() => onDelete(projectId)}
              className="text-text-tertiary hover:text-error"
              title="Excluir"
            >
              <FiTrash2 className="h-3.5 w-3.5" />
            </button>
          </div>
        </div>
      )}

      {expanded && (
        <div className="ml-1">
          {pages.map(page => (
            <PageItem
              key={page.id}
              projectId={projectId}
              pageId={page.id}
              title={page.title}
              onRename={handleRenamePage}
              onDelete={handleDeletePage}
            />
          ))}
          {pages.length === 0 && (
            <p className="py-1 pl-8 text-xs text-text-tertiary">Nenhuma página</p>
          )}
        </div>
      )}
    </div>
  )
}
