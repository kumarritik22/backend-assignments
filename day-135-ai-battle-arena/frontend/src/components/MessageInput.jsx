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
        <div className="relative flex items-center overflow-hidden rounded-full bg-[#06122d] border border-[#12244e] shadow-[0_16px_32px_rgba(0,0,0,0.4)] focus-within:ring-2 focus-within:ring-[#7bd0ff]/20 focus-within:border-[#7bd0ff] transition-all duration-300">
          <div className="pl-6 text-[#5b74b1] shrink-0">
            <Sparkles size={20} />
          </div>
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            disabled={isWaiting}
            placeholder={isWaiting ? "Please wait for AI response..." : "Ask the AI models..."}
            className="w-full bg-transparent border-none focus:outline-none px-4 py-5 text-base text-[#dee5ff] placeholder-[#939eb5]/40 disabled:opacity-50"
          />
          <div className="pr-2 shrink-0">
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="p-3 mr-1 bg-[#004c69] hover:bg-[#00225a] disabled:bg-[#06122d] disabled:text-[#5b74b1] text-[#7bd0ff] rounded-full transition-colors hidden sm:flex items-center justify-center focus:outline-none"
            >
              <Send size={18} className={input.trim() && !isWaiting ? "translate-x-0.5" : ""} />
            </button>
            {/* Mobile send button logic */}
            <button
              type="submit"
              disabled={!input.trim() || isWaiting}
              className="p-2 sm:hidden text-[#7bd0ff] disabled:text-[#5b74b1]"
            >
              <Send size={24} />
            </button>
          </div>
        </div>
      </form>
      <div className="text-center mt-3 text-xs text-[#5b74b1] font-medium pb-2">
        AI Battle Arena uses Gemini to evaluate MistralAI and Cohere models.
      </div>
    </div>
  );
}

export default MessageInput;
