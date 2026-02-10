import { createEditor } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import type { CustomEditor } from './types'

export function createCustomEditor() {
  return withHistory(withReact(createEditor())) as CustomEditor
}
