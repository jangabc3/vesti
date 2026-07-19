import { Outlet } from 'react-router-dom'
import BottomNavigation from '@/components/navigation/BottomNavigation'
import './AppLayout.css'

function AppLayout() {
  return (
    <div className="app-layout">
      <main className="app-layout__content">
        <Outlet />
      </main>
      <BottomNavigation />
    </div>
  )
}

export default AppLayout
