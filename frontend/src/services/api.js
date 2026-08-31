/**
 * api.js — the ONLY file that talks to the backend.
 *
 * Current state: all functions return mock data with a simulated delay.
 *
 * ── How to integrate the backend ────────────────────────────────────────────
 *
 * 1. Set your backend base URL in .env:
 *      VITE_API_BASE_URL=http://localhost:8000   (Python FastAPI)
 *
 * 2. For each function below, replace the mock `setTimeout` block with the
 *    commented `fetch` call that follows it.
 *
 * 3. No other file in the project needs to change — components and contexts
 *    all consume this api object, so they automatically get live data.
 */

const BASE_URL = import.meta.env.VITE_API_BASE_URL || '';

// ── Mock data (remove when backend is ready) ──────────────────────────────────
import { mockRoadmapList, mockRoadmapDetail } from '../data/mockRoadmaps';
import { mockDashboard } from '../data/mockDashboard';

const delay = (ms) => new Promise(r => setTimeout(r, ms));

// ── API methods ───────────────────────────────────────────────────────────────

export const api = {

  // ── Roadmaps ─────────────────────────────────────────────────────────────

  /**
   * Returns the list of roadmaps for the current user.
   * Backend: GET /api/roadmaps
   * Response shape: Array<{ id, title, shortDescription, durationWeeks, skillTags, progressPercent, completed }>
   */
  getRoadmaps: async () => {
    await delay(400);
    return mockRoadmapList;
    // ── Replace above with: ──
    // const res = await fetch(`${BASE_URL}/api/roadmaps`);
    // return res.json();
  },

  /**
   * Returns detailed data for one roadmap.
   * Backend: GET /api/roadmaps/:id
   * Response shape: { id, title, description, durationWeeks, skillTags, prerequisites,
   *                   milestonesOverview, steps: [...], resources: [...] }
   */
  getRoadmapDetail: async (id) => {
    await delay(400);
    return mockRoadmapDetail;
    // ── Replace above with: ──
    // const res = await fetch(`${BASE_URL}/api/roadmaps/${id}`);
    // return res.json();
  },

  /**
   * Saves user's completion progress for a roadmap.
   * Backend: PUT /api/roadmaps/:id/progress
   * Body: { steps: { [stepId]: boolean }, resources: { [resId]: boolean }, completed: boolean }
   *
   * Currently handled entirely in frontend (localStorage via RoadmapContext).
   * When backend is ready: call this from RoadmapContext.saveState() instead of localStorage.
   */
  saveProgress: async (roadmapId, progressState) => {
    // ── MOCK: no-op (RoadmapContext writes to localStorage) ──
    return { ok: true };
    // ── Replace above with: ──
    // const res = await fetch(`${BASE_URL}/api/roadmaps/${roadmapId}/progress`, {
    //   method: 'PUT',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify(progressState),
    // });
    // return res.json();
  },

  // ── Dashboard ─────────────────────────────────────────────────────────────

  /**
   * Returns dashboard analytics for the current user.
   * Backend: GET /api/dashboard
   * Response shape: { weeklyActivity: [...], skillDistribution: [...], nextActions: [...] }
   * NOTE: overallProgressPercent / roadmapsCompleted are derived in RoadmapContext from live state.
   */
  getDashboard: async () => {
    await delay(400);
    return mockDashboard;
    // ── Replace above with: ──
    // const res = await fetch(`${BASE_URL}/api/dashboard`);
    // return res.json();
  },

  // ── Chat / AI ─────────────────────────────────────────────────────────────

  /**
   * Returns a clarifying question from the AI assistant (step 1 or 2).
   * Backend: POST /api/chat/question
   * Body: { step: number, conversationId: string }
   * Response shape: { role: 'assistant', type: 'question', content: string }
   */
  getFollowUpQuestion: async (step) => {
    await delay(1000);
    if (step === 1)
      return { role: 'assistant', type: 'question', content: "What's your current skill level — beginner, intermediate, or advanced?" };
    return { role: 'assistant', type: 'question', content: 'Any specific tools or areas you would like to focus on?' };
    // ── Replace above with: ──
    // const res = await fetch(`${BASE_URL}/api/chat/question`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ step, conversationId }),
    // });
    // return res.json();
  },

  /**
   * Generates a personalised roadmap from the conversation.
   * Backend: POST /api/chat/generate-roadmap
   * Body: { conversationId: string }
   * Response shape: { role: 'assistant', type: 'roadmap_summary', content: string, roadmapId: string }
   *
   * The backend calls the Neo4j knowledge graph + Python LLM here.
   */
  generateRoadmapSummary: async (conversationId) => {
    await delay(3000); // simulates LLM generation time
    return {
      role: 'assistant',
      type: 'roadmap_summary',
      content: "I've analysed your goals and current skill level. Here is a custom step-by-step roadmap tailored specifically for you.",
      roadmapId: 'roadmap_001',
    };
    // ── Replace above with: ──
    // const res = await fetch(`${BASE_URL}/api/chat/generate-roadmap`, {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ conversationId }),
    // });
    // return res.json();
  },

};