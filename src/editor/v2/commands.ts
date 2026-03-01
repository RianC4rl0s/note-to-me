import type { ReactNode } from 'react'
import type { CustomEditor } from './types'
import { toggleBlock, insertDivider } from './editorCommands'

export type Command = {
  id: string
  label: string
  description: string
  icon: ReactNode
  keywords: string[]
  run: (editor: CustomEditor) => void
}

export const COMMANDS: Command[] = [
  {
    id: 'paragraph',
    label: 'Parágrafo',
    description: 'Texto simples',
    icon: 'Aa',
    keywords: ['p', 'text', 'texto'],
    run: editor => toggleBlock(editor, 'paragraph'),
  },
  {
    id: 'h1',
    label: 'Heading 1',
    description: 'Título grande',
    icon: 'H1',
    keywords: ['h1', 'title', 'titulo'],
    run: editor => toggleBlock(editor, 'heading-one'),
  },
  {
    id: 'h2',
    label: 'Heading 2',
    description: 'Título médio',
    icon: 'H2',
    keywords: ['h2', 'subtitle', 'subtitulo'],
    run: editor => toggleBlock(editor, 'heading-two'),
  },
  {
    id: 'quote',
    label: 'Citação',
    description: 'Bloco de citação',
    icon: '❝',
    keywords: ['quote', 'citação', 'citacao'],
    run: editor => toggleBlock(editor, 'block-quote'),
  },
  {
    id: 'code',
    label: 'Bloco de código',
    description: 'Código formatado',
    icon: '</>',
    keywords: ['code', 'snippet', 'codigo'],
    run: editor => toggleBlock(editor, 'code-block'),
  },
  {
    id: 'bullet',
    label: 'Lista',
    description: 'Lista com marcadores',
    icon: '•',
    keywords: ['list', 'bullet', 'lista'],
    run: editor => toggleBlock(editor, 'bulleted-list'),
  },
  {
    id: 'numbered',
    label: 'Lista numerada',
    description: 'Lista ordenada',
    icon: '1.',
    keywords: ['ol', 'numbered', 'numerada', 'ordenada'],
    run: editor => toggleBlock(editor, 'numbered-list'),
  },
  {
    id: 'todo',
    label: 'To-do',
    description: 'Lista de tarefas',
    icon: '☑',
    keywords: ['todo', 'check', 'tarefa', 'task', 'checkbox'],
    run: editor => toggleBlock(editor, 'check-list-item'),
  },
  {
    id: 'divider',
    label: 'Divisor',
    description: 'Linha horizontal',
    icon: '―',
    keywords: ['hr', 'divider', 'divisor', 'linha', 'separador'],
    run: editor => insertDivider(editor),
  },
  {
    id: 'page',
    label: 'Link para página',
    description: 'Referência a outra página',
    icon: '📄',
    keywords: ['page', 'pagina', 'página', 'link', 'referencia', 'referência'],
    run: () => {
      // Handled specially by CommandMenu — opens page picker
    },
  },
]
