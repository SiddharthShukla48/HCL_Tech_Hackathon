const BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:8000';

async function request(path, options = {}) {
  const res = await fetch(`${BASE_URL}${path}`, {
    headers: { 'Content-Type': 'application/json', ...(options.headers || {}) },
    ...options,
  });

  if (!res.ok) {
    const text = await res.text();
    throw new Error(text || `Request failed: ${res.status}`);
  }

  return res.json();
}

export const api = {
  getRoadmaps: async () => request('/api/roadmaps'),

  getRoadmapDetail: async (id) => request(`/api/roadmaps/${id}`),

  saveProgress: async (roadmapId, progressState) => request(`/api/roadmaps/${roadmapId}/progress`, {
    method: 'PUT',
    body: JSON.stringify(progressState),
  }),

  getDashboard: async () => request('/api/dashboard'),

  getFollowUpQuestion: async (step, conversationId) => request('/api/chat/question', {
    method: 'POST',
    body: JSON.stringify({ step, conversationId }),
  }),

  generateRoadmapSummary: async (message, conversationId) => request('/api/chat/generate-roadmap', {
    method: 'POST',
    body: JSON.stringify({ message, conversationId }),
  }),
};