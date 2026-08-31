import { BookOpen, Map, PieChart, MessageSquare, Target, Zap } from 'lucide-react';
import { motion } from 'framer-motion';

const features = [
  {
    title: "Conversational Discovery",
    description: "Simply tell our AI what you want to achieve. We'll ask the right questions to understand your unique interests.",
    icon: MessageSquare,
    gradient: "from-primary/20 to-primary/5",
    shadow: "shadow-primary/5",
    borderColor: "border-primary/20"
  },
  {
    title: "Personalized Roadmaps",
    description: "Get a step-by-step learning path tailored exactly to your goals, complete with prerequisites and milestones.",
    icon: Map,
    gradient: "from-secondary/20 to-secondary/5",
    shadow: "shadow-secondary/5",
    borderColor: "border-secondary/20"
  },
  {
    title: "Curated Resources",
    description: "Stop wasting time searching. We recommend the best courses, articles, books, and projects for each step.",
    icon: BookOpen,
    gradient: "from-accent/20 to-accent/5",
    shadow: "shadow-accent/5",
    borderColor: "border-accent/20"
  },
  {
    title: "Progress Tracking",
    description: "Visualize your skill development through our interactive dashboard. Mark milestones complete.",
    icon: PieChart,
    gradient: "from-secondary/20 to-secondary/5",
    shadow: "shadow-secondary/5",
    borderColor: "border-secondary/20"
  },
  {
    title: "Goal-Oriented Learning",
    description: "Everything is aligned with your end objective, ensuring you only learn what's truly necessary.",
    icon: Target,
    gradient: "from-accent/20 to-accent/5",
    shadow: "shadow-accent/5",
    borderColor: "border-accent/20"
  },
  {
    title: "Dynamic Adaptation",
    description: "Your path isn't static. As your interests evolve, your roadmap adapts dynamically with you.",
    icon: Zap,
    gradient: "from-primary/20 to-primary/5",
    shadow: "shadow-primary/5",
    borderColor: "border-primary/20"
  }
];

export default function Features() {
  return (
    <section id="features" className="py-32 scroll-mt-24">
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
              className={`relative flex flex-col h-full bg-gradient-to-br ${feature.gradient} p-8 rounded-[2rem] border ${feature.borderColor} group hover:-translate-y-2 hover:shadow-xl ${feature.shadow} transition-all duration-500`}
            >
              <div className="w-14 h-14 rounded-2xl bg-base-100/50 backdrop-blur-sm flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-500 shadow-sm border border-base-200/50">
                <feature.icon className="w-7 h-7 text-base-content/80" />
              </div>
              
              <h3 className="text-xl font-bold font-sans mb-3 text-base-content">
                {feature.title}
              </h3>
              
              <p className="text-base-content/70 leading-relaxed font-sans text-sm">
                {feature.description}
              </p>
            </motion.div>
          ))}
        </div>
      </div>
    </section>
  );
}
