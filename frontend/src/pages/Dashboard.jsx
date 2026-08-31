import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { 
  AreaChart, Area, XAxis, YAxis, Tooltip, ResponsiveContainer, CartesianGrid,
  PieChart, Pie, Cell, Legend
} from 'recharts';
import { Target, Trophy, Clock, Zap } from 'lucide-react';
import { Link } from 'react-router-dom';
import { api } from '../services/api';
import { useRoadmaps } from '../contexts/RoadmapContext';

const AUTH_USER = { id: 'user_001', name: 'Siddharth Shukla' };

// Custom tooltip — avoids CSS variable parsing issues inside recharts inline styles
const CustomTooltip = ({ active, payload, label }) => {
  if (!active || !payload?.length) return null;
  return (
    <div className="bg-base-100 border border-base-300 rounded-xl px-4 py-2.5 shadow-lg text-sm font-sans pointer-events-none">
      {label && <p className="text-base-content/60 mb-1">{label}</p>}
      {payload.map((p, i) => (
        <p key={i} style={{ color: p.color || p.stroke || '#65c3c8' }} className="font-bold">
          {typeof p.value === 'number' ? p.value : p.value}
          {p.name === 'hoursSpent' ? 'h' : ''}
        </p>
      ))}
    </div>
  );
};

const PIE_COLORS = ['#65c3c8', '#818cf8', '#eeaf3a', '#22c55e', '#f87171'];

