import React, { useState } from 'react';
import { Send, Sparkles } from 'lucide-react';

function MessageInput({ onSendMessage, isWaiting }) {
  const [input, setInput] = useState('');

  const handleSubmit = (e) => {
    e.preventDefault();
    if (input.trim() && !isWaiting) {
      onSendMessage(input.trim());
      setInput('');
    }
  };

  return (
    <div className="relative max-w-4xl mx-auto w-full">
      <form onSubmit={handleSubmit} className="relative z-20">
        <div className="relative flex items-center overflow-hidden rounded-full bg-white dark:bg-slate-900 border border-slate-300 dark:border-slate-700 shadow-lg shadow-slate-200/20 dark:shadow-none focus-within:ring-2 focus-within:ring-blue-500/50 focus-within:border-blue-500 transition-all">
          <div className="pl-6 text-slate-400 dark:text-slate-500 flex-shrink-0">
            <Sparkles size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isWaiting}
            placeholder={isWaiting ? "Please wait for AI response..." : "Ask the AI models..."}
            className="w-full bg-transparent border-none focus:outline-none px-4 py-4 text-slate-800 dark:text-slate-200 placeholder-slate-400 dark:placeholder-slate-500 disabled:opacity-50"
          />
          <div className="pr-2 flex-shrink-0">
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="p-3 mr-1 bg-blue-600 hover:bg-blue-700 disabled:bg-slate-200 disabled:text-slate-400 dark:disabled:bg-slate-800 dark:disabled:text-slate-600 text-white rounded-full transition-colors hidden sm:flex items-center justify-center focus:outline-none"
            >
              <Send size={18} className={input.trim() && !isWaiting ? "translate-x-0.5" : ""} />
            </button>
            {/* Mobile send button logic */}
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="p-2 sm:hidden text-blue-600 disabled:text-slate-400"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </form>
      <div className="text-center mt-3 text-xs text-slate-500 dark:text-slate-400 font-medium pb-2">
        ModelArena uses Gemini to evaluate MistralAI and Cohere models.
      </div>
    </div>
  );
}

export default MessageInput;
