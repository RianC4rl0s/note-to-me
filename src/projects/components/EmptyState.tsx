import { FiFolder } from 'react-icons/fi'

type EmptyStateProps = {
  onCreateProject: () => void
}

export function EmptyState({ onCreateProject }: EmptyStateProps) {
  return (
    <div className="flex flex-1 flex-col items-center justify-center gap-4 text-text-secondary">
      <FiFolder className="h-16 w-16 text-text-tertiary" />
      <h2 className="text-xl font-semibold text-text-primary">
        Bem-vindo ao note-to-me
      </h2>
      <p className="text-sm">Crie seu primeiro projeto para começar</p>
      <button
        onClick={onCreateProject}
        className="rounded-md bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover"
      >
        Criar projeto
      </button>
    </div>
  )
}