export default function Dashboard() {
  const { stats } = useRoadmaps(); // live stats from context
  const [activityData, setActivityData] = useState(null);

  useEffect(() => {
    // Fetch only the parts that come from the backend (activity, skills, next actions)
    api.getDashboard().then(res => setActivityData(res));
  }, []);

  const firstName = AUTH_USER.name.split(' ')[0] ?? '';

  // Use context-derived stats (live), fall back to 0 while loading
  const { overallProgressPercent, roadmapsCompleted, totalRoadmaps } = stats;
  const totalHours = activityData?.weeklyActivity?.reduce((acc, c) => acc + c.hoursSpent, 0) ?? 0;
  const pieData = activityData?.skillDistribution?.map(d => ({ name: d.skill, value: d.level })) ?? [];
  const weeklyData = activityData?.weeklyActivity ?? [];
  const nextActions = activityData?.nextActions ?? [];

  return (
    <div className="p-8 max-w-7xl mx-auto w-full overflow-auto">
      {/* Greeting */}
      <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} className="mb-8">
        <h1 className="text-4xl font-display font-bold text-primary mb-2">
          Welcome back, <span className="text-secondary">{firstName}</span>
        </h1>
        <p className="text-base-content/60 font-sans">
          Here's a snapshot of your learning journey.
        </p>
      </motion.div>

      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-5 mb-8">
        {[
          { icon: Target, color: 'primary', label: 'Overall Progress', value: `${overallProgressPercent}%`, delay: 0.1 },
          { icon: Trophy, color: 'secondary', label: 'Roadmaps Completed', value: `${roadmapsCompleted} / ${totalRoadmaps}`, delay: 0.2 },
          { icon: Clock, color: 'accent', label: 'Total Hours Spent', value: `${totalHours}h`, delay: 0.3 },
        ].map(({ icon: Icon, color, label, value, delay }) => (
          <motion.div
            key={label}
            initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay }}
            className="bg-base-200 rounded-2xl p-6 flex items-center gap-4"
          >
            <div className={`w-12 h-12 rounded-xl bg-${color}/20 flex items-center justify-center text-${color} shrink-0`}>
              <Icon className="w-6 h-6" />
            </div>
            <div>
              <div className="text-3xl font-bold font-sans text-base-content">{value}</div>
              <div className="text-sm text-base-content/60 font-sans">{label}</div>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Charts row */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6 mb-6">

        {/* Weekly Activity — Area Chart */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.4 }}
          className="lg:col-span-2 bg-base-200 rounded-2xl p-6 flex flex-col"
        >
          <h3 className="text-lg font-bold font-sans mb-6 text-base-content">Weekly Activity</h3>
          <div className="flex-1 min-h-[260px]">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={weeklyData} margin={{ top: 10, right: 10, left: -15, bottom: 0 }}>
                <defs>
                  <linearGradient id="areaGrad" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#65c3c8" stopOpacity={0.35} />
                    <stop offset="95%" stopColor="#65c3c8" stopOpacity={0} />
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" stroke="rgba(128,128,128,0.12)" vertical={false} />
                <XAxis dataKey="week" stroke="rgba(128,128,128,0.5)" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="rgba(128,128,128,0.5)" fontSize={12} tickLine={false} axisLine={false} tickFormatter={v => `${v}h`} />
                <Tooltip content={<CustomTooltip />} />
                <Area
                  type="monotone"
                  dataKey="hoursSpent"
                  stroke="#65c3c8"
                  strokeWidth={2.5}
                  fill="url(#areaGrad)"
                  dot={{ fill: '#65c3c8', strokeWidth: 2, r: 5, stroke: '#fff' }}
                  activeDot={{ r: 7, strokeWidth: 0, fill: '#65c3c8' }}
                />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </motion.div>

        {/* Next Recommended Actions */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} transition={{ delay: 0.5 }}
          className="bg-gradient-to-br from-primary/10 via-base-200 to-secondary/10 rounded-2xl p-6 flex flex-col border border-primary/10"
        >
          <div className="flex items-center gap-2 mb-5">
            <div className="w-8 h-8 rounded-lg bg-primary/20 flex items-center justify-center text-primary shrink-0">
              <Zap className="w-4 h-4" />
            </div>
            <h3 className="text-base font-bold font-sans text-base-content">Next Actions</h3>
          </div>

          <div className="flex flex-col gap-3 flex-1">
            {nextActions.map((action, i) => (
              <Link
                key={action.id}
                to={`/roadmaps/${action.roadmapId}?tab=steps`}
                className="group relative flex items-center gap-3 p-4 rounded-xl bg-base-100/80 hover:bg-base-100 border border-base-300/50 hover:border-primary/40 hover:shadow-lg hover:shadow-primary/10 transition-all"
              >
                <span className="shrink-0 w-6 h-6 rounded-full bg-primary/15 text-primary text-xs font-bold flex items-center justify-center group-hover:bg-primary group-hover:text-primary-content transition-colors">
                  {i + 1}
                </span>
                <span className="font-sans text-sm font-medium text-base-content/80 group-hover:text-base-content transition-colors leading-snug">
                  {action.text}
                </span>
              </Link>
            ))}
            {nextActions.length === 0 && (
              <div className="flex-1 flex items-center justify-center">
                <p className="text-base-content/40 text-sm italic font-sans text-center">
                  🎉 All caught up — great job!
                </p>
              </div>
            )}
          </div>
        </motion.div>
      </div>

      {/* Skill Distribution — Pie/Donut Chart */}
      <motion.div
        initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.6 }}
        className="bg-base-200 rounded-2xl p-6"
      >
        <h3 className="text-lg font-bold font-sans mb-6 text-base-content">Skill Distribution</h3>
        <div className="h-[300px] w-full">
          <ResponsiveContainer width="100%" height="100%">
            <PieChart>
              <Pie
                data={pieData}
                cx="50%"
                cy="50%"
                outerRadius={110}
                innerRadius={55}
                paddingAngle={4}
                dataKey="value"
                label={({ name, value }) => `${name}: ${value}%`}
                labelLine={true}
              >
                {pieData.map((_, i) => (
                  <Cell key={`cell-${i}`} fill={PIE_COLORS[i % PIE_COLORS.length]} stroke="none" />
                ))}
              </Pie>
              <Tooltip content={<CustomTooltip />} />
              <Legend
                iconType="circle"
                wrapperStyle={{ fontSize: '13px', fontFamily: 'IBM Plex Sans, sans-serif' }}
              />
            </PieChart>
          </ResponsiveContainer>
        </div>
      </motion.div>
    </div>
  );
}