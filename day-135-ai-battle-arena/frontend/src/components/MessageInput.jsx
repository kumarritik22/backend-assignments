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
        <div 
          className="relative flex items-center overflow-hidden rounded-full transition-all duration-300"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            border: '1px solid var(--border)',
            boxShadow: `0 16px 32px var(--shadow-heavy)` 
          }}
        >
          <div className="pl-6 shrink-0" style={{ color: 'var(--text-tertiary)' }}>
            <Sparkles size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isWaiting}
            placeholder={isWaiting ? "Please wait for AI response..." : "Ask the AI models..."}
            className="w-full bg-transparent border-none focus:outline-none px-4 py-5 text-base disabled:opacity-50"
            style={{ color: 'var(--text-primary)' }}
          />
          <div className="pr-2 shrink-0">
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="p-3 mr-1 rounded-full transition-colors hidden sm:flex items-center justify-center focus:outline-none"
              style={{ 
                backgroundColor: input.trim() && !isWaiting ? 'var(--accent-surface)' : 'var(--bg-surface)',
                color: input.trim() && !isWaiting ? 'var(--accent)' : 'var(--text-tertiary)'
              }}
            >
              <Send size={18} className={input.trim() && !isWaiting ? "translate-x-0.5" : ""} />
            </button>
            {/* Mobile send button logic */}
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="p-2 sm:hidden"
              style={{ color: input.trim() && !isWaiting ? 'var(--accent)' : 'var(--text-tertiary)' }}
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </form>
      <div className="text-center mt-3 text-xs font-medium pb-2" style={{ color: 'var(--text-tertiary)' }}>
        AI Battle Arena uses Gemini to evaluate MistralAI and Cohere models.
      </div>
    </div>
  );
}

export default MessageInput;
