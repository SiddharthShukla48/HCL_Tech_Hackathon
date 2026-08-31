import { useState } from 'react';
import { Sparkles, Paperclip, Send, Zap, Globe } from 'lucide-react';

export default function ChatInput({ onSubmit, placeholder = "Ask about anything you want to learn...", value, onChange }) {
  const [internalText, setInternalText] = useState('');
  const isControlled = value !== undefined;
  const text = isControlled ? value : internalText;
  const setText = isControlled ? onChange : setInternalText;

  const handleSubmit = (e) => {
    e.preventDefault();
    if (text.trim() && onSubmit) {
      onSubmit(text);
      setText('');
    }
  };

  const handleKeyDown = (e) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSubmit(e);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="w-full flex flex-col bg-base-100 dark:bg-base-200 border border-base-300 rounded-xl shadow-sm overflow-hidden transition-colors">
      <div className="flex items-start gap-3 p-4 pb-16">
        <Sparkles className="w-5 h-5 text-primary shrink-0 mt-0.5" />
        <input 
          type="text"
          value={text}
          onChange={(e) => setText(e.target.value)}
          onKeyDown={handleKeyDown}
          placeholder={placeholder}
          className="flex-1 bg-transparent text-base-content placeholder-base-content/50 outline-none font-sans"
        />
      </div>
      
      <div className="h-px bg-base-300 w-full" />
      
      <div className="flex items-center justify-between p-3 pt-2">
        <div className="flex items-center gap-2">
          <button type="button" className="p-2 text-base-content/60 hover:text-base-content hover:bg-base-300/50 rounded-lg transition-colors cursor-not-allowed">
            <Paperclip className="w-4 h-4" />
          </button>
          
          <div className="w-px h-5 bg-base-300" />
          
          <div className="flex items-center gap-2">
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-base-content/70 hover:text-base-content hover:bg-base-300/50 rounded-lg transition-colors">
              <Zap className="w-3.5 h-3.5" />
              Reasoning
            </button>
            <button type="button" className="flex items-center gap-1.5 px-3 py-1.5 text-xs font-medium text-base-content/70 hover:text-base-content hover:bg-base-300/50 rounded-lg transition-colors">
              <Globe className="w-3.5 h-3.5" />
              Search
            </button>
          </div>
        </div>
        
        <button 
          type="submit" 
          disabled={!text.trim()}
          className="p-2.5 bg-primary text-primary-content rounded-lg shadow-[0_0_15px_rgba(101,195,200,0.4)] hover:opacity-90 disabled:opacity-50 disabled:cursor-not-allowed transition-all flex items-center justify-center"
        >
          <Send className="w-4 h-4" />
        </button>
      </div>
    </form>
  );
}
