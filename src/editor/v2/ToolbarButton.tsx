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
        text-text-secondary
        hover:bg-bg-spotlight
        rounded
        ${active ? 'bg-bg-spotlight text-text-primary' : ''}
      `}
    >
      {children}
    </button>
  )
}
