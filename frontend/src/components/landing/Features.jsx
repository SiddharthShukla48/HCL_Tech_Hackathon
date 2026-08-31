import { BookOpen, Map, PieChart, MessageSquare, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Conversational Discovery",
    description: "Simply tell our AI what you want to achieve. We'll ask the right questions to understand your unique interests.",
    icon: MessageSquare,
    gradient: "from-primary to-teal-700",
    shadow: "shadow-primary/20"
  },
  {
    title: "Personalized Roadmaps",
    description: "Get a step-by-step learning path tailored exactly to your goals, complete with prerequisites and milestones.",
    icon: Map,
    gradient: "from-secondary to-indigo-700",
    shadow: "shadow-secondary/20"
  },
  {
    title: "Curated Resources",
    description: "Stop wasting time searching. We recommend the best courses, articles, books, and projects for each step.",
    icon: BookOpen,
    gradient: "from-accent to-orange-600",
    shadow: "shadow-accent/20"
  },
  {
    title: "Progress Tracking",
    description: "Visualize your skill development through our interactive dashboard. Mark milestones complete.",
    icon: PieChart,
    gradient: "from-secondary to-indigo-700",
    shadow: "shadow-secondary/20"
  },
  {
    title: "Goal-Oriented Learning",
    description: "Everything is aligned with your end objective, ensuring you only learn what's truly necessary.",
    icon: Target,
    gradient: "from-accent to-orange-600",
    shadow: "shadow-accent/20"
  },
  {
    title: "Dynamic Adaptation",
    description: "Your path isn't static. As your interests evolve, your roadmap adapts dynamically with you.",
    icon: Zap,
    gradient: "from-primary to-teal-700",
    shadow: "shadow-primary/20"
  }
];

export default function Features() {
  return (
    <section className="py-32">
      <div className="max-w-7xl mx-auto px-6">
        <div className="text-center max-w-3xl mx-auto mb-20 flex flex-col items-center">
          <div className="inline-block px-4 py-1.5 rounded-full border border-base-content/20 text-xs font-bold tracking-widest uppercase mb-6 text-base-content/80">
            How It Helps
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            Learning that <span className="italic text-secondary font-serif font-bold">evolves</span> with you
          </h2>
          <p className="text-lg text-base-content/70 font-sans max-w-2xl">
            Adaptive roadmaps and continuous feedback built specifically for ambitious self-guided learners.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-3 md:grid-cols-2 gap-8">
          {features.map((feature, index) => (
            <motion.div
              key={index}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.6, delay: index * 0.1 }}
              className="relative flex flex-col h-full bg-base-200/50 rounded-[2rem] border border-base-300 group hover:border-base-content/20 transition-colors duration-500"
            >
              {/* Top Visual Area */}
              <div className="relative h-56 w-full p-8 flex items-center justify-center overflow-hidden rounded-t-[2rem]">
                {/* Subtle corner markers */}
                <div className="absolute top-6 left-6 w-3 h-3 border-t-2 border-l-2 border-base-content/20 opacity-50" />
                <div className="absolute top-6 right-6 w-3 h-3 border-t-2 border-r-2 border-base-content/20 opacity-50" />
                <div className="absolute bottom-6 left-6 w-3 h-3 border-b-2 border-l-2 border-base-content/20 opacity-50" />
                <div className="absolute bottom-6 right-6 w-3 h-3 border-b-2 border-r-2 border-base-content/20 opacity-50" />
                
                <feature.icon className="w-20 h-20 text-base-content/10 group-hover:scale-110 group-hover:text-base-content/20 transition-all duration-700" />
              </div>

              {/* Floating Bottom Card */}
              <div className="px-3 pb-3 mt-auto relative z-10">
                <div className={`p-6 rounded-[1.5rem] bg-gradient-to-br ${feature.gradient} text-white shadow-xl ${feature.shadow} transform group-hover:-translate-y-2 transition-transform duration-500 ease-out`}>
                  <h3 className="text-xl font-bold font-sans mb-2">
                    {feature.title}
                  </h3>
                  <p className="text-white/80 leading-relaxed font-sans text-sm">
                    {feature.description}
                  </p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
