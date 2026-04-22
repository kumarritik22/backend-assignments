import React from 'react';
import MarkdownRenderer from './MarkdownRenderer';
import { Bot } from 'lucide-react';

function SolutionCard({ modelName, content, colorTheme }) {
  // Configured colors for distinction (mistral vs cohere)
  const isMistral = colorTheme === 'cyan';
  
  const bgAccent = isMistral 
    ? 'var(--solution-cyan-bg)' 
    : 'var(--solution-fuchsia-bg)';

  return (
    <div 
      className="flex flex-col h-full rounded-2xl overflow-hidden transition-all duration-200 hover:shadow-md"
      style={{ backgroundColor: 'var(--bg-surface)', border: '1px solid var(--border)' }}
    >
      {/* Header */}
      <div 
        className="px-5 py-3 flex items-center gap-3"
        style={{ backgroundColor: bgAccent, borderBottom: '1px solid var(--border)' }}
      >
        <div 
          className="p-1.5 rounded-lg shadow-sm"
          style={{ backgroundColor: 'var(--bg-surface)', color: isMistral ? 'var(--accent)' : 'var(--text-primary)' }}
        >
          <Bot size={18} />
        </div>
        <h3 className="font-bold text-sm uppercase tracking-wide" style={{ color: 'var(--text-primary)' }}>{modelName}</h3>
      </div>
      
      {/* Body */}
      <div className="p-5 grow" style={{ color: 'var(--text-secondary)' }}>
        <MarkdownRenderer content={content} />
      </div>
    </div>
  );
}

export default SolutionCard;
