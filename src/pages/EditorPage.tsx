import { Link } from 'react-router-dom'
import { Alert, Dropdown } from 'antd'
import {
  UserOutlined,
  SettingOutlined,
  LogoutOutlined,
  StopOutlined,
} from '@ant-design/icons'
import type { MenuProps } from 'antd'
import RichTextEditor from '../editor/v2/Editor'
import { useAuth } from '../auth/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'

export function EditorPage() {
  const { user, logout, isAdmin, isImpersonating, stopImpersonating } = useAuth()

  const menuItems: MenuProps['items'] = [
    {
      key: 'user-info',
      label: (
        <div className="px-1 py-1">
          <div className="text-sm font-medium text-text-primary">{user?.name ?? user?.email}</div>
          {user?.name && (
            <div className="text-xs text-text-secondary">{user.email}</div>
          )}
        </div>
      ),
      disabled: true,
    },
    { type: 'divider' },
    ...(isAdmin && !isImpersonating
      ? [{
          key: 'admin',
          icon: <SettingOutlined />,
          label: <Link to="/admin/users">Admin</Link>,
        }]
      : []),
    ...(isImpersonating
      ? [{
          key: 'stop-impersonating',
          icon: <StopOutlined />,
          label: 'Parar de representar',
          onClick: stopImpersonating,
        }]
      : []),
    { type: 'divider' as const },
    {
      key: 'logout',
      icon: <LogoutOutlined />,
      label: 'Sair',
      onClick: logout,
      danger: true,
    },
  ]

  return (
    <div className="flex h-screen w-screen flex-col bg-bg-page">
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
        <span className="text-sm font-semibold text-text-primary">note-to-me</span>
        <div className="flex items-center gap-3">
          <ThemeToggle />
          <Dropdown menu={{ items: menuItems }} trigger={['click']} placement="bottomRight">
            <button className="flex h-8 w-8 items-center justify-center rounded-full bg-primary text-white hover:opacity-90">
              <UserOutlined />
            </button>
          </Dropdown>
        </div>
      </header>
      <div className="flex flex-1 justify-center overflow-hidden px-4 py-6">
        <div className="flex w-full max-w-4xl flex-col rounded-lg border border-border bg-bg-container shadow-sm overflow-hidden">
          <RichTextEditor />
        </div>
      </div>
    </div>
  )
}
