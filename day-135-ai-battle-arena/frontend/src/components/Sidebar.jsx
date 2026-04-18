import React from 'react';
import { Plus, MessageSquare, Menu, X, PanelLeftClose, Swords, Trash2, User } from 'lucide-react';
import { useAuth } from '../context/AuthContext';

function Sidebar({ 
  chatHistory, 
  activeChatId, 
  onSelectChat, 
  onNewChat,
  onDeleteChat,
  onCloseMobile
}) {
  const { user } = useAuth();

  return (
    <div className="w-72 bg-[#06122d] border-r border-[#12244e] h-screen flex flex-col transition-colors z-30 shadow-lg md:shadow-none absolute md:relative">
      
      {/* Header */}
      <div className="p-4 md:p-6 pb-2 border-b border-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-[#004c69] flex items-center justify-center text-[#7bd0ff] shadow-md cursor-pointer">
              <Swords size={20} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter text-[#dee5ff]">
              AI Battle <span className="font-medium text-[#7bd0ff]">Arena</span>
            </h1>
          </div>
          {/* Close button for Mobile AND Desktop */}
          <button 
            className="text-[#939eb5] p-2 rounded-md hover:text-[#7bd0ff] hover:bg-[#00225a]"
            onClick={onCloseMobile}
            title="Close sidebar"
          >
            <PanelLeftClose size={20} className="hidden md:block" />
            <X size={20} className="md:hidden" />
          </button>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-start gap-3 text-[#004560] p-3 rounded-xl transition-all hover:scale-[0.98] font-bold shadow-[0_4px_12px_rgba(123,208,255,0.2)]"
          style={{ background: 'linear-gradient(135deg, #7bd0ff 0%, #004c69 100%)' }}
        >
          <Plus size={18} />
          New Deployment
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto mt-4 px-3 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-[10px] font-bold text-[#91aaeb] uppercase tracking-widest">
          Recent Encounters
        </div>
        {chatHistory.map(chat => (
          <div
            key={chat.id}
            className={`w-full relative group rounded-lg transition-all
              ${activeChatId === chat.id 
                ? 'bg-[#00225a] border border-[#12244e]' 
                : 'border border-transparent hover:bg-[#00225a]'
              }`}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className={`w-full text-left p-3 flex items-center gap-3 text-sm truncate rounded-lg
                ${activeChatId === chat.id 
                  ? 'text-[#7bd0ff] font-medium' 
                  : 'text-[#939eb5] hover:text-[#dee5ff]'
                }`}
            >
              <MessageSquare size={16} className={`${activeChatId === chat.id ? 'text-[#7bd0ff]' : 'text-[#939eb5] group-hover:text-[#7bd0ff]'}`} />
              <span className="truncate pr-6">{chat.title}</span>
            </button>
            <button
              onClick={(e) => onDeleteChat ? onDeleteChat(e, chat.id) : null}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 hover:bg-[#12244e] rounded-md"
              title="Delete chat"
            >
              <Trash2 size={14} className="text-[#939eb5] hover:text-[#ff9993] transition-colors" />
            </button>
          </div>
        ))}
      </div>

      {/* Footer (Profile) */}
      <div className="p-4 border-t border-[#12244e] mt-auto space-y-2">
        {/* Profile Card */}
        <div className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-[#00225a] text-[#dee5ff] transition-colors border border-transparent text-left cursor-default">
          <div className="w-9 h-9 rounded-full bg-[#004c69] border border-[#7bd0ff]/30 overflow-hidden flex items-center justify-center shrink-0 text-[#7bd0ff]">
            {user ? (
              <span className="font-bold text-sm uppercase">{user.name.charAt(0)}</span>
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="flex-1 truncate">
            <div className="font-semibold text-sm tracking-tight">{user ? user.name : 'Unknown Commander'}</div>
            <div className="text-[10px] uppercase font-bold text-[#7bd0ff]/70 tracking-wider">Active Stream</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
