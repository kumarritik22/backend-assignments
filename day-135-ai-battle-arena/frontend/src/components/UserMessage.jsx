import React from 'react';
import { User } from 'lucide-react';

function UserMessage({ message }) {
  return (
    <div className="flex justify-end mb-10 mt-6 relative z-10">
      <div className="flex gap-4 max-w-3xl w-full justify-end">
        <div className="bg-white dark:bg-slate-800 text-slate-900 dark:text-gray-100 px-5 py-3 md:px-6 md:py-4 rounded-3xl rounded-tr-sm text-base leading-relaxed break-words shadow-sm border border-slate-200/60 dark:border-slate-700/50">
          {message}
        </div>
        <div className="flex-shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-blue-100 dark:bg-blue-900/50 flex items-center justify-center border border-blue-200 dark:border-blue-800">
          <User className="text-blue-600 dark:text-blue-400" size={18} />
        </div>
      </div>
    </div>
  );
}

export default UserMessage;
