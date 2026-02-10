import { Editor, Transforms, Element as SlateElement } from 'slate'
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

// export function handleKeyDown(
//   event: React.KeyboardEvent,
//   editor: CustomEditor,
//   open: boolean,
//   setOpen: (v: boolean) => void,
//   query: string,
//   setQuery: (v: string) => void,
//   index: number,
//   setIndex: (v: number) => void
// ) {
//   if (event.key === '/') {
//     setOpen(true)
//     setQuery('')
//     setIndex(0)
//     return
//   }

//   if (!open) return

//   if (event.key === 'ArrowDown') {
//     event.preventDefault()
//     setIndex(i => i + 1)
//     return
//   }

//   if (event.key === 'ArrowUp') {
//     event.preventDefault()
//     setIndex(i => Math.max(0, i - 1))
//     return
//   }

//   if (event.key === 'Escape') {
//     setOpen(false)
//     return
//   }

//   if (event.key === 'Enter') {
//     event.preventDefault()

//     const command = COMMANDS[index]
//     if (!command) return

//     // remove "/query"
//     Transforms.delete(editor, {
//       distance: query.length + 1,
//       unit: 'character',
//       reverse: true,
//     })

//     command.run(editor)
//     setOpen(false)
//   }

//   // letras → filtro
//   if (event.key.length === 1) {
//     setQuery(q => q + event.key)
//     setIndex(0)
//   }
// }