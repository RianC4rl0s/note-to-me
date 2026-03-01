import { useReducer, useEffect } from 'react'
import { useParams } from 'react-router-dom'
import type { Descendant } from 'slate'
import RichTextEditor from '../../editor/v2/Editor'
import { PageTitleInput } from './PageTitleInput'
import { useAutoSave } from '../hooks/useAutoSave'
import { fetchPage } from '../api'
import type { Page } from '../types'

const DEFAULT_VALUE: Descendant[] = [
  { type: 'paragraph', children: [{ text: '' }] },
]

function parsePageData(raw: string | null | undefined): Descendant[] {
  if (!raw) return DEFAULT_VALUE
  try {
    const parsed = JSON.parse(raw)
    if (Array.isArray(parsed) && parsed.length > 0) return parsed
    return DEFAULT_VALUE
  } catch {
    return DEFAULT_VALUE
  }
}

type State =
  | { status: 'loading' }
  | { status: 'error'; message: string }
  | { status: 'ready'; page: Page }

type Action =
  | { type: 'loading' }
  | { type: 'error'; message: string }
  | { type: 'ready'; page: Page }

function reducer(_state: State, action: Action): State {
  switch (action.type) {
    case 'loading':
      return { status: 'loading' }
    case 'error':
      return { status: 'error', message: action.message }
    case 'ready':
      return { status: 'ready', page: action.page }
  }
}

export function PageEditor() {
  const { projectId, pageId } = useParams<{ projectId: string; pageId: string }>()
  const [state, dispatch] = useReducer(reducer, { status: 'loading' })

  const { save, isSaving } = useAutoSave(projectId!, pageId!)

  useEffect(() => {
    if (!projectId || !pageId) return

    let cancelled = false
    dispatch({ type: 'loading' })

    fetchPage(projectId, pageId)
      .then(data => {
        if (!cancelled) dispatch({ type: 'ready', page: data })
      })
      .catch(err => {
        if (!cancelled)
          dispatch({
            type: 'error',
            message: err instanceof Error ? err.message : 'Erro ao carregar página',
          })
      })

    return () => {
      cancelled = true
    }
  }, [projectId, pageId])

  if (state.status === 'loading') {
    return (
      <div className="flex flex-1 items-center justify-center text-text-secondary">
        <p className="text-sm">Carregando...</p>
      </div>
    )
  }

  if (state.status === 'error') {
    return (
      <div className="flex flex-1 items-center justify-center text-text-secondary">
        <p className="text-sm">{state.message}</p>
      </div>
    )
  }

  const { page } = state
  const initialValue = parsePageData(page.pageData)

  return (
    <div className="flex w-full max-w-4xl min-h-0 flex-1 flex-col rounded-lg border border-border bg-bg-container shadow-sm overflow-hidden">
      <div className="relative">
        <PageTitleInput
          projectId={projectId!}
          pageId={pageId!}
          initialTitle={page.title}
        />
        {isSaving && (
          <span className="absolute right-4 top-8 text-xs text-text-tertiary">
            Salvando...
          </span>
        )}
      </div>
      <RichTextEditor
        key={pageId}
        initialValue={initialValue}
        onChange={value => save(JSON.stringify(value))}
        projectId={projectId}
      />
    </div>
  )
}
