import { Layout, Menu, Button, theme, ConfigProvider } from 'antd'
import {
  UserOutlined,
  SafetyOutlined,
  KeyOutlined,
  CrownOutlined,
  LogoutOutlined,
  HomeOutlined,
} from '@ant-design/icons'
import { Outlet, useNavigate, useLocation, Link } from 'react-router-dom'
import { useAuth } from '../auth/AuthContext'
import { ThemeToggle } from '../components/ThemeToggle'
import { useTheme } from '../theme/ThemeContext'

const { Sider, Content, Header } = Layout

const menuItems = [
  { key: '/admin/users', icon: <UserOutlined />, label: 'Usuários' },
  { key: '/admin/roles', icon: <SafetyOutlined />, label: 'Roles' },
  { key: '/admin/permissions', icon: <KeyOutlined />, label: 'Permissões' },
  { key: '/admin/plans', icon: <CrownOutlined />, label: 'Planos' },
]

const SIDER_BG = '#1f1f23'

export function AdminLayout() {
  const { user, logout } = useAuth()
  const navigate = useNavigate()
  const location = useLocation()
  const { token } = theme.useToken()
  const { mode } = useTheme()

  const siderBg = mode === 'dark' ? '#18181b' : SIDER_BG

  return (
    <Layout style={{ minHeight: '100vh' }}>
      <Sider
        breakpoint="lg"
        collapsedWidth={80}
        style={{ background: siderBg }}
      >
        <div style={{ padding: 16, textAlign: 'center' }}>
          <Link to="/" style={{ color: 'rgba(255,255,255,0.85)', fontSize: 16, fontWeight: 600 }}>
            note-to-me
          </Link>
        </div>
        <ConfigProvider
          theme={{
            components: {
              Menu: {
                darkItemBg: siderBg,
                darkSubMenuItemBg: siderBg,
                darkItemSelectedBg: token.colorPrimary,
                darkItemSelectedColor: '#ffffff',
                darkItemColor: 'rgba(255,255,255,0.65)',
                darkItemHoverColor: 'rgba(255,255,255,0.85)',
                darkItemHoverBg: 'rgba(255,255,255,0.08)',
              },
            },
          }}
        >
          <Menu
            theme="dark"
            mode="inline"
            selectedKeys={[location.pathname]}
            items={menuItems}
            onClick={({ key }) => navigate(key)}
          />
        </ConfigProvider>
      </Sider>
      <Layout>
        <Header
          style={{
            background: token.colorBgContainer,
            padding: '0 24px',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'space-between',
            borderBottom: `1px solid ${token.colorBorderSecondary}`,
          }}
        >
          <span style={{ color: token.colorTextSecondary }}>
            {user?.name ?? user?.email}
          </span>
          <div style={{ display: 'flex', alignItems: 'center', gap: 12 }}>
            <ThemeToggle />
            <Button
              type="text"
              icon={<HomeOutlined />}
              onClick={() => navigate('/')}
            >
              Editor
            </Button>
            <Button
              type="text"
              icon={<LogoutOutlined />}
              onClick={logout}
            >
              Sair
            </Button>
          </div>
        </Header>
        <Content style={{ margin: 24 }}>
          <div
            style={{
              padding: 24,
              background: token.colorBgContainer,
              borderRadius: token.borderRadiusLG,
              minHeight: 360,
            }}
          >
            <Outlet />
          </div>
        </Content>
      </Layout>
    </Layout>
  )
}
