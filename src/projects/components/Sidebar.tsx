import { FiPlus, FiChevronsLeft, FiChevronsRight } from 'react-icons/fi'
import type { Project } from '../types'
import { ProjectItem } from './ProjectItem'

type SidebarProps = {
  collapsed: boolean
  onToggle: () => void
  projects: Project[]
  onAddProject: () => void
  onRenameProject: (id: string, name: string) => Promise<unknown>
  onDeleteProject: (id: string) => Promise<unknown>
  isLoading: boolean
}

export function Sidebar({
  collapsed,
  onToggle,
  projects,
  onAddProject,
  onRenameProject,
  onDeleteProject,
  isLoading,
}: SidebarProps) {
  return (
    <aside
      className={`flex shrink-0 flex-col border-r border-border bg-bg-container transition-all duration-200 ${
        collapsed ? 'w-0 overflow-hidden' : 'w-64'
      }`}
    >
      <div className="flex items-center justify-between border-b border-border px-3 py-2">
        <span className="text-xs font-semibold uppercase tracking-wider text-text-tertiary">
          Projetos
        </span>
        <div className="flex items-center gap-1">
          <button
            onClick={onAddProject}
            className="rounded p-1 text-text-secondary hover:bg-bg-spotlight hover:text-text-primary"
            title="Novo projeto"
          >
            <FiPlus className="h-4 w-4" />
          </button>
          <button
            onClick={onToggle}
            className="rounded p-1 text-text-secondary hover:bg-bg-spotlight hover:text-text-primary"
            title="Recolher sidebar"
          >
            <FiChevronsLeft className="h-4 w-4" />
          </button>
        </div>
      </div>

      <nav className="flex-1 overflow-y-auto px-2 py-2">
        {isLoading ? (
          <p className="px-2 py-4 text-center text-xs text-text-tertiary">Carregando...</p>
        ) : projects.length === 0 ? (
          <p className="px-2 py-4 text-center text-xs text-text-tertiary">
            Nenhum projeto ainda
          </p>
        ) : (
          <div className="flex flex-col gap-0.5">
            {projects.map(project => (
              <ProjectItem
                key={project.id}
                projectId={project.id}
                name={project.name}
                onRename={onRenameProject}
                onDelete={onDeleteProject}
              />
            ))}
          </div>
        )}
      </nav>
    </aside>
  )
}

export function SidebarToggle({ onClick }: { onClick: () => void }) {
  return (
    <button
      onClick={onClick}
      className="fixed left-2 top-14 z-10 rounded-md border border-border bg-bg-container p-1.5 text-text-secondary shadow-sm hover:bg-bg-spotlight hover:text-text-primary"
      title="Abrir sidebar"
    >
      <FiChevronsRight className="h-4 w-4" />
    </button>
  )
}
