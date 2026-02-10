import { Editor, Element as SlateElement } from 'slate'
import type { CustomEditor, CustomTextKey, CustomElementType, AlignType } from './types'
import { isAlignElement } from './typeguard'

export function isMarkActive(editor: CustomEditor, format: CustomTextKey) {
  const marks = Editor.marks(editor)
  return marks ? marks[format] === true : false
}

export function isBlockActive(editor: CustomEditor, type: CustomElementType) {
  const { selection } = editor
  if (!selection) return false

  const [match] = Editor.nodes(editor, {
    match: n =>
      !Editor.isEditor(n) &&
      SlateElement.isElement(n) &&
      n.type === type,
  })

  return !!match
}




export function isAlignActive(
  editor: CustomEditor,
  align: AlignType
) {
  const { selection } = editor
  if (!selection) return false

  const [match] = Editor.nodes(editor, {
    match: n =>
      isAlignElement(n) &&
      n.align === align,
  })

  return !!match
}
