import { useState, useEffect } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import Logo from './landing/Logo'; // Reusing the SVG logo

const PHRASES = [
  "Thinking",
  "Generating",
  "Mulling",
  "Factoring",
  "Reasoning"
];

export default function ThinkingLoader() {
  const [index, setIndex] = useState(0);

  useEffect(() => {
    const interval = setInterval(() => {
      setIndex((prev) => (prev + 1) % PHRASES.length);
    }, 800); // Change phrase every 800ms
    return () => clearInterval(interval);
  }, []);

  return (
    <div className="flex items-center gap-4 py-4 w-full">
      {/* Small pulsing logo */}
      <div className="w-8 h-8 rounded-full bg-primary/10 flex items-center justify-center shrink-0 shadow-sm border border-primary/20">
        <Logo className="w-5 h-5 text-primary animate-pulse" />
      </div>
      
      {/* Cycling text */}
      <div className="relative h-6 flex-1 overflow-hidden flex items-center">
        <AnimatePresence mode="popLayout">
          <motion.span
            key={PHRASES[index]}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
            transition={{ duration: 0.3 }}
            className="absolute text-sm font-sans font-medium text-base-content/60 tracking-wider flex items-center"
          >
            {PHRASES[index]}
            <span className="ml-1 inline-flex w-4 text-left">
              <motion.span
                animate={{ opacity: [0, 1, 0] }}
                transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
              >
                ...
              </motion.span>
            </span>
          </motion.span>
        </AnimatePresence>
      </div>
    </div>
  );
}
