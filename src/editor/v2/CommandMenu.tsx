import { useSlate } from 'slate-react'
import { COMMANDS } from './commands'
import { useCursorPosition } from './useCursorPosition'

export function CommandMenu({
  open,
  query,
  index,
  setIndex,
  close,
}: {
  open: boolean
  query: string
  index: number
  setIndex: (n: number) => void
  close: () => void
}) {
  const editor = useSlate()
 const position = useCursorPosition(editor)

  if (!open || !position) return null

  const filtered = COMMANDS.filter(cmd =>
    cmd.label.toLowerCase().includes(query.toLowerCase()) ||
    cmd.keywords.some(k => k.includes(query.toLowerCase()))
  )

  return (
    <div className="absolute z-50 bg-white shadow rounded w-64"
    style={{
        top: position.bottom + window.scrollY + 4,
        left: position.left + window.scrollX,
      }}
    >
      {filtered.map((cmd, i) => (
        <div
          key={cmd.id}
          className={`px-3 py-2 cursor-pointer ${
            i === index ? 'bg-gray-100' : ''
          }`}
          onMouseEnter={() => setIndex(i)}
          onMouseDown={e => {
            e.preventDefault()
            cmd.run(editor)
            close()
          }}
        >
          {cmd.label}
        </div>
      ))}
    </div>
  )
}
