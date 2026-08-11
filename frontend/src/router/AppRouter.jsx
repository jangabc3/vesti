import { Navigate, Route, Routes } from "react-router-dom";

import AppLayout from "@/layouts/AppLayout";

import AiPage from "@/pages/ai/AiPage";

import ClosetPage from "@/pages/closet/ClosetPage";

import ClothesCreatePage from "@/pages/clothes/ClothesCreatePage";
import ClothesDetailPage from "@/pages/clothes/ClothesDetailPage";
import ClothesEditPage from "@/pages/clothes/ClothesEditPage";

import DiscoverPage from "@/pages/discover/DiscoverPage";

import HistoryCreatePage from "@/pages/history/HistoryCreatePage";
import HistoryPage from "@/pages/history/HistoryPage";

import MyPage from "@/pages/my/MyPage";

import OutfitCreatePage from "@/pages/outfits/OutfitCreatePage";
import OutfitDetailPage from "@/pages/outfits/OutfitDetailPage";
import OutfitEditPage from "@/pages/outfits/OutfitEditPage";
import OutfitPage from "@/pages/outfits/OutfitPage";

import StylePostCreatePage from "@/pages/posts/StylePostCreatePage";

import PublicProfilePage from "@/pages/community/PublicProfilePage";

import StyleMatchPage from "@/pages/styles/StyleMatchPage";
import StylePostDetailPage from "@/pages/styles/StylePostDetailPage";

import TodayPage from "@/pages/today/TodayPage";

function AppRouter() {
  return (
    <Routes>
      <Route path="/" element={<Navigate to="/today" replace />} />

      <Route element={<AppLayout />}>
        {/* Main Navigation */}

        <Route path="/today" element={<TodayPage />} />

        <Route path="/discover" element={<DiscoverPage />} />

        <Route path="/ai" element={<AiPage />} />

        <Route path="/closet" element={<ClosetPage />} />

        <Route path="/my" element={<MyPage />} />

        {/* Community User */}

        <Route path="/users/:username" element={<PublicProfilePage />} />

        {/* Community Style */}

        <Route path="/styles/:styleId" element={<StylePostDetailPage />} />

        <Route path="/styles/:styleId/match" element={<StyleMatchPage />} />

        {/* Community Create / Edit */}

        <Route path="/posts/new" element={<StylePostCreatePage />} />

        <Route path="/posts/:styleId/edit" element={<StylePostCreatePage />} />

        {/* Clothing */}

        <Route path="/clothes/new" element={<ClothesCreatePage />} />

        <Route path="/clothes/:clothesId/edit" element={<ClothesEditPage />} />

        <Route path="/clothes/:clothesId" element={<ClothesDetailPage />} />

        {/* Outfit */}

        <Route path="/outfits" element={<OutfitPage />} />

        <Route path="/outfits/new" element={<OutfitCreatePage />} />

        <Route path="/outfits/:outfitId/edit" element={<OutfitEditPage />} />

        <Route path="/outfits/:outfitId" element={<OutfitDetailPage />} />

        {/* Wearing History */}

        <Route path="/history" element={<HistoryPage />} />

        <Route path="/history/new" element={<HistoryCreatePage />} />
      </Route>
    </Routes>
  );
}

export default AppRouter;
