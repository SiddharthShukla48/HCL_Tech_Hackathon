import { motion } from 'framer-motion';
import { CheckCircle2, Clock, ChevronRight, BookOpen } from 'lucide-react';
import { Link } from 'react-router-dom';
import { useRoadmaps } from '../contexts/RoadmapContext';

export default function Roadmaps() {
  const { roadmaps, toggleRoadmapCompleted } = useRoadmaps();

  const ongoingRoadmaps = roadmaps.filter(r => !r.completed);
  const completedRoadmaps = roadmaps.filter(r => r.completed);

  const renderCard = (roadmap) => {
    const progress = roadmap.completed ? 100 : roadmap.progressPercent;
    return (
      <motion.div
        key={roadmap.id}
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className={`relative flex flex-col bg-base-100 border rounded-2xl p-6 transition-all duration-300 hover:shadow-lg ${
          roadmap.completed ? 'border-success/30 hover:border-success/50' : 'border-base-300 hover:border-primary/50'
        }`}
      >
        <div className="flex justify-between items-start mb-4">
          <div className="flex-1">
            <h3 className="text-xl font-bold font-sans text-base-content mb-2 line-clamp-1">
              {roadmap.title}
            </h3>
            <p className="text-sm text-base-content/70 font-sans line-clamp-2 min-h-[2.5rem]">
              {roadmap.shortDescription}
            </p>
          </div>
          <button
            onClick={() => toggleRoadmapCompleted(roadmap.id)}
            className="ml-4 shrink-0 focus:outline-none group"
            title={roadmap.completed ? 'Mark as in progress' : 'Mark as completed'}
          >
            <CheckCircle2 className={`w-6 h-6 transition-colors ${
              roadmap.completed ? 'text-success' : 'text-base-300 group-hover:text-success/50'
            }`} />
          </button>
        </div>

        <div className="flex flex-wrap gap-2 mb-6">
          {roadmap.skillTags.map(tag => (
            <span key={tag} className="px-2.5 py-1 rounded-full bg-base-200 text-base-content/70 text-xs font-medium font-sans">
              {tag}
            </span>
          ))}
        </div>

        <div className="mt-auto">
          <div className="flex items-center justify-between text-xs font-sans text-base-content/60 mb-2">
            <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {roadmap.durationWeeks} weeks</span>
            <span className={progress === 100 ? 'text-success font-bold' : ''}>{progress}%</span>
          </div>
          <div className="w-full h-2 bg-base-200 rounded-full overflow-hidden mb-6">
            <motion.div
              className={`h-full rounded-full transition-colors duration-500 ${roadmap.completed ? 'bg-success' : 'bg-primary'}`}
              initial={{ width: 0 }}
              animate={{ width: `${progress}%` }}
              transition={{ duration: 0.5, ease: 'easeOut' }}
            />
          </div>

          <Link
            to={`/roadmaps/${roadmap.id}`}
            className="w-full py-2.5 rounded-xl bg-base-200 hover:bg-primary hover:text-primary-content text-base-content font-medium font-sans text-sm flex items-center justify-center gap-2 transition-colors border border-base-300 hover:border-primary"
          >
            View Roadmap <ChevronRight className="w-4 h-4" />
          </Link>
        </div>
      </motion.div>
    );
  };

  return (
    <div className="p-8 max-w-7xl mx-auto w-full">
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-display font-bold text-secondary mb-2 flex items-center gap-3">
          My <span className="text-primary">Roadmaps</span>
        </h1>
        <p className="text-base-content/70 font-sans">
          Track your progress and access your personalized learning paths.
        </p>
      </motion.div>

      {/* Ongoing Section */}
      <div className="mb-12">
        <h2 className="text-2xl font-bold font-sans text-base-content mb-6 flex items-center gap-2">
          Ongoing Paths{' '}
          <span className="bg-primary/20 text-primary text-sm px-2 py-0.5 rounded-full">{ongoingRoadmaps.length}</span>
        </h2>
        {ongoingRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {ongoingRoadmaps.map(renderCard)}
          </div>
        ) : (
          <div className="p-8 text-center bg-base-200/50 border border-base-300 border-dashed rounded-2xl text-base-content/50 font-sans">
            No ongoing roadmaps. Time to start learning!
          </div>
        )}
      </div>

      {/* Completed Section */}
      <div>
        <h2 className="text-2xl font-bold font-sans text-base-content mb-6 flex items-center gap-2">
          Completed{' '}
          <span className="bg-success/20 text-success text-sm px-2 py-0.5 rounded-full">{completedRoadmaps.length}</span>
        </h2>
        {completedRoadmaps.length > 0 ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {completedRoadmaps.map(renderCard)}
          </div>
        ) : (
          <div className="p-8 text-center bg-base-200/50 border border-base-300 border-dashed rounded-2xl text-base-content/50 font-sans">
            Complete your first roadmap to see it here.
          </div>
        )}
      </div>
    </div>
  );
}