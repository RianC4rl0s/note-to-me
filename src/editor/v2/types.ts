import type { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

/* ---------- TEXT ---------- */

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  code?: boolean
}

export type CustomTextKey = keyof Omit<CustomText, 'text'>

/* ---------- ALIGN ---------- */

export type AlignType = 'left' | 'center' | 'right' | 'justify'

/* ---------- ELEMENTS ---------- */

export type ParagraphElement = {
  type: 'paragraph'
  align?: AlignType
  children: CustomText[]
}

export type HeadingOneElement = {
  type: 'heading-one'
  align?: AlignType
  children: CustomText[]
}

export type HeadingTwoElement = {
  type: 'heading-two'
  align?: AlignType
  children: CustomText[]
}

export type BlockQuoteElement = {
  type: 'block-quote'
  align?: AlignType
  children: CustomText[]
}

export type ListItemElement = {
  type: 'list-item'
  align?: AlignType
  children: CustomText[]
}

export type BulletedListElement = {
  type: 'bulleted-list'
  children: ListItemElement[]
}

export type NumberedListElement = {
  type: 'numbered-list'
  children: ListItemElement[]
}
export type CodeBlockElement = {
  type: 'code-block'
  children: CustomText[]
}
export type CustomElement =
  | ParagraphElement
  | HeadingOneElement
  | HeadingTwoElement
  | BlockQuoteElement
  | ListItemElement
  | BulletedListElement
  | NumberedListElement
    | CodeBlockElement

export type CustomElementType = CustomElement['type']


/* ---------- EDITOR ---------- */

export type CustomEditor = BaseEditor & ReactEditor & HistoryEditor

export type CustomElementWithAlign = {
  align?: AlignType
}

/* ---------- SLATE MODULE AUGMENTATION ---------- */

declare module 'slate' {
  interface CustomTypes {
    Editor: CustomEditor
    Element: CustomElement
    Text: CustomText
  }
}
export type BlockType =
  | 'paragraph'
  | 'heading-one'
  | 'heading-two'
  | 'bulleted-list'
  | 'numbered-list'
  | 'list-item'
  | 'code-block'