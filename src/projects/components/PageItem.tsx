import { useState, useRef, useEffect } from 'react'
import { Link, useParams } from 'react-router-dom'
import { FiFileText, FiTrash2, FiCheck, FiX } from 'react-icons/fi'

type PageItemProps = {
  projectId: string
  pageId: string
  title: string
  onRename: (pageId: string, title: string) => Promise<void>
  onDelete: (pageId: string) => Promise<void>
}

export function PageItem({ projectId, pageId, title, onRename, onDelete }: PageItemProps) {
  const { pageId: activePageId } = useParams()
  const isActive = activePageId === pageId
  const [isEditing, setIsEditing] = useState(false)
  const [editValue, setEditValue] = useState(title)
  const inputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    if (isEditing) inputRef.current?.focus()
  }, [isEditing])

  const handleRename = async () => {
    const trimmed = editValue.trim()
    if (trimmed && trimmed !== title) {
      await onRename(pageId, trimmed)
    }
    setIsEditing(false)
  }

  const handleCancel = () => {
    setEditValue(title)
    setIsEditing(false)
  }

  if (isEditing) {
    return (
      <div className="flex items-center gap-1 py-1 pl-8 pr-2">
        <input
          ref={inputRef}
          value={editValue}
          onChange={e => setEditValue(e.target.value)}
          onKeyDown={e => {
            if (e.key === 'Enter') handleRename()
            if (e.key === 'Escape') handleCancel()
          }}
          className="min-w-0 flex-1 rounded border border-border bg-bg-container px-1.5 py-0.5 text-xs text-text-primary outline-none focus:border-primary"
        />
        <button onClick={handleRename} className="text-text-secondary hover:text-primary">
          <FiCheck className="h-3.5 w-3.5" />
        </button>
        <button onClick={handleCancel} className="text-text-secondary hover:text-error">
          <FiX className="h-3.5 w-3.5" />
        </button>
      </div>
    )
  }

  return (
    <Link
      to={`/projects/${projectId}/pages/${pageId}`}
      className={`group flex items-center gap-2 rounded-md py-1.5 pl-8 pr-2 text-xs transition-colors ${
        isActive
          ? 'bg-primary-bg text-primary font-medium'
          : 'text-text-secondary hover:bg-bg-spotlight hover:text-text-primary'
      }`}
    >
      <FiFileText className="h-3.5 w-3.5 shrink-0" />
      <span className="min-w-0 flex-1 truncate">{title || 'Sem título'}</span>
      <div className="flex shrink-0 gap-1 opacity-0 transition-opacity group-hover:opacity-100">
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            setEditValue(title)
            setIsEditing(true)
          }}
          className="text-text-tertiary hover:text-text-primary"
          title="Renomear"
        >
          <span className="text-[10px]">✏️</span>
        </button>
        <button
          onClick={e => {
            e.preventDefault()
            e.stopPropagation()
            onDelete(pageId)
          }}
          className="text-text-tertiary hover:text-error"
          title="Excluir"
        >
          <FiTrash2 className="h-3 w-3" />
        </button>
      </div>
    </Link>
  )
}
