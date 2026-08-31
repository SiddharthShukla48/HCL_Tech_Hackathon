import { BrowserRouter, Routes, Route } from "react-router-dom";
import HomeLayout from "./layouts/HomeLayout";
import AppLayout from "./layouts/AppLayout";
import LandingPage from "./pages/Landing";
import ChatPage from "./pages/Chat";
import RoadmapsPage from "./pages/Roadmaps";
import RoadmapDetailPage from "./pages/RoadmapDetails";
import DashboardPage from "./pages/Dashboard";

function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route element={<HomeLayout />}>
          <Route path="/" element={<LandingPage />} />
        </Route>
        <Route element={<AppLayout />}>
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