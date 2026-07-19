import { Navigate, Route, Routes } from 'react-router-dom'
import AppLayout from '@/layouts/AppLayout'
import ClothesCreatePage from '@/pages/clothes/ClothesCreatePage'
import ClothesEditPage from '@/pages/clothes/ClothesEditPage'
import ClosetPage from '@/pages/closet/ClosetPage'
import HistoryPage from '@/pages/history/HistoryPage'
import MyPage from '@/pages/my/MyPage'
import OutfitCreatePage from '@/pages/outfits/OutfitCreatePage'
import OutfitPage from '@/pages/outfits/OutfitPage'
import TodayPage from '@/pages/today/TodayPage'

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/today" replace />} />
      <Route element={<AppLayout />}>
        <Route path="/today" element={<TodayPage />} />
        <Route path="/closet" element={<ClosetPage />} />
        <Route path="/clothes/new" element={<ClothesCreatePage />} />
        <Route path="/clothes/:clothesId/edit" element={<ClothesEditPage />} />
        <Route path="/outfits" element={<OutfitPage />} />
        <Route path="/outfits/new" element={<OutfitCreatePage />} />
        <Route path="/history" element={<HistoryPage />} />
        <Route path="/my" element={<MyPage />} />
      </Route>
    </Routes>
  )
}

export default AppRouter
