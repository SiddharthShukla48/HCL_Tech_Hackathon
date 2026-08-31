import { useState, useRef, useEffect } from 'react';
import ChatBubble from './ChatBubble';
import ThinkingLoader from './ThinkingLoader';
import ChatInput from './ChatInput';
import { api } from '../services/api';
import { motion } from 'framer-motion';
import { Sparkles } from 'lucide-react';

export default function ChatWindow({ initialQuery }) {
  const [messages, setMessages] = useState([]);
  const [isThinking, setIsThinking] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [inputValue, setInputValue] = useState(initialQuery || '');
  
  const endOfMessagesRef = useRef(null);

  // Auto-scroll to bottom when messages change or thinking state changes
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isThinking]);

  // If there's an initial query from Landing Page, process it on mount
  useEffect(() => {
    if (initialQuery && messages.length === 0) {
      handleUserSubmit(initialQuery);
      setInputValue(''); // Clear it so it doesn't stay in the input box
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserSubmit = async (text) => {
    if (!text.trim()) return;

    // Add user message
    const userMsg = { id: Date.now().toString(), role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setIsThinking(true);

    try {
      if (questionCount < 2) {
        // Fetch clarifying question
        const response = await api.getFollowUpQuestion(questionCount + 1);
        setMessages(prev => [...prev, { id: Date.now().toString() + '_a', ...response }]);
        setQuestionCount(prev => prev + 1);
      } else {
        // Fetch final roadmap summary
        const response = await api.generateRoadmapSummary();
        setMessages(prev => [...prev, { id: Date.now().toString() + '_a', ...response }]);
      }
    } catch (error) {
      console.error("Failed to fetch response", error);
    } finally {
      setIsThinking(false);
    }
  };

  return (
    <div className="flex flex-col h-full w-full max-w-4xl mx-auto relative">
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 py-8">
        {messages.length === 0 && !isThinking ? (
          <div className="h-full flex flex-col items-center justify-center text-center px-4">
            <div className="w-16 h-16 rounded-2xl bg-primary/10 flex items-center justify-center text-primary mb-6 shadow-sm">
              <Sparkles className="w-8 h-8" />
            </div>
            <h2 className="text-3xl font-display font-bold text-base-content mb-3">
              What do you want to learn?
            </h2>
            <p className="text-base-content/60 font-sans max-w-md">
              Describe your goal, and I'll create a perfectly tailored roadmap to get you there.
            </p>
          </div>
        ) : (
          <div className="flex flex-col">
            {messages.map((msg) => (
              <ChatBubble key={msg.id} message={msg} />
            ))}
            {isThinking && (
              <motion.div 
                initial={{ opacity: 0, y: 10 }} 
                animate={{ opacity: 1, y: 0 }}
                className="mb-6 max-w-[75%]"
              >
                <ThinkingLoader />
              </motion.div>
            )}
            <div ref={endOfMessagesRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area */}
      <div className="p-4 bg-base-100 border-t border-base-300 shrink-0">
        <ChatInput 
          value={inputValue}
          onChange={setInputValue}
          onSubmit={handleUserSubmit}
          disabled={isThinking}
        />
        <div className="text-center mt-3 text-xs text-base-content/40 font-sans">
          PathFinder AI can make mistakes. Consider verifying important information.
        </div>
      </div>
    </div>
  );
}
