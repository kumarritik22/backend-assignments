import React from 'react';
import { AlertCircle, RefreshCw } from 'lucide-react';

function GlobalErrorFallback({ error, resetErrorBoundary }) {
  return (
    <div className="flex flex-col items-center justify-center min-h-screen bg-[#060e20] text-[#dee5ff] p-4 text-center">
      <div className="bg-[#00225a] border border-[#ff9993]/40 p-8 rounded-2xl shadow-[0_4px_24px_rgba(127,41,39,0.3)] max-w-lg w-full flex flex-col items-center">
        
        <div className="w-16 h-16 rounded-full bg-[#7f2927]/20 flex items-center justify-center text-[#ff9993] mb-6">
          <AlertCircle size={32} />
        </div>
        
        <h1 className="text-2xl font-black tracking-tight mb-2">Systems Overloaded</h1>
        <p className="text-[#939eb5] mb-6 text-sm font-medium leading-relaxed">
          The AI Battle Arena encountered an unexpected critical malfunction and the UI cluster has crashed. Your historical data remains perfectly safe inside the servers.
        </p>

        {/* Technical Error Snippet */}
        <div className="w-full bg-[#06122d] text-left p-4 rounded-xl border border-[#12244e] mb-8 font-mono text-[11px] text-[#ff9993]/70 overflow-x-auto tracking-wider whitespace-nowrap">
           {error?.message || "Unknown rendering exception"}
        </div>
        
        <button
          onClick={resetErrorBoundary}
          className="flex items-center justify-center gap-2 w-full py-3 px-4 bg-[#7bd0ff] rounded-xl text-[#00225a] font-bold text-sm tracking-wide transition-all shadow-[0_4px_12px_rgba(123,208,255,0.2)] hover:bg-[#a6e0ff] hover:-translate-y-0.5 active:translate-y-0"
        >
          <RefreshCw size={18} />
          Reboot Interface
        </button>

      </div>
    </div>
  );
}

export default GlobalErrorFallback;
