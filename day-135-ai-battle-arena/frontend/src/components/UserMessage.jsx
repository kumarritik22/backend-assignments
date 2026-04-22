import React from 'react';
import { User } from 'lucide-react';

function UserMessage({ message }) {
  return (
    <div className="flex justify-end mb-10 mt-6 relative z-10">
      <div className="flex gap-4 max-w-3xl w-full justify-end">
        <div 
          className="px-5 py-3 md:px-6 md:py-4 rounded-3xl rounded-tr-sm text-base leading-relaxed wrap-break-word"
          style={{ 
            backgroundColor: 'var(--bg-elevated)', 
            color: 'var(--text-primary)',
            boxShadow: `0 4px 16px var(--shadow-color)`,
            border: '1px solid var(--border)' 
          }}
        >
          {message}
        </div>
        <div 
          className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full flex items-center justify-center shadow-md"
          style={{ 
            backgroundColor: 'var(--accent-surface)', 
            border: '1px solid var(--accent)',
            opacity: 0.8,
            color: 'var(--accent)' 
          }}
        >
          <User size={18} />
        </div>
      </div>
    </div>
  );
}

export default UserMessage;
