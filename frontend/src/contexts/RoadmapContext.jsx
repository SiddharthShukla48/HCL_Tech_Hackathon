/**
 * RoadmapContext — single source of truth for all roadmap state.
 *
 * Persistence:
 *   User completion state (which steps/resources/roadmaps are checked) is saved to
 *   localStorage under the key "pathfinder_completion". This separates concerns:
 *   - Course content (titles, descriptions, steps) = comes from API
 *   - User progress (what they checked) = stored locally, ready to swap for a real API call
 *
 *   When backend is ready, replace the localStorage read/write with API calls to a
 *   POST /progress endpoint. No component changes needed — only this file changes.
 */
import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';

const RoadmapContext = createContext(null);
const STORAGE_KEY = 'pathfinder_completion';

// Helpers -------------------------------------------------------------------

function deriveProgress(steps, resources) {
  const total = steps.length + resources.length;
  if (total === 0) return 0;
  const done = steps.filter(s => s.completed).length + resources.filter(r => r.completed).length;
  return Math.round((done / total) * 100);
}

/** Load saved completion state from localStorage */
function loadSavedState() {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : {};
  } catch {
    return {};
  }
}

/** Persist completion state to localStorage */
function saveState(state) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable — silently ignore
  }
}

// Provider ------------------------------------------------------------------

export function RoadmapProvider({ children }) {
  // Summary list: [{ id, title, shortDescription, durationWeeks, skillTags, progressPercent, completed }]
  const [roadmaps, setRoadmaps] = useState([]);
  // Detailed data per roadmap: { [id]: { ...detail, steps: [{...step, completed}], resources: [...] } }
  const [detailedMap, setDetailedMap] = useState({});
  // Flat completion state (persisted to localStorage)
  // { [roadmapId]: { completed: bool, steps: { [stepId]: bool }, resources: { [resId]: bool } } }
  const [completionState, setCompletionState] = useState(loadSavedState);

  // ── Initial load: fetch roadmap list ──────────────────────────────────────
  useEffect(() => {
    api.getRoadmaps().then(list => {
      setRoadmaps(list.map(r => {
        const saved = completionState[r.id] || {};
        return {
          ...r,
          progressPercent: 0,             // will be updated once detail is loaded
          completed: saved.completed ?? false,
        };
      }));
    });
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // ── Persist completionState to localStorage on every change ───────────────
  useEffect(() => {
    saveState(completionState);
  }, [completionState]);

  // ── Sync progressPercent back into roadmap list when details change ────────
  useEffect(() => {
    setRoadmaps(prev =>
      prev.map(r => {
        const detail = detailedMap[r.id];
        if (!detail) return r;
        // Don't override progress if roadmap is manually marked as completed
        if (r.completed) return { ...r, progressPercent: 100 };
        return { ...r, progressPercent: deriveProgress(detail.steps, detail.resources) };
      })
    );
  }, [detailedMap]);

  // ── Load detail for a roadmap (with saved completion applied) ─────────────
  const loadDetail = useCallback(async (id) => {
    if (detailedMap[id]) return; // already loaded
    const detail = await api.getRoadmapDetail(id);
    const saved = completionState[id] || {};

    setDetailedMap(prev => ({
      ...prev,
      [id]: {
        ...detail,
        steps: detail.steps.map(s => ({
          ...s,
          completed: saved.steps?.[s.id] ?? false,
        })),
        resources: detail.resources.map(r => ({
          ...r,
          completed: saved.resources?.[r.id] ?? false,
        })),
      },
    }));
  }, [detailedMap, completionState]);

  // ── Toggle a step ─────────────────────────────────────────────────────────
  const toggleStep = useCallback((roadmapId, stepId) => {
    setDetailedMap(prev => {
      const detail = prev[roadmapId];
      if (!detail) return prev;
      const newSteps = detail.steps.map(s =>
        s.id === stepId ? { ...s, completed: !s.completed } : s
      );
      const updated = { ...prev, [roadmapId]: { ...detail, steps: newSteps } };

      // Persist
      setCompletionState(cs => {
        const entry = cs[roadmapId] || {};
        return {
          ...cs,
          [roadmapId]: {
            ...entry,
            steps: { ...entry.steps, [stepId]: newSteps.find(s => s.id === stepId).completed },
          },
        };
      });

      return updated;
    });
  }, []);

  // ── Toggle a resource ─────────────────────────────────────────────────────
  const toggleResource = useCallback((roadmapId, resId) => {
    setDetailedMap(prev => {
      const detail = prev[roadmapId];
      if (!detail) return prev;
      const newResources = detail.resources.map(r =>
        r.id === resId ? { ...r, completed: !r.completed } : r
      );
      const updated = { ...prev, [roadmapId]: { ...detail, resources: newResources } };

      setCompletionState(cs => {
        const entry = cs[roadmapId] || {};
        return {
          ...cs,
          [roadmapId]: {
            ...entry,
            resources: { ...entry.resources, [resId]: newResources.find(r => r.id === resId).completed },
          },
        };
      });

      return updated;
    });
  }, []);

  // ── Toggle whole roadmap completion (card checkbox) ───────────────────────
  const toggleRoadmapCompleted = useCallback((id) => {
    setRoadmaps(prev =>
      prev.map(r => {
        if (r.id !== id) return r;
        const nowCompleted = !r.completed;

        if (nowCompleted) {
          // Marking complete → set to 100%
          setCompletionState(cs => ({
            ...cs,
            [id]: { ...(cs[id] || {}), completed: true },
          }));
          return { ...r, completed: true, progressPercent: 100 };
        } else {
          // Unmarking → revert to actual computed progress from steps/resources
          const detail = detailedMap[id];
          const actualProgress = detail
            ? deriveProgress(detail.steps, detail.resources)
            : 0;
          setCompletionState(cs => ({
            ...cs,
            [id]: { ...(cs[id] || {}), completed: false },
          }));
          return { ...r, completed: false, progressPercent: actualProgress };
        }
      })
    );
  }, [detailedMap]);

  // ── Derived stats (live, for Dashboard) ───────────────────────────────────
  const stats = useMemo(() => {
    const total = roadmaps.length;
    const completed = roadmaps.filter(r => r.completed).length;
    const overall = total > 0
      ? Math.round(roadmaps.reduce((acc, r) => acc + (r.completed ? 100 : r.progressPercent), 0) / total)
      : 0;
    return { totalRoadmaps: total, roadmapsCompleted: completed, overallProgressPercent: overall };
  }, [roadmaps]);

  return (
    <RoadmapContext.Provider
      value={{ roadmaps, detailedMap, loadDetail, toggleStep, toggleResource, toggleRoadmapCompleted, stats }}
    >
      {children}
    </RoadmapContext.Provider>
  );
}

export function useRoadmaps() {
  const ctx = useContext(RoadmapContext);
  if (!ctx) throw new Error('useRoadmaps must be used within RoadmapProvider');
  return ctx;
}
