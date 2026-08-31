import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { ChevronDown, ArrowRight } from 'lucide-react';

const faqs = [
  {
    question: "What exactly is PathFinder?",
    answer: "PathFinder is an AI-powered personalized learning assistant. Instead of giving you a generic list of courses, it engages in a conversation to understand your goals and current skill level, then generates a custom, step-by-step roadmap to get you where you want to be."
  },
  {
    question: "Do I need to know what I want to learn before using it?",
    answer: "Not entirely! You can start with a broad goal like 'I want to build mobile apps' or 'I want to learn data analysis.' Our AI will ask clarifying questions to help narrow down the best technologies and path for your specific interests."
  },
  {
    question: "Are the recommended resources free?",
    answer: "We strive to recommend a mix of high-quality free and paid resources (like articles, YouTube tutorials, and comprehensive courses). You can easily skip or replace resources that don't fit your budget."
  },
  {
    question: "How is this different from a standard online course platform?",
    answer: "Standard platforms offer a one-size-fits-all curriculum. PathFinder aggregates resources from across the entire web and structures them specifically for your unique starting point, skipping things you already know and focusing on your gaps."
  },
  {
    question: "Can I track my progress?",
    answer: "Yes! Once a roadmap is generated, you can access your personalized Dashboard. Here, you can check off milestones, visualize your skill development, and see your next recommended actions."
  }
];

export default function Faqs() {
  const navigate = useNavigate();
  const [openIndex, setOpenIndex] = useState(0);

  return (
    <section id="faqs" className="py-32 scroll-mt-24">
      <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-16 lg:gap-8">
        
        {/* Left Column */}
        <div className="lg:col-span-5 lg:pr-12">
          <div className="inline-block px-4 py-1.5 rounded-full border border-base-content/20 text-xs font-bold tracking-widest uppercase mb-6 text-base-content/80">
            FAQ
          </div>
          <h2 className="font-display text-4xl md:text-5xl font-bold text-primary mb-6 leading-tight">
            <span className="text-secondary font-serif italic">Frequently Asked</span> Questions
          </h2>
          <p className="text-lg text-base-content/70 font-sans mb-8">
            Can't find the answer you're looking for?<br/>
            Reach out to our team.
          </p>
          <button className="px-6 py-3 bg-primary text-primary-content rounded-xl font-bold flex items-center gap-2 hover:bg-primary/90 transition-colors mb-12 shadow-lg shadow-primary/20" onClick={() => navigate('/chat')}>
            Start Learning
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

        {/* Right Column - Accordion */}
        <div className="lg:col-span-7 space-y-4 pt-4">
          {faqs.map((faq, index) => {
            const isOpen = index === openIndex;
            return (
              <div 
                key={index}
                className={`border rounded-2xl overflow-hidden transition-all duration-300 ${isOpen ? 'border-primary/50 bg-base-200/80 shadow-md' : 'border-base-300 bg-base-200/30 hover:border-base-content/20'}`}
              >
                <button
                  onClick={() => setOpenIndex(isOpen ? -1 : index)}
                  className="w-full px-6 py-5 flex items-center gap-6 text-left focus:outline-none"
                >
                  <div className={`w-10 h-10 rounded-lg flex items-center justify-center font-mono text-sm font-bold shrink-0 transition-colors ${isOpen ? 'bg-primary text-primary-content' : 'bg-base-300 text-base-content/50'}`}>
                    {String(index + 1).padStart(2, '0')}
                  </div>
                  <span className="font-sans font-bold text-lg text-base-content flex-1 pr-4">
                    {faq.question}
                  </span>
                  <ChevronDown 
                    className={`w-5 h-5 text-base-content/50 transition-transform duration-300 shrink-0 ${isOpen ? 'rotate-180 text-primary' : ''}`}
                  />
                </button>
                <AnimatePresence>
                  {isOpen && (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: "easeInOut" }}
                    >
                      <div className="px-6 pb-6 pt-0 ml-16 text-base-content/70 font-sans leading-relaxed">
                        {faq.answer}
                      </div>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
