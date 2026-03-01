import isHotkey from 'is-hotkey'
import React, { useCallback, useMemo } from 'react'
import {
    Editor,
    type Descendant, Element as SlateElement,
    Range,
    Transforms
} from 'slate'
import { Slate, Editable, type RenderElementProps, type RenderLeafProps, useSlateStatic, ReactEditor } from 'slate-react'
import { useNavigate } from 'react-router-dom'

import { CommandMenu } from './CommandMenu'
import { toggleMark, isEmptyBlock, unwrapList, isCodeBlockActive, getActiveBlock } from './editorCommands'
import type { CustomTextKey } from './types'
import { createCustomEditor } from './createCustomEditor'
import { HoveringToolbar } from './HoveringToolbar'

import { Toolbar as NewToolbar } from './Toolbar'
import { COMMANDS } from './commands'
import { FiFileText, FiExternalLink } from 'react-icons/fi'


const HOTKEYS: Record<string, CustomTextKey> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
    'mod+shift+s': 'strikethrough',
}

type RichTextEditorProps = {
    initialValue?: Descendant[]
    onChange?: (value: Descendant[]) => void
    projectId?: string
}

const DEFAULT_VALUE: Descendant[] = [
    { type: 'paragraph', children: [{ text: '' }] },
]

export default function RichTextEditor({ initialValue, onChange, projectId }: RichTextEditorProps) {
    const editor = useMemo(() => createCustomEditor(), [])

    const renderElement = useCallback(
        (props: RenderElementProps) => <Element {...props} />,
        []
    )

    const renderLeaf = useCallback(
        (props: RenderLeafProps) => <Leaf {...props} />,
        []
    )
    const [menuOpen, setMenuOpen] = React.useState(false)
    const [index, setIndex] = React.useState(0)
    return (

        <Slate
            editor={editor}
            initialValue={initialValue ?? DEFAULT_VALUE}
            onChange={value => {
                const isAstChange = editor.operations.some(
                    op => op.type !== 'set_selection'
                )
                if (isAstChange && onChange) {
                    onChange(value)
                }

                // Close command menu if "/" context is lost
                if (menuOpen) {
                    const { selection } = editor
                    if (!selection || !Range.isCollapsed(selection)) {
                        setMenuOpen(false)
                        return
                    }
                    try {
                        const [node] = Editor.node(editor, selection)
                        if ('text' in node) {
                            const text = (node as { text: string }).text
                            const offset = selection.anchor.offset
                            const before = text.slice(0, offset)
                            if (!before.includes('/')) {
                                setMenuOpen(false)
                            }
                        } else {
                            setMenuOpen(false)
                        }
                    } catch {
                        setMenuOpen(false)
                    }
                }
            }}
        >
            <div className="flex flex-1 min-h-0 flex-col">
            <NewToolbar />
            <HoveringToolbar />
            <div className='editor flex-1 min-h-0 overflow-y-auto overflow-x-hidden'>

                <Editable
                    className='w-full'
                    style={{ padding: "16px", minHeight: "100%" }}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Digite / para comandos…"
                    onKeyDown={event => {
                        if (event.key === 'Enter' && isCodeBlockActive(editor)) {
                            if (event.shiftKey) {
                                event.preventDefault()
                                Editor.insertBreak(editor)
                                Transforms.setNodes(editor, { type: 'paragraph' })
                                return
                            }
                            event.preventDefault()
                            Editor.insertText(editor, '\n')
                            return
                        }

                        if (event.key === 'Enter' && !event.shiftKey) {
                            const block = getActiveBlock(editor)

                            if (
                                block &&
                                ['heading-one', 'heading-two', 'block-quote'].includes(block.type)
                            ) {
                                event.preventDefault()
                                Editor.insertBreak(editor)
                                Transforms.setNodes(editor, { type: 'paragraph' })
                                return
                            }

                            if (block && block.type === 'check-list-item' && isEmptyBlock(editor)) {
                                event.preventDefault()
                                Transforms.setNodes(editor, { type: 'paragraph' })
                                return
                            }

                            if (block && block.type === 'check-list-item') {
                                event.preventDefault()
                                Editor.insertBreak(editor)
                                Transforms.setNodes(editor, { type: 'check-list-item', checked: false })
                                return
                            }
                        }

                        if (event.key === 'Backspace') {
                            const [listItem] = Editor.nodes(editor, {
                                match: n =>
                                    SlateElement.isElement(n) &&
                                    (n.type === 'list-item' || n.type === 'code-block' || n.type === 'check-list-item'),
                            })

                            if (listItem && isEmptyBlock(editor)) {
                                event.preventDefault()
                                if (SlateElement.isElement(listItem[0]) && listItem[0].type === 'check-list-item') {
                                    Transforms.setNodes(editor, { type: 'paragraph' })
                                } else {
                                    unwrapList(editor)
                                }
                                return
                            }
                        }

                        if (event.key === 'Tab') {
                            event.preventDefault()
                            Editor.insertText(editor, '  ')
                            return
                        }

                        if (event.key === '/') {
                            setMenuOpen(true)
                            setIndex(0)
                            return
                        }

                        if (!menuOpen) {
                            for (const hotkey in HOTKEYS) {
                                if (isHotkey(hotkey, event)) {
                                    event.preventDefault()
                                    toggleMark(editor, HOTKEYS[hotkey])
                                }
                            }
                            return
                        }

                        if (event.key === ' ') {
                            setMenuOpen(false)
                            return
                        }

                        if (event.key === 'ArrowDown') {
                            event.preventDefault()
                            setIndex(i => i + 1)
                            return
                        }

                        if (event.key === 'ArrowUp') {
                            event.preventDefault()
                            setIndex(i => Math.max(0, i - 1))
                            return
                        }

                        if (event.key === 'Escape') {
                            setMenuOpen(false)
                            return
                        }

                        if (menuOpen && event.key === 'Enter') {
                            event.preventDefault()

                            // Read query from editor text
                            const { selection } = editor
                            if (!selection) return
                            const [node] = Editor.node(editor, selection)
                            if (!('text' in node)) return
                            const text = (node as { text: string }).text
                            const offset = selection.anchor.offset
                            const before = text.slice(0, offset)
                            const slashIdx = before.lastIndexOf('/')
                            const q = slashIdx === -1 ? '' : before.slice(slashIdx + 1)

                            const filtered = COMMANDS.filter(cmd =>
                                cmd.label.toLowerCase().includes(q.toLowerCase()) ||
                                cmd.keywords.some(k => k.includes(q.toLowerCase()))
                            )
                            const command = filtered[index]
                            if (!command) return

                            Transforms.delete(editor, {
                                distance: q.length + 1,
                                unit: 'character',
                                reverse: true,
                            })

                            command.run(editor)
                            setMenuOpen(false)
                        }
                    }}
                />
            </div>

            <CommandMenu
                open={menuOpen}
                index={index}
                setIndex={setIndex}
                close={() => setMenuOpen(false)}
                projectId={projectId}
            />
            </div>
        </Slate>

    )
}

