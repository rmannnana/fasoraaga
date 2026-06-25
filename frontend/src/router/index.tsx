import { createBrowserRouter } from 'react-router-dom'
import AppLayout from '../components/layout/AppLayout'
import PrivateRoute from './PrivateRoute'
import PublicRoute from './PublicRoute'

// Pages publiques
import HomePage from '../pages/public/HomePage'
import AuthPage from '../pages/public/AuthPage'
import SearchResultsPage from '../pages/public/SearchResultsPage'
import EnterpriseDetailPage from '../pages/public/EnterpriseDetailPage'
import ProductDetailPage from '../pages/public/ProductDetailPage'

// Pages privées
import ProfilePage from '../pages/private/ProfilePage'
import BusinessPage from '../pages/private/BusinessPage'
import ProductManagementPage from '../pages/private/ProductManagementPage'
import FavoritesPage from '../pages/private/FavoritesPage'
import ContactRequestsPage from '../pages/private/ContactRequestsPage'
import MessagesPage from '../pages/private/MessagesPage'
import NotificationsPage from '../pages/private/NotificationsPage'
import AdminDashboardPage from '../pages/private/AdminDashboardPage'

export const router = createBrowserRouter([
    {
        element: <AppLayout />,
        children: [
            // Routes publiques accessibles à tous
            { path: '/', element: <HomePage /> },
            { path: '/search', element: <SearchResultsPage /> },
            { path: '/enterprises/:id', element: <EnterpriseDetailPage /> },
            { path: '/products/:id', element: <ProductDetailPage /> },

            // Route publique uniquement (redirige si connecté)
            {
                element: <PublicRoute />,
                children: [
                    { path: '/auth', element: <AuthPage /> },
                ],
            },

            // Routes privées (redirige si non connecté)
            {
                element: <PrivateRoute />,
                children: [
                    { path: '/profile', element: <ProfilePage /> },
                    { path: '/business', element: <BusinessPage /> },
                    { path: '/business/products', element: <ProductManagementPage /> },
                    { path: '/favorites', element: <FavoritesPage /> },
                    { path: '/contacts', element: <ContactRequestsPage /> },
                    { path: '/messages', element: <MessagesPage /> },
                    { path: '/messages/:conversationId', element: <MessagesPage /> },
                    { path: '/notifications', element: <NotificationsPage /> },
                    { path: '/admin', element: <AdminDashboardPage /> },
                ],
            },
        ],
    },
])