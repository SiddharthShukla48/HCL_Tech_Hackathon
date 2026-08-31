
import { mockConversation } from "../data/mockChat";
import { mockRoadmapList, mockRoadmapDetail } from "../data/mockRoadmaps";
import { mockDashboard } from "../data/mockDashboard";

export const api = {
  getConversation: () => new Promise(res => setTimeout(() => res({ id: "conv_new", status: "idle", messages: [] }), 600)),
  
  getFollowUpQuestion: (step) => new Promise(res => {
    setTimeout(() => {
      if (step === 1) res({ role: "assistant", type: "question", content: "What's your current skill level — beginner, intermediate, or advanced?" });
      else res({ role: "assistant", type: "question", content: "Any specific tools or areas — SQL, Python, Excel?" });
    }, 1000);
  }),

  generateRoadmapSummary: () => new Promise(res => {
    setTimeout(() => {
      res({ 
        role: "assistant", 
        type: "roadmap_summary", 
        content: "I've analyzed your goals and current skill level. Here is a custom step-by-step roadmap tailored specifically for you to master these skills.", 
        roadmapId: "roadmap_001" 
      });
    }, 3000);
  }),

  getRoadmaps: () => new Promise(res => setTimeout(() => res(mockRoadmapList), 400)),
  getRoadmapDetail: (id) => new Promise(res => setTimeout(() => res(mockRoadmapDetail), 400)),
  getDashboard: () => new Promise(res => setTimeout(() => res(mockDashboard), 400)),
};