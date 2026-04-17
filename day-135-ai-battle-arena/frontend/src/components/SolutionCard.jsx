import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot } from 'lucide-react';

function SolutionCard({ modelName, content, colorTheme }) {
  // Configured colors for distinction (mistral vs cohere)
  const isMistral = colorTheme === 'cyan';
  
  const bgAccent = isMistral 
    ? "bg-[#00225a]" 
    : "bg-[#12244e]";
    
  const iconColor = isMistral
    ? "text-[#7bd0ff]"
    : "text-[#dee5ff]";

  return (
    <div className={`flex flex-col h-full rounded-2xl border border-[#12244e] bg-[#06122d] overflow-hidden transition-all duration-200 hover:shadow-md`}>
      {/* Header */}
      <div className={`px-5 py-3 flex items-center gap-3 border-b border-[#12244e] ${bgAccent}`}>
        <div className={`p-1.5 rounded-lg bg-[#06122d] shadow-sm ${iconColor}`}>
          <Bot size={18} />
        </div>
        <h3 className="font-bold text-sm text-[#dee5ff] uppercase tracking-wide">{modelName}</h3>
      </div>
      
      {/* Body */}
      <div className="p-5 grow text-[#939eb5]">
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

export default SolutionCard;
