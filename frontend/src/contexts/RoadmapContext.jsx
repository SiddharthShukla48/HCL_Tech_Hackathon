import { createContext, useContext, useState, useEffect, useMemo, useCallback } from 'react';
import { api } from '../services/api';

const RoadmapContext = createContext(null);

// Helpers -------------------------------------------------------------------

function deriveProgress(steps, resources) {
  const total = steps.length + resources.length;
  if (total === 0) return 0;
  const done = steps.filter(s => s.completed).length + resources.filter(r => r.completed).length;
  return Math.round((done / total) * 100);
}

// Provider ------------------------------------------------------------------

export function RoadmapProvider({ children }) {
  // Summary list: [{ id, title, shortDescription, durationWeeks, skillTags, progressPercent, completed }]
  const [roadmaps, setRoadmaps] = useState([]);
  // Detailed data per roadmap: { [id]: { ...detail, steps: [{...step, completed}], resources: [...] } }
  const [detailedMap, setDetailedMap] = useState({});
  // Flat completion state is kept in memory only, never persisted to localStorage.
  const [completionState, setCompletionState] = useState({});

  // ── Add a generated roadmap from chat ──────────────────────────────────────
  const addGeneratedRoadmap = useCallback((roadmapSummary) => {
    setRoadmaps(prev => {
      // Check if already exists
      const exists = prev.some(r => r.id === roadmapSummary.id);
      if (exists) return prev;
      return [
        ...prev,
        {
          ...roadmapSummary,
          progressPercent: 0,
          completed: false,
        },
      ];
    });
  }, []);

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
      value={{ roadmaps, detailedMap, loadDetail, toggleStep, toggleResource, toggleRoadmapCompleted, addGeneratedRoadmap, stats }}
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
