import type { BaseEditor } from 'slate'
import { ReactEditor } from 'slate-react'
import { HistoryEditor } from 'slate-history'

/* ---------- TEXT ---------- */

export type CustomText = {
  text: string
  bold?: boolean
  italic?: boolean
  underline?: boolean
  strikethrough?: boolean
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

export type CheckListItemElement = {
  type: 'check-list-item'
  checked: boolean
  children: CustomText[]
}

export type DividerElement = {
  type: 'divider'
  children: [CustomText]
}

export type PageLinkElement = {
  type: 'page-link'
  pageId: string
  pageTitle: string
  children: [CustomText]
}

export type LinkElement = {
  type: 'link'
  url: string
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
  | CheckListItemElement
  | DividerElement
  | PageLinkElement
  | LinkElement

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
  | 'check-list-item'
  | 'divider'
