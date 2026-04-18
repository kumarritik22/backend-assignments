import React from 'react';
import ScoreBadge from './ScoreBadge';
import { Gavel, Trophy } from 'lucide-react';

function JudgePanel({ judgeData }) {
  return (
    <div className="mt-8 rounded-2xl border border-[#b28a2a]/40 overflow-hidden shadow-[0_8px_32px_rgba(0,0,0,0.3)]">
      {/* Header */}
      <div className="bg-linear-to-r from-[#b28a2a]/20 to-[#7f2927]/20 px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b border-[#b28a2a]/40">
        <div className="flex items-center gap-3">
          <div className="p-2 rounded-xl bg-[#b28a2a]/30 text-[#e6b741]">
            <Gavel size={20} />
          </div>
          <div>
            <h3 className="font-bold text-[#dee5ff] flex items-center gap-2 mt-0">
              Gemini Judge
            </h3>
            <p className="text-xs text-[#e6b741]/80 font-medium tracking-wide">Evaluation & Recommendation</p>
          </div>
        </div>
        
        {/* Recommendation Badge or Error Badge */}
        {judgeData.error ? (
          <div className="flex items-center self-stretch sm:self-auto justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-full bg-[#7f2927] text-white font-bold text-sm shadow-[0_2px_8px_rgba(127,41,39,0.4)]">
            <span>Evaluation Failed</span>
          </div>
        ) : (
          <div className="flex items-center self-stretch sm:self-auto justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-full bg-[#e6b741] text-[#00225a] font-bold text-sm shadow-[0_2px_8px_rgba(230,183,65,0.4)]">
            <Trophy size={16} />
            <span>Winner: {
              Number(judgeData.solution_1_score) > Number(judgeData.solution_2_score) 
                ? 'MistralAI' 
                : Number(judgeData.solution_2_score) > Number(judgeData.solution_1_score)
                  ? 'Cohere'
                  : 'Tie'
            }</span>
          </div>
        )}
      </div>

      {/* Body */}
      <div className="bg-[#06122d] p-6">
        {judgeData.error ? (
          <div className="p-4 rounded-xl bg-[#7f2927]/10 border border-[#7f2927]/30 text-sm text-[#ff9993] leading-relaxed font-medium text-center">
            {judgeData.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Vertical Divider (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px bg-[#12244e] -translate-x-1/2"></div>
            
            {/* Solution 1 Evaluation */}
            <div className="space-y-4 pr-0 md:pr-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#dee5ff]">Solution 1 (MistralAI)</h4>
                <ScoreBadge score={judgeData.solution_1_score} />
              </div>
              <div className="p-4 rounded-xl bg-[#00225a] border border-[#12244e] text-sm text-[#939eb5] leading-relaxed font-medium">
                {judgeData.solution_1_reasoning}
              </div>
            </div>

            {/* Solution 2 Evaluation */}
            <div className="space-y-4 pl-0 md:pl-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm text-[#dee5ff]">Solution 2 (Cohere)</h4>
                <ScoreBadge score={judgeData.solution_2_score} />
              </div>
              <div className="p-4 rounded-xl bg-[#00225a] border border-[#12244e] text-sm text-[#939eb5] leading-relaxed font-medium">
                {judgeData.solution_2_reasoning}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default JudgePanel;
