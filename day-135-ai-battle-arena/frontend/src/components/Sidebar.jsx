import React from 'react';
import { Plus, MessageSquare, Moon, Sun, Menu, X, PanelLeftClose, Swords } from 'lucide-react';
import { useTheme } from '../hooks/useTheme';

function Sidebar({ 
  chatHistory, 
  activeChatId, 
  onSelectChat, 
  onNewChat,
  onCloseMobile
}) {
  const { theme, toggleTheme } = useTheme();

  return (
    <div className="w-72 bg-white dark:bg-[#06122d] border-r border-slate-200 dark:border-slate-800 h-screen flex flex-col transition-colors z-30 shadow-lg md:shadow-none absolute md:relative">
      
      {/* Header */}
      <div className="p-4 md:p-6 pb-2 border-b border-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-lg bg-blue-600 flex items-center justify-center text-white shadow-md cursor-pointer">
              <Swords size={20} />
            </div>
            <h1 className="text-xl font-bold tracking-tight text-slate-800 dark:text-slate-100">
              Model<span className="font-light opacity-80 text-blue-600 dark:text-blue-400">Arena</span>
            </h1>
          </div>
          {/* Close button for Mobile AND Desktop */}
          <button 
            className="text-slate-500 p-2 rounded-md hover:bg-slate-100 dark:hover:bg-slate-800"
            onClick={onCloseMobile}
            title="Close sidebar"
          >
            <PanelLeftClose size={20} className="hidden md:block" />
            <X size={20} className="md:hidden" />
          </button>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-start gap-3 bg-blue-600 hover:bg-blue-700 text-white p-3 rounded-xl transition-all shadow-md active:scale-95 border border-transparent font-medium"
        >
          <Plus size={18} />
          New Chat
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto mt-4 px-3 space-y-1 custom-scrollbar">
        <div className="px-3 pb-2 text-xs font-semibold text-slate-400 dark:text-slate-500 uppercase tracking-wider">
          Recent
        </div>
        {chatHistory.map(chat => (
          <button
            key={chat.id}
            onClick={() => onSelectChat(chat.id)}
            className={`w-full text-left p-3 flex items-center gap-3 rounded-lg text-sm transition-all truncate hover:bg-slate-100 dark:hover:bg-slate-800 group
              ${activeChatId === chat.id 
                ? 'bg-slate-100 dark:bg-slate-800 text-slate-900 dark:text-white font-medium border border-slate-200 dark:border-slate-700' 
                : 'text-slate-600 dark:text-slate-400 border border-transparent'
              }`}
          >
            <MessageSquare size={16} className={`${activeChatId === chat.id ? 'text-blue-500' : 'text-slate-400 group-hover:text-slate-500 dark:group-hover:text-slate-300'}`} />
            <span className="truncate">{chat.title}</span>
          </button>
        ))}
      </div>

      {/* Footer (Theme & Profile) */}
      <div className="p-4 border-t border-slate-200 dark:border-slate-800 mt-auto space-y-2">
        {/* Theme Toggle */}
        <button 
          onClick={toggleTheme}
          className="w-full flex items-center justify-between p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-600 dark:text-slate-300 transition-colors border border-transparent"
        >
          <div className="flex items-center gap-3 text-sm font-medium">
            {theme === 'dark' ? <Moon size={18} /> : <Sun size={18} />}
            {theme === 'dark' ? 'Dark Mode' : 'Light Mode'}
          </div>
          <div className="w-10 h-6 bg-slate-200 dark:bg-slate-700 rounded-full relative transition-colors shadow-inner">
            <div className={`absolute top-1 bottom-1 w-4 bg-white dark:bg-slate-200 rounded-full transition-transform shadow-sm
              ${theme === 'dark' ? 'right-1 translate-x-0' : 'left-1 translate-x-0'}
            `}></div>
          </div>
        </button>

        {/* Profile Card */}
        <button className="w-full flex items-center gap-3 p-3 rounded-xl hover:bg-slate-100 dark:hover:bg-slate-800 text-slate-800 dark:text-slate-200 transition-colors border border-transparent text-left">
          <div className="w-9 h-9 rounded-full bg-blue-100 dark:bg-blue-900/60 border border-blue-200 dark:border-blue-800/80 overflow-hidden flex items-center justify-center shrink-0 text-blue-600 dark:text-blue-400">
            <img src="https://ui-avatars.com/api/?name=Jane+Doe&background=2563eb&color=fff&bold=true" alt="User Profile" className="w-full h-full object-cover" />
          </div>
          <div className="flex-1 truncate">
            <div className="font-semibold text-sm">Jane Doe</div>
            <div className="text-xs text-slate-500 dark:text-slate-400">Pro Member</div>
          </div>
        </button>
      </div>

    </div>
  );
}

export default Sidebar;
