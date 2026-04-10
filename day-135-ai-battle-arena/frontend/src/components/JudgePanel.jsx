import React from 'react';
import ScoreBadge from './ScoreBadge';
import { Gavel, Trophy } from 'lucide-react';

function JudgePanel({ judgeData }) {
  return (
    <div className="mt-8 rounded-2xl border border-amber-200/60 dark:border-amber-900/30 overflow-hidden shadow-sm">
      {/* Header */}
      <div className="bg-gradient-to-r from-amber-50 to-orange-50 dark:from-amber-950/30 dark:to-orange-950/30 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-amber-100 dark:border-amber-900/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-amber-100 dark:bg-amber-900/50 text-amber-700 dark:text-amber-400">
            <Gavel size={20} />
          </div>
          <div>
            <h3 className="font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2 mt-0">
              Gemini Judge
            </h3>
            <p className="text-xs text-amber-700/80 dark:text-amber-400/80 font-medium">Evaluation & Recommendation</p>
          </div>
        </div>
        
        {/* Recommendation Badge */}
        <div className="flex items-center self-stretch sm:self-auto justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-full bg-yellow-400 dark:bg-yellow-500 text-yellow-950 font-bold text-sm shadow-sm ring-1 ring-yellow-500/50">
          <Trophy size={16} />
          <span>Winner: {judgeData.recommendation === 1 ? 'MistralAI' : 'Cohere'}</span>
        </div>
      </div>

      {/* Body */}
      <div className="bg-white dark:bg-[#080d19] p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
          {/* Vertical Divider (desktop only) */}
          <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-slate-100 dark:bg-slate-800 -translate-x-1/2"></div>
          
          {/* Solution 1 Evaluation */}
          <div className="space-y-4 pr-0 md:pr-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Solution 1 (MistralAI)</h4>
              <ScoreBadge score={judgeData.solution_1_score} />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {judgeData.solution_1_reasoning}
            </div>
          </div>

          {/* Solution 2 Evaluation */}
          <div className="space-y-4 pl-0 md:pl-4">
            <div className="flex items-center justify-between">
              <h4 className="font-semibold text-sm text-slate-800 dark:text-slate-200">Solution 2 (Cohere)</h4>
              <ScoreBadge score={judgeData.solution_2_score} />
            </div>
            <div className="p-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-100 dark:border-slate-800/80 text-sm text-slate-700 dark:text-slate-200 leading-relaxed font-medium">
              {judgeData.solution_2_reasoning}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

export default JudgePanel;
