import { useState } from 'react'
import { Link, Outlet, useNavigate } from 'react-router-dom'
import { Alert, Dropdown } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  StopOutlined,
  MoonOutlined,
  SunOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import { FiEdit3 } from 'react-icons/fi'
import { useAuth } from '../../auth/AuthContext'
import { useTheme } from '../../theme/ThemeContext'
import { COLOR_SCHEMES } from '../../theme/themeConfig'
import { useProjects } from '../hooks/useProjects'
import { Sidebar, SidebarToggle } from './Sidebar'
import { EmptyState } from './EmptyState'

export function WorkspaceLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false)
  const { user, logout, isAdmin, isImpersonating, stopImpersonating } = useAuth()
  const { mode, colorScheme, toggleMode, setColorScheme } = useTheme()
  const navigate = useNavigate()

  const {
    projects,
    isLoading: projectsLoading,
    addProject,
    renameProject,
    removeProject,
  } = useProjects()

  const handleAddProject = async () => {
    const project = await addProject('Novo projeto')
    navigate(`/projects/${project.id}/pages`)
  }

  const handleDeleteProject = async (id: string) => {
    await removeProject(id)
    navigate('/')
  }

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-1 py-1">
          <div className="text-sm font-medium text-text-primary">
            {user?.name ?? user?.email}
          </div>
          {user?.name && (
            <div className="text-xs text-text-secondary">{user.email}</div>
          )}
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    {
      key: 'settings',
      icon: <SettingOutlined />,
      label: <Link to="/settings">Configurações</Link>,
    },
    ...(isAdmin && !isImpersonating
      ? [
          {
            key: 'admin',
            icon: <SettingOutlined />,
            label: <Link to="/admin/users">Admin</Link>,
          },
        ]
      : []),
    ...(isImpersonating
      ? [
          {
            key: 'stop-impersonating',
            icon: <StopOutlined />,
            label: 'Parar de representar',
            onClick: stopImpersonating,
          },
        ]
      : []),
    { type: 'divider' as const },
    {
      key: 'theme-label',
      label: <span className="text-xs text-text-tertiary">Aparência</span>,
      disabled: true,
    },
    {
      key: 'theme-mode',
      icon: mode === 'light' ? <MoonOutlined /> : <SunOutlined />,
      label: mode === 'light' ? 'Modo escuro' : 'Modo claro',
      onClick: toggleMode,
    },
    {
      key: 'theme-colors',
      label: (
        <div className="flex items-center gap-2 py-1">
          {COLOR_SCHEMES.map(s => (
            <button
              key={s.value}
              onClick={e => {
                e.stopPropagation()
                setColorScheme(s.value)
              }}
              className={`h-4 w-4 rounded-full border-2 transition-transform ${
                colorScheme === s.value
                  ? 'scale-125 border-text-primary'
                  : 'border-transparent hover:scale-110'
              }`}
              style={{ backgroundColor: s.color }}
              title={s.label}
            />
          ))}
        </div>
      ),
    },
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: logout,
      danger: true,
    },
  ]

  const isRootRoute =
    location.pathname === '/' || location.pathname === ''

  return (
    <div className="flex h-screen w-full flex-col bg-bg-page">
      {isImpersonating && (
        <Alert
          type="warning"
          banner
          message={
            <span>
              Representando <strong>{user?.name ?? user?.email}</strong>
            </span>
          }
        />
      )}

      <header className="flex items-center justify-between border-b border-border bg-bg-container px-4 py-2">
        <Link to="/" className="flex items-center gap-2 text-text-primary hover:text-primary">
          <FiEdit3 className="h-[18px] w-[18px]" />
          <span className="text-base font-bold tracking-tight">Note To Me</span>
        </Link>
        <Dropdown
          menu={{ items: menuItems }}
          trigger={['click']}
          placement="bottomRight"
        >
          <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:opacity-90">
            <UserOutlined />
          </button>
        </Dropdown>
      </header>

      <div className="relative flex flex-1 overflow-hidden">
        {sidebarCollapsed && (
          <SidebarToggle onClick={() => setSidebarCollapsed(false)} />
        )}

        <Sidebar
          collapsed={sidebarCollapsed}
          onToggle={() => setSidebarCollapsed(c => !c)}
          projects={projects}
          onAddProject={handleAddProject}
          onRenameProject={renameProject}
          onDeleteProject={handleDeleteProject}
          isLoading={projectsLoading}
        />

        <main className="flex flex-1 min-h-0 justify-center overflow-hidden px-4 py-6">
          {isRootRoute && !projectsLoading ? (
            <EmptyState onCreateProject={handleAddProject} />
          ) : (
            <Outlet />
          )}
        </main>
      </div>
    </div>
  )
}
