export const mockConversation = {
  id: "conv_001",
  status: "idle", // "idle" | "thinking"
  messages: [
    { id: "m1", role: "user", content: "I want to learn data analysis" },
    { id: "m2", role: "assistant", type: "question", content: "What's your current skill level — beginner, intermediate, or advanced?" },
    { id: "m3", role: "user", content: "Beginner" },
    { id: "m4", role: "assistant", type: "question", content: "Any specific tools or areas — SQL, Python, Excel?" },
    { id: "m5", role: "user", content: "SQL and Python" },
    { id: "m6", role: "assistant", type: "roadmap_summary", content: "Okay, so this is the roadmap I'd suggest...", roadmapId: "roadmap_001" }
  ]
};