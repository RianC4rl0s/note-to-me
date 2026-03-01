import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './admin/AdminRoute'
import { AdminLayout } from './admin/AdminLayout'
import { UsersPage } from './admin/pages/UsersPage'
import { RolesPage } from './admin/pages/RolesPage'
import { PermissionsPage } from './admin/pages/PermissionsPage'
import { PlansPage } from './admin/pages/PlansPage'
import { WorkspaceLayout } from './projects/components/WorkspaceLayout'
import { PageEditor } from './projects/components/PageEditor'
import { SettingsPage } from './pages/SettingsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route element={<WorkspaceLayout />}>
          <Route path="/" element={null} />
          <Route path="/settings" element={<SettingsPage />} />
          <Route path="/projects/:projectId/pages/:pageId" element={<PageEditor />} />
        </Route>
      </Route>
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/permissions" element={<PermissionsPage />} />
          <Route path="/admin/plans" element={<PlansPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
