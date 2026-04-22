import React from 'react';

function ScoreBadge({ score }) {
  // Determine color based on score using CSS variables
  let bgColor, textColor, borderColor;
  
  if (score >= 8) {
    bgColor = 'var(--score-good-bg)';
    textColor = 'var(--score-good-text)';
    borderColor = 'var(--score-good-border)';
  } else if (score >= 5) {
    bgColor = 'var(--score-mid-bg)';
    textColor = 'var(--score-mid-text)';
    borderColor = 'var(--score-mid-border)';
  } else {
    bgColor = 'var(--score-bad-bg)';
    textColor = 'var(--score-bad-text)';
    borderColor = 'var(--score-bad-border)';
  }

  return (
    <div 
      className="flex items-center space-x-2 px-3 py-1.5 rounded-full font-semibold text-sm"
      style={{ backgroundColor: bgColor, color: textColor, border: `1px solid ${borderColor}` }}
    >
      <span className="text-lg font-bold">{score}</span>
      <span className="opacity-70 text-xs font-bold uppercase tracking-wide">/ 10</span>
    </div>
  );
}

export default ScoreBadge;
