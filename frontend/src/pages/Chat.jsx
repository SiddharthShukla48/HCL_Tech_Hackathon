import { useState, useRef, useEffect } from 'react';
import { useLocation } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import { Sparkles, ArrowRight } from 'lucide-react';
import { Link } from 'react-router-dom';
import ChatInput from '../components/ChatInput';
import ThinkingLoader from '../components/ThinkingLoader';
import Logo from '../components/landing/Logo';
import { api } from '../services/api';
import { useRoadmaps } from '../contexts/RoadmapContext';

// Renders one chat bubble
function ChatBubble({ message }) {
  const isUser = message.role === 'user';

  return (
    <motion.div
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      className={`flex w-full mb-6 ${isUser ? 'justify-end' : 'justify-start'}`}
    >
      <div className={`flex gap-3 max-w-[85%] md:max-w-[75%] ${isUser ? 'flex-row-reverse' : 'flex-row'}`}>

        {/* Avatar */}
        <div className={`w-8 h-8 rounded-full flex items-center justify-center shrink-0 self-start mt-1 ${
          isUser ? 'bg-primary text-primary-content font-bold text-xs' : 'bg-primary/10 border border-primary/20'
        }`}>
          {isUser ? 'S' : <Logo className="w-5 h-5 text-primary" />}
        </div>

        {/* Message Content */}
        <div className={`flex flex-col gap-3 ${isUser ? 'items-end' : 'items-start'}`}>
          <div className={`px-5 py-3.5 rounded-2xl text-sm md:text-base font-sans leading-relaxed shadow-sm ${
            isUser
              ? 'bg-primary text-primary-content rounded-tr-sm'
              : 'bg-base-200 border border-base-300 text-base-content rounded-tl-sm'
          }`}>
            {message.content}
          </div>

          {/* CTA button only for roadmap_summary */}
          {message.type === 'roadmap_summary' && message.roadmapId && (
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ delay: 0.3 }}
            >
              <Link
                to={`/roadmaps/${message.roadmapId}`}
                className="inline-flex items-center gap-2 px-5 py-2.5 bg-secondary text-secondary-content rounded-xl font-bold text-sm shadow-md shadow-secondary/20 hover:opacity-90 transition-opacity"
              >
                View Generated Roadmap
                <ArrowRight className="w-4 h-4" />
              </Link>
            </motion.div>
          )}
        </div>
      </div>
    </motion.div>
  );
}

export default function Chat() {
  const location = useLocation();
  // Hero navigates with state.initialQuery
  const initialQuery = location.state?.initialQuery || location.state?.query || '';

  const { addGeneratedRoadmap, loadDetail } = useRoadmaps();

  const [messages, setMessages] = useState([]);
  // isGenerating = only true for the final roadmap response (takes 3s)
  const [isGenerating, setIsGenerating] = useState(false);
  const [questionCount, setQuestionCount] = useState(0);
  const [inputValue, setInputValue] = useState('');
  // Save the original user goal to pass to generateRoadmapSummary
  const [originalGoal, setOriginalGoal] = useState('');
  // tracks if we've already submitted the initial landing-page query
  const initialFired = useRef(false);

  const endOfMessagesRef = useRef(null);

  // Provide a way to manually clear the chat
  const handleClearChat = () => {
    setMessages([]);
    setQuestionCount(0);
    setOriginalGoal('');
    localStorage.removeItem('pathfinder_chat_messages');
    localStorage.removeItem('pathfinder_chat_qc');
    localStorage.removeItem('pathfinder_completion');
  };

  // Auto-scroll to bottom
  useEffect(() => {
    endOfMessagesRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isGenerating]);

  // Fire the initial query from landing page exactly once
  useEffect(() => {
    if (initialQuery && !initialFired.current) {
      initialFired.current = true;
      handleUserSubmit(initialQuery);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  const handleUserSubmit = async (text) => {
    if (!text.trim()) return;

    const userMsg = { id: `u_${Date.now()}`, role: 'user', content: text };
    setMessages(prev => [...prev, userMsg]);
    setInputValue('');

    try {
      if (questionCount < 2) {
        // Clarifying questions — save original goal on first message
        if (questionCount === 0) {
          setOriginalGoal(text);
        }
        const response = await api.getFollowUpQuestion(questionCount + 1);
        setMessages(prev => [...prev, { id: `a_${Date.now()}`, ...response }]);
        setQuestionCount(prev => prev + 1);
      } else {
        // Final roadmap — use the ORIGINAL goal, not the response to clarifying question
        setIsGenerating(true);
        const response = await api.generateRoadmapSummary(originalGoal || text);
        setMessages(prev => [...prev, { id: `a_${Date.now()}`, ...response }]);
        
        // Add the generated roadmap to the context and load its details
        if (response.type === 'roadmap_summary' && response.roadmapId) {
          const roadmapDetail = await api.getRoadmapDetail(response.roadmapId);
          addGeneratedRoadmap(roadmapDetail);
          loadDetail(response.roadmapId);
        }
        
        setIsGenerating(false);
      }
    } catch (err) {
      console.error('API error', err);
      setIsGenerating(false);
    }
  };

  return (
    <div className="h-full flex flex-col bg-base-100 relative">
      {messages.length > 0 && (
        <div className="absolute top-4 right-6 z-10">
          <button
            onClick={handleClearChat}
            className="px-3 py-1.5 rounded-lg bg-base-200 hover:bg-error/20 hover:text-error text-xs font-bold font-sans text-base-content/60 transition-colors"
          >
            Clear Chat
          </button>
        </div>
      )}
      {/* Messages area */}
      <div className="flex-1 overflow-y-auto">
        <div className="max-w-3xl mx-auto px-4 py-8 mt-6">
          {messages.length === 0 && !isGenerating ? (
            // Empty state
            <div className="h-[60vh] flex flex-col items-center justify-center text-center px-4">
              <div className="w-16 h-16 rounded-2xl bg-secondary/10 flex items-center justify-center text-primary mb-6 shadow-sm border border-primary/10">
                <Sparkles className="w-8 h-8" />
              </div>
              <h2 className="text-3xl font-display font-bold text-primary mb-3">
                What do you want to learn?
              </h2>
              <p className="text-base-content/60 font-sans max-w-md text-base">
                Describe your goal and I'll create a perfectly tailored roadmap to get you there.
              </p>
            </div>
          ) : (
            <div className="flex flex-col">
              {messages.map(msg => (
                <ChatBubble key={msg.id} message={msg} />
              ))}

              {/* ThinkingLoader ONLY for final roadmap generation */}
              {isGenerating && (
                <motion.div
                  initial={{ opacity: 0, y: 10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="mb-6 max-w-[75%]"
                >
                  <ThinkingLoader />
                </motion.div>
              )}
              <div ref={endOfMessagesRef} />
            </div>
          )}
        </div>
      </div>

      {/* Fixed input bar at bottom — disabled only while generating final roadmap */}
      <div className="shrink-0 border-t border-base-300 bg-base-100 p-4">
        <div className="max-w-3xl mx-auto">
          <ChatInput
            value={inputValue}
            onChange={setInputValue}
            onSubmit={handleUserSubmit}
            disabled={isGenerating}
          />
          <p className="text-center mt-3 text-xs text-base-content/40 font-sans">
            PathFinder AI can make mistakes. Consider verifying important information.
          </p>
        </div>
      </div>
    </div>
  );
}