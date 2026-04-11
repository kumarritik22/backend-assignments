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
          <div className="flex flex-col items-center justify-center min-h-[80%] text-slate-500 dark:text-slate-400 max-w-2xl mx-auto text-center px-4 py-12 transition-all">
            <div className="bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 p-4 rounded-full inline-flex items-center justify-center mb-6 ring-4 ring-slate-50 dark:ring-[#06122d]">
              <Bot size={42} strokeWidth={1.5} />
            </div>
            
            <div className="inline-flex items-center justify-center mb-3 px-3 py-1 rounded-full bg-blue-50 dark:bg-blue-900/40 text-blue-600 dark:text-blue-400 text-xs font-bold tracking-widest uppercase shadow-sm border border-blue-100 dark:border-blue-900/50">
              Welcome to
            </div>
            
            <h1 className="text-4xl md:text-6xl font-extrabold text-slate-800 dark:text-slate-100 tracking-tight mb-3">
              ModelArena
            </h1>
            
            <h2 className="text-xl md:text-2xl font-semibold text-slate-700 dark:text-slate-300 mb-6">
              Compare. Evaluate. Discover the best solution.
            </h2>
            
            <p className="text-base text-slate-500 dark:text-slate-400 max-w-xl mx-auto mb-10 leading-relaxed font-medium">
              Ask once and see multiple models respond side-by-side. Let our impartial AI judge evaluate the answers and crown a winner.
            </p>
            
            <div className="inline-flex items-center justify-center gap-3 text-sm font-medium text-slate-600 dark:text-slate-400 bg-white dark:bg-slate-800/80 px-5 py-2.5 rounded-full border border-slate-200 dark:border-slate-700 shadow-sm">
              <span className="relative flex h-2.5 w-2.5">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>
                <span className="relative inline-flex rounded-full h-2.5 w-2.5 bg-blue-500"></span>
              </span>
              Type a prompt below to begin
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
      <div className="absolute bottom-0 left-0 right-0 p-4 md:p-6 bg-linear-to-t from-slate-100 via-slate-100 to-transparent dark:from-[#060e20] dark:via-[#060e20] dark:to-transparent pt-12 pointer-events-none">
        <div className="pointer-events-auto">
          <MessageInput onSendMessage={onSendMessage} isWaiting={isWaiting} />
        </div>
      </div>
    </div>
  );
}

export default ChatWindow;
