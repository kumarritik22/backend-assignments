import React from 'react';
import ScoreBadge from './ScoreBadge';
import { Gavel, Trophy } from 'lucide-react';

function JudgePanel({ judgeData }) {
  return (
    <div 
      className="mt-8 rounded-2xl overflow-hidden"
      style={{ 
        border: `1px solid var(--judge-border)`,
        opacity: 0.9,
        boxShadow: `0 8px 32px var(--shadow-heavy)` 
      }}
    >
      {/* Header */}
      <div 
        className="px-4 md:px-6 py-4 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4"
        style={{ 
          background: `linear-gradient(to right, var(--judge-surface), var(--error-surface))`,
          borderBottom: `1px solid var(--judge-border)` 
        }}
      >
        <div className="flex items-center gap-3">
          <div 
            className="p-2 rounded-xl"
            style={{ backgroundColor: 'var(--judge-surface)', color: 'var(--judge-gold)' }}
          >
            <Gavel size={20} />
          </div>
          <div>
            <h3 className="font-bold flex items-center gap-2 mt-0" style={{ color: 'var(--text-primary)' }}>
              Gemini Judge
            </h3>
            <p className="text-xs font-medium tracking-wide" style={{ color: 'var(--judge-gold)', opacity: 0.8 }}>Evaluation & Recommendation</p>
          </div>
        </div>
        
        {/* Recommendation Badge or Error Badge */}
        {judgeData.error ? (
          <div 
            className="flex items-center self-stretch sm:self-auto justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-full font-bold text-sm"
            style={{ backgroundColor: 'var(--error-bg)', color: 'var(--error-text)', boxShadow: `0 2px 8px var(--error-surface)` }}
          >
            <span>Evaluation Failed</span>
          </div>
        ) : (
          <div 
            className="flex items-center self-stretch sm:self-auto justify-center gap-2 px-3 py-2 sm:py-1.5 rounded-full font-bold text-sm"
            style={{ backgroundColor: 'var(--judge-badge-bg)', color: 'var(--accent-text)', boxShadow: `0 2px 8px var(--judge-surface)` }}
          >
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
      <div className="p-6" style={{ backgroundColor: 'var(--bg-surface)' }}>
        {judgeData.error ? (
          <div 
            className="p-4 rounded-xl text-sm leading-relaxed font-medium text-center"
            style={{ backgroundColor: 'var(--error-surface)', border: `1px solid var(--error-border)`, color: 'var(--error-text)' }}
          >
            {judgeData.message}
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 relative">
            {/* Vertical Divider (desktop only) */}
            <div className="hidden md:block absolute left-1/2 top-0 bottom-0 w-px -translate-x-1/2" style={{ backgroundColor: 'var(--border)' }}></div>
            
            {/* Solution 1 Evaluation */}
            <div className="space-y-4 pr-0 md:pr-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Solution 1 (MistralAI)</h4>
                <ScoreBadge score={judgeData.solution_1_score} />
              </div>
              <div 
                className="p-4 rounded-xl text-sm leading-relaxed font-medium"
                style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
                {judgeData.solution_1_reasoning}
              </div>
            </div>

            {/* Solution 2 Evaluation */}
            <div className="space-y-4 pl-0 md:pl-4">
              <div className="flex items-center justify-between">
                <h4 className="font-bold text-sm" style={{ color: 'var(--text-primary)' }}>Solution 2 (Cohere)</h4>
                <ScoreBadge score={judgeData.solution_2_score} />
              </div>
              <div 
                className="p-4 rounded-xl text-sm leading-relaxed font-medium"
                style={{ backgroundColor: 'var(--bg-elevated)', border: '1px solid var(--border)', color: 'var(--text-secondary)' }}
              >
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
