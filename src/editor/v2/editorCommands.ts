import { Editor, Transforms, Element as SlateElement, Range } from 'slate'
import type {
    AlignType,
    CustomEditor,
    CustomElementType,
    CustomTextKey,
} from './types'

/* ---------- MARKS ---------- */

export function toggleMark(
  editor: CustomEditor,
  format: CustomTextKey
) {
  const marks = Editor.marks(editor)
  const isActive = marks ? marks[format] === true : false

  if (isActive) {
    Editor.removeMark(editor, format)
  } else {
    Editor.addMark(editor, format, true)
  }
}

/* ---------- BLOCK TYPE ---------- */

export function toggleBlock(
  editor: CustomEditor,
  type: CustomElementType
) {
  if (!editor.selection) return

  const isList = type === 'bulleted-list' || type === 'numbered-list'

  Transforms.unwrapNodes(editor, {
    match: n =>
      SlateElement.isElement(n) &&
      (n.type === 'bulleted-list' || n.type === 'numbered-list'),
    split: true,
  })

  if (isList) {
    Transforms.setNodes(editor, { type: 'list-item' })
    Transforms.wrapNodes(editor, { type, children: [] })
  } else if (type === 'check-list-item') {
    Transforms.setNodes(editor, { type: 'check-list-item', checked: false })
  } else {
    Transforms.setNodes(editor, { type })
  }
}

/* ---------- ALIGN ---------- */

export function toggleAlign(editor: CustomEditor, align: AlignType) {
  if (!editor.selection) return

  Transforms.setNodes(
    editor,
    { align },
    {
      match: n => SlateElement.isElement(n),
    }
  )
}

/* ---------- INSERT HELPERS ---------- */

export function insertDivider(editor: CustomEditor) {
  Transforms.insertNodes(editor, {
    type: 'divider',
    children: [{ text: '' }],
  })
  Transforms.insertNodes(editor, {
    type: 'paragraph',
    children: [{ text: '' }],
  })
}

export function insertPageLink(
  editor: CustomEditor,
  pageId: string,
  pageTitle: string,
) {
  Transforms.insertNodes(editor, {
    type: 'page-link',
    pageId,
    pageTitle,
    children: [{ text: '' }],
  })
  Transforms.move(editor)
}

/* ---------- LINK HELPERS ---------- */

export function isLinkActive(editor: CustomEditor) {
  const [match] = Editor.nodes(editor, {
    match: n => SlateElement.isElement(n) && n.type === 'link',
  })
  return !!match
}

export function insertLink(editor: CustomEditor, url: string) {
  if (!editor.selection) return

  const { selection } = editor
  const isCollapsed = Range.isCollapsed(selection)

  const linkNode = {
    type: 'link' as const,
    url,
    children: isCollapsed ? [{ text: url }] : [],
  }

  if (isCollapsed) {
    Transforms.insertNodes(editor, linkNode)
  } else {
    Transforms.wrapNodes(editor, linkNode, { split: true })
    Transforms.collapse(editor, { edge: 'end' })
  }
}

export function removeLink(editor: CustomEditor) {
  Transforms.unwrapNodes(editor, {
    match: n => SlateElement.isElement(n) && n.type === 'link',
  })
}

/* ---------- QUERY HELPERS ---------- */

export function isEmptyBlock(editor: CustomEditor) {
  const [match] = Editor.nodes(editor, {
    match: n =>
      SlateElement.isElement(n) &&
      Editor.isEmpty(editor, n),
  })

  return !!match
}
export function unwrapList(editor: CustomEditor) {
  Transforms.unwrapNodes(editor, {
    match: n =>
      SlateElement.isElement(n) &&
      (n.type === 'bulleted-list' || n.type === 'numbered-list' || n.type === 'code-block'),
    split: true,
  })

  Transforms.setNodes(editor, { type: 'paragraph' })
}

export function isCodeBlockActive(editor: Editor) {
  const [match] = Editor.nodes(editor, {
    match: n =>
      SlateElement.isElement(n) && n.type === 'code-block',
  })

  return !!match
}
export function getActiveBlock(editor: Editor) {
  const [match] = Editor.nodes(editor, {
    match: n => SlateElement.isElement(n),
  })

  return match ? (match[0] as SlateElement) : null
}
