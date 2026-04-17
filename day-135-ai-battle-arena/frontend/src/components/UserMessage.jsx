import React from 'react';
import { User } from 'lucide-react';

function UserMessage({ message }) {
  return (
    <div className="flex justify-end mb-10 mt-6 relative z-10">
      <div className="flex gap-4 max-w-3xl w-full justify-end">
        <div className="bg-[#00225a] text-[#dee5ff] px-5 py-3 md:px-6 md:py-4 rounded-3xl rounded-tr-sm text-base leading-relaxed wrap-break-word shadow-[0_4px_16px_rgba(0,0,0,0.2)] border border-[#12244e]">
          {message}
        </div>
        <div className="shrink-0 w-8 h-8 md:w-10 md:h-10 rounded-full bg-[#004c69] flex items-center justify-center border border-[#7bd0ff]/30 shadow-md">
          <User className="text-[#7bd0ff]" size={18} />
        </div>
      </div>
    </div>
  );
}

export default UserMessage;
