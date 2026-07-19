import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import ClosetPage from '@/pages/closet/ClosetPage'
import HistoryPage from '@/pages/history/HistoryPage'
import MyPage from '@/pages/my/MyPage'
import OutfitPage from '@/pages/outfits/OutfitPage'
import TodayPage from '@/pages/today/TodayPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route
        path="/today"
        element={
          <AppLayout>
            <TodayPage />
          </AppLayout>
        }
      />
      <Route
        path="/closet"
        element={
          <AppLayout>
            <ClosetPage />
          </AppLayout>
        }
      />
      <Route
        path="/outfits"
        element={
          <AppLayout>
            <OutfitPage />
          </AppLayout>
        }
      />
      <Route
        path="/history"
        element={
          <AppLayout>
            <HistoryPage />
          </AppLayout>
        }
      />
      <Route
        path="/my"
        element={
          <AppLayout>
            <MyPage />
          </AppLayout>
        }
      />
    </Routes>
  )
}

export default AppRouter
