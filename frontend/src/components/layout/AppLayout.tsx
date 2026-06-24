import { Outlet } from 'react-router-dom'
import Sidebar from './Sidebar'
import BottomNav from './BottomNav'

export default function AppLayout() {
    return (
        <div className="min-h-screen bg-gray-50">
            {/* Sidebar desktop */}
            <Sidebar />

            {/* Zone de contenu — décalée à droite sur desktop */}
            <main className="md:ml-60 pb-20 md:pb-0 min-h-screen">
                <Outlet />
            </main>

            {/* Bottom nav mobile */}
            <BottomNav />
        </div>
    )
}