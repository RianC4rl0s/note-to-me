import { Editor, Range } from 'slate'
import { ReactEditor } from 'slate-react'
import { useLayoutEffect, useState } from 'react'

export function useCursorPosition(editor: Editor) {
  const [position, setPosition] = useState<DOMRect | null>(null)

  useLayoutEffect(() => {
    if (!editor.selection || !Range.isCollapsed(editor.selection)) {
      if (position !== null) setPosition(null)
      return
    }

    try {
      const domRange = ReactEditor.toDOMRange(editor, editor.selection)
      const rect = domRange.getBoundingClientRect()

      // ⚠️ só atualiza se realmente mudou
      if (
        !position ||
        rect.top !== position.top ||
        rect.left !== position.left
      ) {
        setPosition(rect)
      }
    } catch {
      if (position !== null) setPosition(null)
    }
  }, [editor.selection]) // ⚠️ dependência correta

  return position
}
