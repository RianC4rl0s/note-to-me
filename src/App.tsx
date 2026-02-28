import { Routes, Route, Navigate } from 'react-router-dom'
import { LoginPage } from './pages/LoginPage'
import { RegisterPage } from './pages/RegisterPage'
import { EditorPage } from './pages/EditorPage'
import { ProtectedRoute } from './components/ProtectedRoute'
import { AdminRoute } from './admin/AdminRoute'
import { AdminLayout } from './admin/AdminLayout'
import { UsersPage } from './admin/pages/UsersPage'
import { RolesPage } from './admin/pages/RolesPage'
import { PermissionsPage } from './admin/pages/PermissionsPage'

function App() {
  return (
    <Routes>
      <Route path="/login" element={<LoginPage />} />
      <Route path="/register" element={<RegisterPage />} />
      <Route element={<ProtectedRoute />}>
        <Route path="/" element={<EditorPage />} />
      </Route>
      <Route element={<AdminRoute />}>
        <Route element={<AdminLayout />}>
          <Route path="/admin/users" element={<UsersPage />} />
          <Route path="/admin/roles" element={<RolesPage />} />
          <Route path="/admin/permissions" element={<PermissionsPage />} />
        </Route>
      </Route>
      <Route path="*" element={<Navigate to="/" replace />} />
    </Routes>
  )
}

export default App
