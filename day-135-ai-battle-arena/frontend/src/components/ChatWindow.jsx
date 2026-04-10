import React, { useRef, useEffect } from 'react';
import UserMessage from './UserMessage';
import SolutionCard from './SolutionCard';
import JudgePanel from './JudgePanel';
import MessageInput from './MessageInput';
import { Bot } from 'lucide-react';

function ChatWindow({ messages, onSendMessage, isWaiting }) {
  const bottomRef = useRef(null);

  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' });
  }, [messages, isWaiting]);

  return (
    <div className="flex-1 flex flex-col h-screen relative bg-slate-100 dark:bg-[#060e20] overflow-hidden">
      
      {/* Messages Area */}
      <div className="flex-1 overflow-y-auto px-4 md:px-8 pb-32 pt-6 custom-scrollbar">
        {messages.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-full text-slate-500 dark:text-slate-400 max-w-lg mx-auto text-center space-y-6">
            <div className="p-4 bg-white dark:bg-slate-900 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-800">
              <Bot size={48} className="text-blue-500 mx-auto mb-2" />
              <h2 className="text-xl font-bold text-slate-800 dark:text-slate-200">Welcome to ModelArena</h2>
              <p className="mt-2 text-sm text-slate-500 dark:text-slate-400">
                A competitive playground where AI models go head-to-head. Submit a prompt, watch MistralAI and Cohere generate solutions side-by-side, and let Gemini objectively evaluate and crown the winner.
              </p>
            </div>
          </div>
        ) : (
          <div className="max-w-5xl mx-auto">
            {messages.map((turn, index) => (
              <div key={turn.id || index} className="mb-16">
                {/* User Input */}
                <UserMessage message={turn.problem} />

                {/* AI Responses Side-by-Side Area */}
                {(turn.solution_1 || turn.solution_2) && (
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mt-6">
                    {turn.solution_1 && <SolutionCard 
                      modelName="MistralAI" 
                      content={turn.solution_1} 
                      colorTheme="cyan"
                    />}
                    {turn.solution_2 && <SolutionCard 
                      modelName="Cohere" 
                      content={turn.solution_2} 
                      colorTheme="fuchsia"
                    />}
                  </div>
                )}

                {/* Judge Panel - Only render if judge data is available */}
                {turn.judge && <JudgePanel judgeData={turn.judge} />}
              </div>
            ))}
            
            {/* Loading / Generating State */}
            {isWaiting && (
              <div className="animate-pulse space-y-8 mt-12 max-w-5xl mx-auto">
                <div className="h-6 w-48 bg-slate-200 dark:bg-slate-800 rounded-md"></div>
                <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-64 border border-slate-200 dark:border-slate-800"></div>
                  <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-64 border border-slate-200 dark:border-slate-800"></div>
                </div>
                <div className="bg-slate-100 dark:bg-slate-800/50 rounded-2xl h-40 border border-amber-100 dark:border-amber-900/30"></div>
              </div>
            )}
            
            <div ref={bottomRef} className="h-4" />
          </div>
        )}
      </div>

      {/* Input Area (Fixed Bottom) */}
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-gradient-to-t from-slate-100 via-slate-100 to-transparent dark:from-[#060e20] dark:via-[#060e20] dark:to-transparent pt-12 pointer-events-none">
        <div className="pointer-events-auto">
          <MessageInput onSendMessage={onSendMessage} isWaiting={isWaiting} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
