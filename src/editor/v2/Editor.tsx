import isHotkey from 'is-hotkey'
import React, { useCallback, useMemo } from 'react'
import {
    Editor,
    type Descendant, Element as SlateElement,
    Transforms
} from 'slate'
import { Slate, Editable, type RenderElementProps, type RenderLeafProps } from 'slate-react'
//import { withHistory } from 'slate-history'

import { CommandMenu } from './CommandMenu'
import { toggleMark, isEmptyBlock, unwrapList, isCodeBlockActive, getActiveBlock } from './editorCommands'
import type { CustomTextKey } from './types'
import { createCustomEditor } from './createCustomEditor'

import { Toolbar as NewToolbar } from './Toolbar'
import { COMMANDS } from './commands'


const HOTKEYS: Record<string, CustomTextKey> = {
    'mod+b': 'bold',
    'mod+i': 'italic',
    'mod+u': 'underline',
    'mod+`': 'code',
}

export default function RichTextEditor() {
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
    const [query, setQuery] = React.useState('')
    const [index, setIndex] = React.useState(0)
    return (

        <Slate editor={editor} initialValue={initialValue}>
            {/* <Toolbar/> */}
            <NewToolbar />
            <div className='editor'>

                <Editable
                    className='border-gray-300 border-l w-175'
                    style={{ padding: "4px", height: "100%" }}
                    renderElement={renderElement}
                    renderLeaf={renderLeaf}
                    placeholder="Digite / para comandos…"
                    onKeyDown={event => {
                        if (event.key === 'Enter' && isCodeBlockActive(editor)) {
                            // Shift + Enter → sai do code block
                            if (event.shiftKey) {
                                event.preventDefault()

                                Editor.insertBreak(editor)
                                Transforms.setNodes(editor, { type: 'paragraph' })
                                return
                            }

                            // Enter normal → nova linha no code block
                            event.preventDefault()
                            Editor.insertText(editor, '\n')
                            return
                        }

                        if (event.key === 'Enter' && !event.shiftKey) {
                            const block = getActiveBlock(editor)

                            if (
                                block &&
                                ['heading-one', 'heading-two', 'block-quote', 'code-inline'].includes(block.type)
                            ) {
                                event.preventDefault()

                                // quebra de linha + volta para parágrafo
                                Editor.insertBreak(editor)
                                Transforms.setNodes(editor, { type: 'paragraph' })
                                return
                            }
                        }
                        if (event.key === 'Backspace') {
                            const [listItem] = Editor.nodes(editor, {
                                match: n =>
                                    SlateElement.isElement(n) &&
                                    (n.type === 'list-item' || n.type === 'code-block'),
                            })

                            if (listItem && isEmptyBlock(editor)) {
                                event.preventDefault()
                                unwrapList(editor)
                                return
                            }
                        }

                        if (event.key === '/') {
                            setMenuOpen(true)
                            setQuery('')
                            setIndex(0)
                            return
                        }

                        if (!menuOpen) return

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

                            const command = COMMANDS[index]
                            if (!command) return

                            // remove "/query"
                            Transforms.delete(editor, {
                                distance: query.length + 1,
                                unit: 'character',
                                reverse: true,
                            })

                            command.run(editor)
                            setMenuOpen(false)
                        }

                        // hotkeys normais
                        for (const hotkey in HOTKEYS) {
                            if (isHotkey(hotkey, event)) {
                                event.preventDefault()
                                toggleMark(editor, HOTKEYS[hotkey])
                            }
                        }
                    }}
                // onKeyDown={event => {
                //     for (const hotkey in HOTKEYS) {
                //         if (isHotkey(hotkey, event)) {
                //             event.preventDefault()
                //             toggleMark(editor, HOTKEYS[hotkey])
                //         }
                //     }
                // }}
                />
            </div>

            <CommandMenu
                open={menuOpen}
                query={query}
                index={index}
                setIndex={setIndex}
                close={() => setMenuOpen(false)}
            />
        </Slate>

    )
}

/* ---------- ELEMENT ---------- */

const Element = ({ attributes, children, element }: RenderElementProps) => {
    const style: React.CSSProperties = {
        textAlign: 'align' in element ? element.align : undefined,
    }

    switch (element.type) {
        case 'heading-one':
            return <h1 style={style} {...attributes}>{children}</h1>
        case 'heading-two':
            return <h2 style={style} {...attributes}>{children}</h2>
        case 'block-quote':
            return <blockquote className='font-light text-sm border-l-4 border-gray-300
                                        pl-4 ml-2
                                        italic text-gray-700
                                        bg-gray-50
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
                    className="
                       bg-gray-200 text-red-600
                rounded-md
                font-mono text-sm
                overflow-x-auto
                p-1
                leading-relaxed
                whitespace-pre-wrap
                    "
                >
                    {children}
                </pre>
            )
        default:
            return <p style={style} {...attributes}>{children}</p>
    }
}


/* ---------- LEAF ---------- */

const Leaf = ({ attributes, children, leaf }: RenderLeafProps) => {
    if (leaf.bold) children = <strong>{children}</strong>
    if (leaf.italic) children = <em>{children}</em>
    if (leaf.underline) children = <u>{children}</u>
    if (leaf.code) children = <code className="bg-gray-200 text-red-600 px-1 rounded font-mono text-sm">{children}</code>

    return <span {...attributes}>{children}</span>
}

/* ---------- INITIAL VALUE ---------- */

const initialValue: Descendant[] = [
    {
        type: 'paragraph',
        children: [{ text: '' }],
    },
]
