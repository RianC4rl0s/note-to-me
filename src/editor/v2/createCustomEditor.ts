import { createEditor, Element as SlateElement } from 'slate'
import { withHistory } from 'slate-history'
import { withReact } from 'slate-react'
import type { CustomEditor } from './types'

function withCustomElements(editor: CustomEditor): CustomEditor {
  const { isInline, isVoid } = editor

  editor.isInline = (element) => {
    if (
      SlateElement.isElement(element) &&
      (element.type === 'page-link' || element.type === 'link')
    ) {
      return true
    }
    return isInline(element)
  }

  editor.isVoid = (element) => {
    if (
      SlateElement.isElement(element) &&
      (element.type === 'divider' || element.type === 'page-link')
    ) {
      return true
    }
    return isVoid(element)
  }

  return editor
}

export function createCustomEditor() {
  return withCustomElements(
    withHistory(withReact(createEditor())) as CustomEditor,
  )
}
