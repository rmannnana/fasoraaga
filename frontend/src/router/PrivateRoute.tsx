import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'

export default function PrivateRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    return isAuthenticated ? <Outlet /> : <Navigate to="/auth" replace />
}