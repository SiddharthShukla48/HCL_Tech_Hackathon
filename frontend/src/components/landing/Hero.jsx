import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion } from 'framer-motion';
import ChatInput from '../chat/ChatInput';

export default function Hero() {
  const navigate = useNavigate();
  const [query, setQuery] = useState('');

  const handleSearch = (searchQuery) => {
    navigate('/chat', { state: { initialQuery: searchQuery } });
  };

  const handleChipClick = (chip) => {
    setQuery(chip);
  };

  const chips = [
    "Learn Python",
    "Become a UI designer",
    "Master Data Structures"
  ];

  return (
    <div id="home" className="relative min-h-screen bg-base-100 text-base-content overflow-hidden flex flex-col">
      {/* Background Glow */}
      <div className="absolute inset-0 z-0 pointer-events-none flex justify-center items-center overflow-hidden">
        <div className="absolute w-[60vw] h-[60vh] bg-primary/20 rounded-full blur-[120px] mix-blend-multiply dark:mix-blend-screen transform -translate-x-1/4 -translate-y-1/4" />
        <div className="absolute w-[50vw] h-[50vh] bg-secondary/20 rounded-full blur-[100px] mix-blend-multiply dark:mix-blend-screen transform translate-x-1/4 -translate-y-1/4" />
        <div className="absolute w-[40vw] h-[40vh] bg-accent/20 rounded-full blur-[90px] mix-blend-multiply dark:mix-blend-screen transform translate-y-1/4" />
      </div>

      {/* Hero Content */}
      <main className="relative z-10 flex-1 flex flex-col items-center justify-center px-4 pt-32 pb-24 text-center max-w-4xl mx-auto w-full">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-4 flex flex-col items-center gap-3"
        >
          <div className="flex items-center justify-center -space-x-3">
            <img src="https://i.pravatar.cc/100?img=47" alt="User 1" className="w-8 h-8 rounded-full border-2 border-base-100 object-cover" />
            <img src="https://i.pravatar.cc/100?img=32" alt="User 2" className="w-8 h-8 rounded-full border-2 border-base-100 object-cover" />
            <img src="https://i.pravatar.cc/100?img=12" alt="User 3" className="w-8 h-8 rounded-full border-2 border-base-100 object-cover" />
            <div className="w-8 h-8 rounded-full border-2 border-base-100 bg-base-300 flex items-center justify-center text-base-content font-bold text-xs z-10">
              +
            </div>
          </div>
          <div className="px-4 py-1 rounded-full border border-base-300/50 bg-base-200/50 backdrop-blur-sm text-xs font-medium text-base-content/80 tracking-wide font-sans shadow-sm">
            Trusted by 5k+ customers
          </div>
        </motion.div>

        <motion.h1 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.1 }}
          className="font-display text-5xl md:text-6xl font-bold tracking-tight mb-4 leading-tight text-primary"
        >
          Smarter Learning <br/>
          <span className="italic text-secondary font-serif font-medium">Every Single Day</span>
        </motion.h1>

        <motion.p 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.2 }}
          className="text-base md:text-lg text-base-content/70 max-w-xl mx-auto mb-6 font-sans"
        >
          Your always-on AI mentor for sharper skills and smoother career progression.
        </motion.p>

        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.3 }}
          className="flex items-center gap-4 mb-10"
        >
          <button onClick={() => handleSearch(query)} className="px-8 py-3 rounded-lg bg-primary text-primary-content font-medium hover:opacity-90 shadow-lg shadow-primary/20 transition-all">
            Get started
          </button>
          <button onClick={() => handleSearch(query)} className="px-8 py-3 rounded-lg bg-base-200 dark:bg-base-300 text-base-content border border-base-300 hover:bg-base-300 dark:hover:bg-base-200 shadow-sm transition-all">
            Try a Demo
          </button>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
          className="w-full max-w-3xl"
        >
          <ChatInput 
            value={query}
            onChange={setQuery}
            onSubmit={handleSearch} 
          />
          
          <div className="mt-6 flex flex-wrap items-center justify-center gap-3">
            {chips.map((chip) => (
              <button
                key={chip}
                onClick={() => handleChipClick(chip)}
                className="px-4 py-2 rounded-lg text-sm font-medium bg-base-200 text-base-content border border-base-300 hover:bg-base-300 transition-colors"
              >
                {chip}
              </button>
            ))}
          </div>
        </motion.div>
      </main>
    </div>
  );
}
