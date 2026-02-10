import { Element as SlateElement } from 'slate'
import type { CustomElementWithAlign } from './types'

export function isAlignElement(
  element: unknown
): element is SlateElement & CustomElementWithAlign {
  return (
    SlateElement.isElement(element) &&
    'align' in element
  )
}