/* ---------- ELEMENT ---------- */

const Element = (props: RenderElementProps) => {
    const { attributes, children, element } = props

    const style: React.CSSProperties = {
        textAlign: 'align' in element ? element.align : undefined,
    }

    switch (element.type) {
        case 'heading-one':
            return <h1 style={style} {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 style={style} {...attributes}>{children}</h2>
        case 'block-quote':
            return <blockquote className='font-light text-sm border-l-4 border-border
                                        pl-4 ml-2
                                        italic text-text-secondary
                                        bg-bg-spotlight
                                        rounded-sm'
                style={style} {...attributes}>{children}</blockquote>
        case 'bulleted-list':
            return <ul {...attributes}>{children}</ul>
        case 'numbered-list':
            return <ol {...attributes}>{children}</ol>
        case 'list-item':
            return <li style={style} {...attributes}>{children}</li>
        case 'code-block':
            return (
                <pre
                    {...attributes}
                    className="bg-code-bg text-code-text rounded-md font-mono text-sm overflow-x-auto p-1 leading-relaxed whitespace-pre-wrap"
                >
                    {children}
                </pre>
            )
        case 'check-list-item':
            return <CheckListItemElement {...props} />
        case 'divider':
            return (
                <div {...attributes} contentEditable={false} className="py-2">
                    <hr className="border-border" />
                    {children}
                </div>
            )
        case 'page-link':
            return <PageLinkInline {...props} />
        case 'link':
            return <LinkInline {...props} />
        default:
            return <p style={style} {...attributes}>{children}</p>
    }
}

/* ---------- CHECK LIST ITEM ---------- */

function CheckListItemElement({ attributes, children, element }: RenderElementProps) {
    const editor = useSlateStatic()

    if (element.type !== 'check-list-item') return null
    const checked = element.checked
    const path = ReactEditor.findPath(editor, element)

    return (
        <div className="check-list-item" {...attributes}>
            <span contentEditable={false} className="mr-2 flex-shrink-0 select-none">
                <input
                    type="checkbox"
                    checked={checked}
                    onChange={e => {
                        Transforms.setNodes(
                            editor,
                            { checked: e.target.checked },
                            { at: path },
                        )
                    }}
                    className="h-4 w-4 accent-primary cursor-pointer"
                />
            </span>
            <span className={`flex-1 ${checked ? 'line-through opacity-50' : ''}`}>
                {children}
            </span>
        </div>
    )
}

/* ---------- PAGE LINK ---------- */

function PageLinkInline({ attributes, children, element }: RenderElementProps) {
    const navigate = useNavigate()

    if (element.type !== 'page-link') return null

    const handleClick = (e: React.MouseEvent) => {
        e.preventDefault()
        const match = window.location.pathname.match(/\/projects\/([^/]+)/)
        if (match) {
            navigate(`/projects/${match[1]}/pages/${element.pageId}`)
        }
    }

    return (
        <span
            {...attributes}
            contentEditable={false}
            onClick={handleClick}
            className="inline-flex items-center gap-1 rounded bg-primary-bg px-1.5 py-0.5 text-xs font-medium text-primary cursor-pointer hover:opacity-80"
        >
            <FiFileText className="h-3 w-3" />
            {element.pageTitle}
            {children}
        </span>
    )
}

/* ---------- LINK ---------- */

function LinkInline({ attributes, children, element }: RenderElementProps) {
    if (element.type !== 'link') return null

    return (
        <a
            {...attributes}
            href={element.url}
            target="_blank"
            rel="noopener noreferrer"
            onClick={e => {
                if (!e.metaKey && !e.ctrlKey) return
                e.preventDefault()
                window.open(element.url, '_blank')
            }}
            className="text-primary underline decoration-primary/40 hover:decoration-primary inline-flex items-center gap-0.5"
        >
            {children}
            <span contentEditable={false} className="inline-flex items-center">
                <FiExternalLink className="inline h-3 w-3 shrink-0" />
            </span>
        </a>
    )
}

/* ---------- LEAF ---------- */

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) children = <strong>{children}</strong>
    if (leaf.italic) children = <em>{children}</em>
    if (leaf.underline) children = <u>{children}</u>
    if (leaf.strikethrough) children = <s>{children}</s>
    if (leaf.code) children = <code className="bg-code-bg text-code-text px-1 rounded font-mono text-sm">{children}</code>

    return <span {...attributes}>{children}</span>
}
