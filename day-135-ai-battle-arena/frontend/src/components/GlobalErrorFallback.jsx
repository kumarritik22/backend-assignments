import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

function GlobalErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div 
      className="flex flex-col items-center justify-center min-h-screen p-4 text-center"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      <div 
        className="p-8 rounded-2xl max-w-lg w-full flex flex-col items-center"
        style={{ 
          backgroundColor: 'var(--bg-elevated)', 
          border: '1px solid var(--error-border)',
          boxShadow: `0 4px 24px var(--error-surface)` 
        }}
      >
        
        <div 
          className="w-16 h-16 rounded-full flex items-center justify-center mb-6"
          style={{ backgroundColor: 'var(--error-surface)', color: 'var(--error-text)' }}
        >
          <AlertCircle size={32} />
        </div>
        
        <h1 className="text-2xl font-black tracking-tight mb-2">Systems Overloaded</h1>
        <p className="mb-6 text-sm font-medium leading-relaxed" style={{ color: 'var(--text-secondary)' }}>
          The AI Battle Arena encountered an unexpected critical malfunction and the UI cluster has crashed. Your historical data remains perfectly safe inside the servers.
        </p>

        {/* Technical Error Snippet */}
        <div 
          className="w-full text-left p-4 rounded-xl mb-8 font-mono text-[11px] overflow-x-auto tracking-wider whitespace-nowrap"
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            border: '1px solid var(--border)', 
            color: 'var(--error-text)',
            opacity: 0.7
          }}
        >
           {error?.message || "Unknown rendering exception"}
        </div>
        
        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 rounded-xl font-bold text-sm tracking-wide transition-all hover:-translate-y-0.5 active:translate-y-0"
          style={{ 
            backgroundColor: 'var(--accent)', 
            color: 'var(--accent-text)',
            boxShadow: `0 4px 12px var(--accent-glow)` 
          }}
        >
          <RefreshCw size={18} />
          Reboot Interface
        </button>

      </div>
    </div>
  );
}

export default GlobalErrorFallback;
