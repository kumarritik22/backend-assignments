import React from 'react';
import { Plus, MessageSquare, Menu, X, PanelLeftClose, Swords, Trash2, User, LogOut, Sun, Moon } from 'lucide-react';
import { useAuth } from '../context/AuthContext';
import { useTheme } from '../hooks/useTheme';
function Sidebar({ 
  chatHistory, 
  activeChatId, 
  onSelectChat, 
  onNewChat,
  onDeleteChat,
  onCloseMobile
}) {
  const { user, logout } = useAuth();
  const { theme, toggleTheme } = useTheme();
  return (
    <div 
      className="w-72 h-screen flex flex-col transition-colors z-30 shadow-lg md:shadow-none absolute md:relative"
      style={{ 
        backgroundColor: 'var(--sidebar-bg)', 
        borderRight: '1px solid var(--border)' 
      }}
    >
      
      {/* Header */}
      <div className="p-4 md:p-6 pb-2 border-b border-transparent">
        <div className="flex items-center justify-between mb-6">
          <div className="flex items-center gap-2">
            <div 
              className="w-8 h-8 rounded-lg flex items-center justify-center shadow-md"
              style={{ backgroundColor: 'var(--accent-surface)', color: 'var(--accent)' }}
            >
              <Swords size={20} />
            </div>
            <h1 className="text-xl font-extrabold tracking-tighter" style={{ color: 'var(--text-primary)' }}>
              AI Battle <span className="font-medium" style={{ color: 'var(--accent)' }}>Arena</span>
            </h1>
          </div>
          {/* Close button for Mobile AND Desktop */}
          <button 
            className="p-2 rounded-md transition-colors"
            style={{ color: 'var(--text-secondary)' }}
            onClick={onCloseMobile}
            title="Close sidebar"
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <PanelLeftClose size={20} className="hidden md:block" />
            <X size={20} className="md:hidden" />
          </button>
        </div>

        <button 
          onClick={onNewChat}
          className="w-full flex items-center justify-start gap-3 p-3 rounded-xl transition-all hover:scale-[0.98] font-bold"
          style={{ 
            background: 'linear-gradient(135deg, var(--accent) 0%, var(--accent-surface) 100%)', 
            color: 'var(--accent-text)',
            boxShadow: `0 4px 12px var(--accent-glow)` 
          }}
        >
          <Plus size={18} />
          New Conversation
        </button>
      </div>

      {/* History List */}
      <div className="flex-1 overflow-y-auto mt-4 px-3 space-y-1 custom-scrollbar">
        <div 
          className="px-3 pb-2 text-[10px] font-bold uppercase tracking-widest"
          style={{ color: 'var(--sidebar-label)' }}
        >
          Recent Encounters
        </div>
        {chatHistory.filter(chat => chat.messages.length > 0 || chat.id === activeChatId).map(chat => (
          <div
            key={chat.id}
            className="w-full relative group rounded-lg transition-all"
            style={{
              backgroundColor: activeChatId === chat.id ? 'var(--sidebar-active)' : 'transparent',
              border: `1px solid ${activeChatId === chat.id ? 'var(--border)' : 'transparent'}`
            }}
            onMouseEnter={e => { if (activeChatId !== chat.id) e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; }}
            onMouseLeave={e => { if (activeChatId !== chat.id) e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <button
              onClick={() => onSelectChat(chat.id)}
              className="w-full text-left p-3 flex items-center gap-3 text-sm truncate rounded-lg"
              style={{ 
                color: activeChatId === chat.id ? 'var(--accent)' : 'var(--text-secondary)',
                fontWeight: activeChatId === chat.id ? 500 : 400
              }}
            >
              <MessageSquare size={16} style={{ color: activeChatId === chat.id ? 'var(--accent)' : 'var(--text-secondary)' }} />
              <span className="truncate pr-6">{chat.title}</span>
            </button>
            <button
              onClick={(e) => onDeleteChat ? onDeleteChat(e, chat.id) : null}
              className="absolute right-2 top-1/2 -translate-y-1/2 p-2 opacity-0 group-hover:opacity-100 transition-opacity z-10 rounded-md"
              title="Delete chat"
              style={{ color: 'var(--error-text)' }}
              onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; }}
              onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'transparent'; }}
            >
              <Trash2 size={14} />
            </button>
          </div>
        ))}
      </div>

      {/* Footer (Profile and Action) */}
      <div className="p-4 mt-auto" style={{ borderTop: '1px solid var(--border)' }}>
        <button
          onClick={toggleTheme}
          className="w-full mb-3 flex items-center justify-center gap-2 p-2.5 rounded-xl transition-colors font-medium shadow-sm"
          style={{ 
            color: 'var(--text-secondary)', 
            border: '1px solid transparent' 
          }}
          onMouseEnter={e => { e.currentTarget.style.color = 'var(--text-primary)'; e.currentTarget.style.backgroundColor = 'var(--sidebar-hover)'; }}
          onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
        >
          {theme === 'dark' ? <Sun size={16} /> : <Moon size={16} />}
          <span className="text-sm tracking-wide">{theme === 'dark' ? 'Light Mode' : 'Dark Mode'}</span>
        </button>
        {user && (
          <button 
            onClick={logout}
            className="w-full mb-3 flex items-center justify-center gap-2 p-2.5 rounded-xl transition-colors font-medium shadow-sm"
            style={{ 
              color: 'var(--error-text)', 
              backgroundColor: 'var(--error-surface)',
              border: `1px solid var(--error-border)`
            }}
            onMouseEnter={e => { e.currentTarget.style.backgroundColor = 'var(--error-bg)'; }}
            onMouseLeave={e => { e.currentTarget.style.backgroundColor = 'var(--error-surface)'; }}
          >
            <LogOut size={16} />
            <span className="text-sm tracking-wide">Secure Logout</span>
          </button>
        )}
        {/* Profile Card */}
        <div 
          className="w-full flex items-center gap-3 p-3 rounded-xl transition-colors border border-transparent text-left cursor-default"
          style={{ color: 'var(--text-primary)' }}
        >
          <div 
            className="w-9 h-9 rounded-full overflow-hidden flex items-center justify-center shrink-0"
            style={{ 
              backgroundColor: 'var(--accent-surface)', 
              border: '1px solid var(--accent)',
              opacity: 0.8,
              color: 'var(--accent)' 
            }}
          >
            {user ? (
              <span className="font-bold text-sm uppercase">{user.name.charAt(0)}</span>
            ) : (
              <User size={18} />
            )}
          </div>
          <div className="flex-1 truncate">
            <div className="font-semibold text-sm tracking-tight">{user ? user.name : 'Unknown Commander'}</div>
            <div className="text-[10px] uppercase font-bold tracking-wider" style={{ color: 'var(--accent)', opacity: 0.7 }}>Active Stream</div>
          </div>
        </div>
      </div>

    </div>
  );
}

export default Sidebar;
