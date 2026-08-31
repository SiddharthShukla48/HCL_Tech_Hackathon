
import { mockConversation } from "../data/mockChat";
import { mockRoadmapList, mockRoadmapDetail } from "../data/mockRoadmaps";
import { mockDashboard } from "../data/mockDashboard";

export const api = {
  getConversation: () => new Promise(res => setTimeout(() => res(mockConversation), 600)),
  getRoadmaps: () => new Promise(res => setTimeout(() => res(mockRoadmapList), 400)),
  getRoadmapDetail: (id) => new Promise(res => setTimeout(() => res(mockRoadmapDetail), 400)),
  getDashboard: () => new Promise(res => setTimeout(() => res(mockDashboard), 400)),
};