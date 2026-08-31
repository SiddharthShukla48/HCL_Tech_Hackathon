import { useEffect, useMemo } from 'react';
import { useParams, Link, useSearchParams } from 'react-router-dom';
import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { useRoadmaps } from '../contexts/RoadmapContext';
import { 
  ArrowLeft, Clock, CheckCircle2, Circle, ChevronDown, 
  BookOpen, Video, FileText, Code, ExternalLink, Target
} from 'lucide-react';

const getResourceIcon = (type) => {
  switch(type) {
    case 'course': return <Video className="w-4 h-4" />;
    case 'book': return <BookOpen className="w-4 h-4" />;
    case 'article': return <FileText className="w-4 h-4" />;
    case 'project': return <Code className="w-4 h-4" />;
    default: return <BookOpen className="w-4 h-4" />;
  }
};

const getResourceColor = (type) => {
  switch(type) {
    case 'course': return 'bg-primary/20 text-primary';
    case 'book': return 'bg-secondary/20 text-secondary';
    case 'article': return 'bg-accent/20 text-accent';
    case 'project': return 'bg-success/20 text-success';
    default: return 'bg-base-300 text-base-content';
  }
};

export default function RoadmapDetails() {
  const { id } = useParams();
  const [searchParams] = useSearchParams();
  const { detailedMap, loadDetail, toggleStep, toggleResource } = useRoadmaps();

  const [activeTab, setActiveTab] = useState(searchParams.get('tab') || 'overview');
  const [openStepId, setOpenStepId] = useState(null);

  useEffect(() => {
    loadDetail(id);
  }, [id]);

  const data = detailedMap[id];

  useEffect(() => {
    if (data?.steps?.length > 0 && !openStepId) {
      setOpenStepId(data.steps[0].id);
    }
  }, [data]);

  // Derive progress from current completion state
  const progressPercent = useMemo(() => {
    if (!data) return 0;
    const total = data.steps.length + data.resources.length;
    if (total === 0) return 0;
    const done = data.steps.filter(s => s.completed).length + data.resources.filter(r => r.completed).length;
    return Math.round((done / total) * 100);
  }, [data]);

  if (!data) {
    return (
      <div className="h-full flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-primary border-t-transparent rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      {/* Header */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <Link to="/roadmaps" className="inline-flex items-center gap-2 text-sm text-base-content/50 hover:text-primary transition-colors font-sans mb-6">
          <ArrowLeft className="w-4 h-4" /> Back to roadmaps
        </Link>
        <h1 className="text-4xl font-display font-bold text-base-content mb-4">{data.title}</h1>

        {/* Meta */}
        <div className="flex flex-wrap items-center gap-4 text-sm font-sans mb-6">
          <span className="flex items-center gap-1.5 text-base-content/70">
            <Clock className="w-4 h-4" /> {data.durationWeeks} Weeks
          </span>
          <div className="h-4 w-px bg-base-300" />
          <div className="flex items-center gap-2">
            {data.skillTags.map(tag => (
              <span key={tag} className="px-2 py-0.5 rounded bg-primary/10 text-primary text-xs font-bold uppercase tracking-wider">
                {tag}
              </span>
            ))}
          </div>
        </div>

        {/* Live progress bar — updates instantly as checkboxes are ticked */}
        <div className="flex items-center gap-4">
          <div className="flex-1 h-2.5 bg-base-300 rounded-full overflow-hidden">
            <motion.div
              className={`h-full rounded-full ${progressPercent === 100 ? 'bg-success' : 'bg-primary'}`}
              animate={{ width: `${progressPercent}%` }}
              transition={{ duration: 0.4, ease: 'easeOut' }}
            />
          </div>
          <span className={`text-sm font-bold font-sans shrink-0 tabular-nums ${progressPercent === 100 ? 'text-success' : 'text-base-content/70'}`}>
            {progressPercent}%
          </span>
        </div>
      </motion.div>

      {/* Tabs */}
      <div className="flex items-center gap-6 border-b border-base-300 mb-8">
        {['overview', 'steps', 'resources'].map(tab => (
          <button
            key={tab}
            onClick={() => setActiveTab(tab)}
            className={`pb-4 px-2 font-sans font-medium text-sm capitalize transition-colors relative whitespace-nowrap ${
              activeTab === tab ? 'text-primary' : 'text-base-content/60 hover:text-base-content'
            }`}
          >
            {tab}
            {activeTab === tab && (
              <motion.div layoutId="tabIndicator" className="absolute bottom-0 left-0 right-0 h-0.5 bg-primary rounded-t-full" />
            )}
          </button>
        ))}
      </div>

      <AnimatePresence mode="wait">
        <motion.div
          key={activeTab}
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          exit={{ opacity: 0, y: -8 }}
          transition={{ duration: 0.18 }}
        >
          {/* OVERVIEW */}
          {activeTab === 'overview' && (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
              <div className="md:col-span-2 space-y-8">
                <section>
                  <h3 className="text-xl font-bold font-sans text-base-content mb-3">About this path</h3>
                  <p className="text-base-content/70 font-sans leading-relaxed">{data.description}</p>
                </section>
                <section>
                  <h3 className="text-xl font-bold font-sans text-base-content mb-4">Milestones</h3>
                  <ul className="space-y-4">
                    {data.milestonesOverview.map((ms, i) => (
                      <li key={i} className="flex items-start gap-3 text-base-content/80 font-sans">
                        <Target className="w-5 h-5 text-secondary shrink-0 mt-0.5" />
                        <span>{ms}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
              <div>
                <section className="p-6 rounded-2xl bg-base-200 border border-base-300">
                  <h3 className="text-lg font-bold font-sans text-base-content mb-4">Prerequisites</h3>
                  <ul className="space-y-3">
                    {data.prerequisites.map((prq, i) => (
                      <li key={i} className="flex items-start gap-2 text-sm text-base-content/70 font-sans">
                        <div className="w-1.5 h-1.5 rounded-full bg-base-content/30 shrink-0 mt-1.5" />
                        <span>{prq}</span>
                      </li>
                    ))}
                  </ul>
                </section>
              </div>
            </div>
          )}

          {/* STEPS */}
          {activeTab === 'steps' && (
            <div className="max-w-4xl space-y-4">
              {data.steps.map((step, index) => {
                const isOpen = openStepId === step.id;
                return (
                  <div key={step.id} className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/40 bg-base-200/50 shadow-md' : 'border-base-300 bg-base-100 hover:border-base-content/20'}`}>
                    <button
                      onClick={() => setOpenStepId(isOpen ? null : step.id)}
                      className="w-full p-6 flex items-center justify-between text-left focus:outline-none"
                    >
                      <div className="flex items-center gap-6">
                        <button
                          onClick={e => { e.stopPropagation(); toggleStep(id, step.id); }}
                          className="shrink-0 text-base-content/30 hover:text-success transition-colors focus:outline-none"
                        >
                          {step.completed ? <CheckCircle2 className="w-7 h-7 text-success" /> : <Circle className="w-7 h-7" />}
                        </button>
                        <div>
                          <div className="text-sm font-bold text-primary mb-1 font-sans">Step {index + 1}</div>
                          <h3 className={`text-xl font-bold font-sans transition-colors ${step.completed ? 'text-base-content/50 line-through' : 'text-base-content'}`}>
                            {step.title}
                          </h3>
                        </div>
                      </div>
                      <ChevronDown className={`w-5 h-5 text-base-content/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`} />
                    </button>
                    <AnimatePresence>
                      {isOpen && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: 'auto', opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          className="px-6 pb-6 pt-0 ml-[4.5rem]"
                        >
                          <p className="text-base-content/70 font-sans mb-6">{step.description}</p>
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3 font-sans">Topics Covered</h4>
                              <ul className="space-y-2">
                                {step.subtopics.map((t, i) => (
                                  <li key={i} className="flex items-center gap-2 text-sm text-base-content/80 font-sans">
                                    <div className="w-1 h-1 rounded-full bg-primary" /> {t}
                                  </li>
                                ))}
                              </ul>
                            </div>
                            <div>
                              <h4 className="text-xs font-bold uppercase tracking-wider text-base-content/50 mb-3 font-sans">Skills Gained</h4>
                              <div className="flex flex-wrap gap-2">
                                {step.skillsGained.map((s, i) => (
                                  <span key={i} className="px-2.5 py-1 rounded-md bg-secondary/10 text-secondary text-xs font-medium border border-secondary/20 font-sans">
                                    {s}
                                  </span>
                                ))}
                              </div>
                            </div>
                          </div>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </div>
                );
              })}
            </div>
          )}

          {/* RESOURCES */}
          {activeTab === 'resources' && (
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {data.resources.map(res => (
                <div key={res.id} className={`flex flex-col p-6 rounded-2xl border transition-all duration-300 ${res.completed ? 'border-success/30 bg-success/5 opacity-80' : 'border-base-300 bg-base-100 hover:border-base-content/30 hover:shadow-md'}`}>
                  <div className="flex justify-between items-start mb-4">
                    <span className={`flex items-center gap-1.5 px-2.5 py-1 rounded-full text-xs font-bold uppercase tracking-wider ${getResourceColor(res.type)}`}>
                      {getResourceIcon(res.type)} {res.type}
                    </span>
                    <button
                      onClick={e => { e.preventDefault(); toggleResource(id, res.id); }}
                      className="shrink-0 text-base-content/30 hover:text-success transition-colors"
                    >
                      {res.completed ? <CheckCircle2 className="w-6 h-6 text-success" /> : <Circle className="w-6 h-6" />}
                    </button>
                  </div>
                  <h3 className={`text-lg font-bold font-sans mb-2 ${res.completed ? 'text-base-content/60' : 'text-base-content'}`}>{res.title}</h3>
                  <p className="text-sm text-base-content/60 font-sans mb-6 line-clamp-3">{res.description}</p>
                  <a href={res.link} target="_blank" rel="noopener noreferrer" className="mt-auto inline-flex items-center gap-2 text-sm font-bold text-primary hover:text-primary/80 transition-colors">
                    View Resource <ExternalLink className="w-4 h-4" />
                  </a>
                </div>
              ))}
            </div>
          )}
        </motion.div>
      </AnimatePresence>
    </div>
  );
}