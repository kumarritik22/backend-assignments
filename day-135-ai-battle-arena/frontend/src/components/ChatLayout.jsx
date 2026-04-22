import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { Menu, PanelLeftOpen, LogOut } from 'lucide-react';
import api from '../api';
import { useAuth } from '../context/AuthContext';

function ChatLayout() {
  const { user, logout } = useAuth();
  
  const [chatHistory, setChatHistory] = useState([]);
  const [activeChatId, setActiveChatId] = useState(null);
  
  // Fetch chats on mount
  useEffect(() => {
    const fetchChats = async () => {
      try {
        const res = await api.get('/chats');
        if (res.data.success && res.data.chats.length > 0) {
          setChatHistory(res.data.chats);
          setActiveChatId(res.data.chats[0].id);
        } else {
          // If no chats exist, implicitly create one using a direct POST
          const createRes = await api.post('/chats', { title: 'New Conversation' });
          if (createRes.data.success) {
            setChatHistory([createRes.data.chat]);
            setActiveChatId(createRes.data.chat.id);
          }
        }
      } catch (err) {
        console.error("Failed to fetch chats", err);
      }
    };
    if (user) fetchChats();
  }, [user]);
  
  // Use essentially a global toggle for sidebar
  const [isSidebarOpen, setIsSidebarOpen] = useState(false); 
  
  // Initialize open on desktop when first mounted
  useEffect(() => {
    if (window.innerWidth >= 768) {
      setIsSidebarOpen(true);
    }
  }, []);

  const [isWaiting, setIsWaiting] = useState(false);

  const activeChat = chatHistory.find(c => c.id === activeChatId);

  const handleDeleteChat = async (e, id) => {
    e.stopPropagation();
    try {
      const res = await api.delete(`/chats/${id}`);
      if (res.data.success) {
        const updatedHistory = chatHistory.filter(chat => chat.id !== id);
        let newActiveId = null;
        if (activeChatId === id) {
          if (updatedHistory.length > 0) {
            newActiveId = updatedHistory[0].id;
          } else {
            handleNewChat();
            return;
          }
        } else {
          newActiveId = activeChatId;
        }
        setChatHistory(updatedHistory);
        if (newActiveId) setActiveChatId(newActiveId);
      }
    } catch (err) {
      console.error("Failed to delete chat", err);
    }
  };

  const handleNewChat = async () => {
    try {
      const res = await api.post('/chats', { title: 'New Conversation' });
      if (res.data.success) {
        const newChat = res.data.chat;
        setChatHistory(curr => [newChat, ...curr]);
        setActiveChatId(newChat.id);
        if (window.innerWidth < 768) setIsSidebarOpen(false);
      }
    } catch (err) {
      console.error("Failed to create chat", err);
    }
  };

  const handleSelectChat = (id) => {
    setActiveChatId(id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
  };

  const handleSendMessage = async (text) => {
    if (!activeChatId) return;

    // Add user message optimistically
    const userMessageId = `msg-${Date.now()}`;
    const newInteraction = {
      id: userMessageId,
      problem: text,
      solution_1: "",
      solution_2: "",
      judge: null
    };

    setChatHistory(currentHistory => currentHistory.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          title: chat.messages.length === 0 ? text.substring(0, 30) + (text.length > 30 ? '...' : '') : chat.title,
          messages: [...chat.messages, newInteraction]
        };
      }
      return chat;
    }));

    setIsWaiting(true);

    try {
      // Make the actual API call
      const response = await api.post(`/chats/${activeChatId}/messages`, {
        input: text,
        messageId: userMessageId
      });
      const data = response.data;

      // Update the chat history with the real response
      setChatHistory(currentHistory => {
        return currentHistory.map(chat => {
          if (chat.id === activeChatId) {
            const updatedMessages = [...chat.messages];
            const latestIndex = updatedMessages.length - 1;
            
            // Re-map the exact model response from DB format
            updatedMessages[latestIndex] = data.message;
            return { ...chat, messages: updatedMessages, title: data.chatTitle || chat.title };
          }
          return chat;
        });
      });
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      const errorMessage = error.response?.data?.message || "AI models are currently overwhelmed with requests. Please try your request again shortly.";
      setChatHistory(currentHistory => {
        return currentHistory.map(chat => {
          if (chat.id === activeChatId) {
            const updatedMessages = [...chat.messages];
            const latestIndex = updatedMessages.length - 1;
            updatedMessages[latestIndex] = {
              ...updatedMessages[latestIndex],
              judge: { error: true, message: errorMessage },
              solution_1: "Request failed due to excessive load.",
              solution_2: "Request failed due to excessive load."
            };
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        });
      });
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div 
      className="flex h-screen overflow-hidden md:flex-row relative"
      style={{ backgroundColor: 'var(--bg-base)', color: 'var(--text-primary)' }}
    >
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 z-20 backdrop-blur-sm"
          style={{ backgroundColor: 'var(--bg-overlay)' }}
          onClick={() => setIsSidebarOpen(false)}
        />
      )}

      {/* Sidebar - Positioned fixed for Mobile, relative for Desktop */}
      <div 
        className={`
          fixed md:relative z-30 h-full transition-all duration-300 ease-in-out shrink-0
          ${isSidebarOpen ? 'translate-x-0 w-72' : '-translate-x-full md:-ml-72 w-72'}
        `}
      >
        <Sidebar 
          chatHistory={chatHistory} 
          activeChatId={activeChatId}
          onSelectChat={handleSelectChat}
          onNewChat={handleNewChat}
          onDeleteChat={handleDeleteChat}
          onCloseMobile={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0 transition-all duration-300">
        
        {/* Top Bar for Mobile AND Desktop (when Sidebar is closed) */}
        <div 
          className={`
            flex items-center p-4 z-10 transition-all
            ${(!isSidebarOpen || window.innerWidth < 768) ? 'justify-between md:justify-start' : 'hidden'}
          `}
          style={{ 
            backgroundColor: 'var(--bg-surface)', 
            borderBottom: '1px solid var(--border)' 
          }}
        >
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 rounded-lg transition-colors flex items-center justify-center"
            style={{ color: 'var(--text-secondary)' }}
            title="Open Sidebar"
            onMouseEnter={e => { e.currentTarget.style.color = 'var(--accent)'; e.currentTarget.style.backgroundColor = 'var(--bg-elevated)'; }}
            onMouseLeave={e => { e.currentTarget.style.color = 'var(--text-secondary)'; e.currentTarget.style.backgroundColor = 'transparent'; }}
          >
            <Menu size={24} className="md:hidden" />
            <PanelLeftOpen size={20} className="hidden md:block" />
          </button>
          <div className="font-extrabold text-lg tracking-tighter md:ml-4" style={{ color: 'var(--text-primary)' }}>
            AI Battle <span className="font-medium" style={{ color: 'var(--accent)' }}>Arena</span>
          </div>
          
        </div>
        
        {/* Desktop floating button if top bar is completely hidden */}
        {isSidebarOpen && (
          <div className="hidden md:flex items-center p-4 absolute top-0 left-0 z-10 select-none pointer-events-none">
            {/* The sidebar takes this space naturally, so no toggle button needed here */}
          </div>
        )}

        {/* Chat Area */}
        <ChatWindow 
          messages={activeChat?.messages || []} 
          onSendMessage={handleSendMessage}
          isWaiting={isWaiting}
        />
      </div>
    </div>
  );
}

export default ChatLayout;
