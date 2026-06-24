import { Navigate, Outlet } from 'react-router-dom'
import { useAuthStore } from '../features/auth/store/authStore'

// Redirige vers l'accueil si déjà connecté (ex: page /auth)
export default function PublicRoute() {
    const isAuthenticated = useAuthStore((s) => s.isAuthenticated)
    return isAuthenticated ? <Navigate to="/" replace /> : <Outlet />
}