import React from 'react';

function ScoreBadge({ score }) {
  // Determine color based on score
  let bgClass = "bg-slate-100 text-slate-700 dark:bg-slate-800 dark:text-slate-300";
  let borderClass = "border-slate-200 dark:border-slate-700";
  
  if (score >= 8) {
    bgClass = "bg-emerald-50 text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-400";
    borderClass = "border-emerald-200 dark:border-emerald-800/60";
  } else if (score >= 5) {
    bgClass = "bg-amber-50 text-amber-700 dark:bg-amber-950/40 dark:text-amber-400";
    borderClass = "border-amber-200 dark:border-amber-800/60";
  } else {
    bgClass = "bg-rose-50 text-rose-700 dark:bg-rose-950/40 dark:text-rose-400";
    borderClass = "border-rose-200 dark:border-rose-800/60";
  }

  return (
    <div className={`flex items-center space-x-2 px-3 py-1.5 rounded-full border ${bgClass} ${borderClass} font-semibold text-sm`}>
      <span className="text-lg font-bold">{score}</span>
      <span className="opacity-70 text-xs font-bold uppercase tracking-wide">/ 10</span>
    </div>
  );
}

export default ScoreBadge;
