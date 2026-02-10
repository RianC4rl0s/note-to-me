import type { CustomEditor } from './types'
import { toggleBlock } from './editorCommands'

export type Command = {
  id: string
  label: string
  keywords: string[]
  run: (editor: CustomEditor) => void
}

export const COMMANDS: Command[] = [
  {
    id: 'paragraph',
    label: 'Parágrafo',
    keywords: ['p', 'text'],
    run: editor => toggleBlock(editor, 'paragraph'),
  },
  {
    id: 'h1',
    label: 'Heading 1',
    keywords: ['h1', 'title'],
    run: editor => toggleBlock(editor, 'heading-one'),
  },
  {
    id: 'h2',
    label: 'Heading 2',
    keywords: ['h2', 'subtitle'],
    run: editor => toggleBlock(editor, 'heading-two'),
  },
  {
    id: 'quote',
    label: 'Quote',
    keywords: ['quote', 'citação'],
    run: editor => toggleBlock(editor, 'block-quote'),
  },
  {
    id: 'code',
    label: 'Code block',
    keywords: ['code', 'snippet'],
    run: editor => toggleBlock(editor, 'code-block'),
  },
  {
    id: 'bullet',
    label: 'Lista',
    keywords: ['list', 'bullet'],
    run: editor => toggleBlock(editor, 'bulleted-list'),
  },
]
