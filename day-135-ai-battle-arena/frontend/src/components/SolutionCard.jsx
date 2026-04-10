import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot } from 'lucide-react';

function SolutionCard({ modelName, content, colorTheme }) {
  // Configured colors for distinction (mistral vs cohere)
  const isMistral = colorTheme === 'cyan';
  
  const bgAccent = isMistral 
    ? "bg-cyan-50 dark:bg-cyan-950/20" 
    : "bg-fuchsia-50 dark:bg-fuchsia-950/20";
    
  const iconColor = isMistral
    ? "text-cyan-600 dark:text-cyan-400"
    : "text-fuchsia-600 dark:text-fuchsia-400";

  return (
    <div className={`flex flex-col h-full rounded-2xl border border-slate-200 dark:border-slate-800 bg-white dark:bg-slate-900 overflow-hidden transition-all duration-200 hover:shadow-md`}>
      {/* Header */}
      <div className={`px-5 py-3 flex items-center gap-3 border-b border-slate-100 dark:border-slate-800 ${bgAccent}`}>
        <div className={`p-1.5 rounded-lg bg-white dark:bg-slate-800 shadow-sm ${iconColor}`}>
          <Bot size={18} />
        </div>
        <h3 className="font-semibold text-sm text-slate-800 dark:text-slate-200">{modelName}</h3>
      </div>
      
      {/* Body */}
      <div className="p-5 flex-grow">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

export default SolutionCard;
