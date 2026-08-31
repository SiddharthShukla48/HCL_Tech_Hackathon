import { BrowserRouter, Routes, Route } from "react-router-dom";
import { useEffect } from "react";
import HomeLayout from "./layouts/HomeLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/Landing";
import ChatPage from "./pages/Chat";
import RoadmapsPage from "./pages/Roadmaps";
import RoadmapDetailPage from "./pages/RoadmapDetails";
import DashboardPage from "./pages/Dashboard";
import { RoadmapProvider } from "./contexts/RoadmapContext";

const STORAGE_KEYS = [
  'pathfinder_chat_messages',
  'pathfinder_chat_qc',
  'pathfinder_completion',
];

function clearLegacyStorage() {
  STORAGE_KEYS.forEach((key) => localStorage.removeItem(key));
}

function App() {
  useEffect(() => {
    clearLegacyStorage();
  }, []);

  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route element={
          <RoadmapProvider>
            <AppLayout />
          </RoadmapProvider>
        }>
          <Route path="/chat" element={<ChatPage />} />
          <Route path="/roadmaps" element={<RoadmapsPage />} />
          <Route path="/roadmaps/:id" element={<RoadmapDetailPage />} />
          <Route path="/dashboard" element={<DashboardPage />} />
        </Route>
      </Routes>
    </BrowserRouter>
  );
}

export default App;