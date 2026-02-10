type Props = {
  active?: boolean
  onMouseDown: (e: React.MouseEvent) => void
  children: React.ReactNode
}

export function ToolbarButton({ active, onMouseDown, children }: Props) {
  return (
    <button
      onMouseDown={onMouseDown}
      className={`
        w-6 h-6 flex items-center justify-center
        text-gray-500
        hover:bg-gray-100
        rounded
        ${active ? 'bg-gray-200 text-black' : ''}
      `}
    >
      {children}
    </button>
  )
}
