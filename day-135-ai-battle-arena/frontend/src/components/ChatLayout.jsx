import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MOCK_CHAT_HISTORY } from '../data/mockData';
import { Menu, PanelLeftOpen, LogOut } from 'lucide-react';
import axios from 'axios';
import { useAuth } from '../context/AuthContext';

function ChatLayout() {
  const [chatHistory, setChatHistory] = useState([
    {
      id: 'chat-initial',
      title: 'New Conversation',
      messages: []
    },
    ...MOCK_CHAT_HISTORY
  ]);
  const [activeChatId, setActiveChatId] = useState('chat-initial');
  
  const { user, logout } = useAuth();
  
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

  const handleNewChat = () => {
    const newChat = {
      id: `chat-${Date.now()}`,
      title: 'New Conversation',
      messages: []
    };
    setChatHistory([newChat, ...chatHistory]);
    setActiveChatId(newChat.id);
    if (window.innerWidth < 768) setIsSidebarOpen(false);
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

    const updatedHistory = chatHistory.map(chat => {
      if (chat.id === activeChatId) {
        return {
          ...chat,
          title: chat.messages.length === 0 ? text.substring(0, 30) + '...' : chat.title,
          messages: [...chat.messages, newInteraction]
        };
      }
      return chat;
    });

    setChatHistory(updatedHistory);
    setIsWaiting(true);

    try {
      // Make the actual API call
      const response = await axios.post("http://localhost:3000/invoke", {
        input: text
      });
      const data = response.data;

      // Update the chat history with the real response
      setChatHistory(currentHistory => {
        return currentHistory.map(chat => {
          if (chat.id === activeChatId) {
            const updatedMessages = [...chat.messages];
            const latestIndex = updatedMessages.length - 1;
            
            // Populate actual responses from the backend
            updatedMessages[latestIndex] = {
              ...updatedMessages[latestIndex],
              ...data.result
            };
            return { ...chat, messages: updatedMessages };
          }
          return chat;
        });
      });
    } catch (error) {
      console.error("Failed to fetch AI response:", error);
      // Optional: Handle error state in UI here if needed
    } finally {
      setIsWaiting(false);
    }
  };

  return (
    <div className="flex h-screen bg-[#060e20] text-[#dee5ff] overflow-hidden md:flex-row relative">
      
      {/* Mobile Sidebar Overlay */}
      {isSidebarOpen && (
        <div 
          className="md:hidden fixed inset-0 bg-black/60 z-20 backdrop-blur-sm"
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
          onCloseMobile={() => setIsSidebarOpen(false)}
        />
      </div>

      {/* Main Content */}
      <div className="flex-1 flex flex-col h-screen min-w-0 transition-all duration-300">
        
        {/* Top Bar for Mobile AND Desktop (when Sidebar is closed) */}
        <div className={`
          flex items-center p-4 bg-[#06122d] border-b border-[#12244e] z-10 transition-all
          ${(!isSidebarOpen || window.innerWidth < 768) ? 'justify-between md:justify-start' : 'hidden'}
        `}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-[#939eb5] hover:text-[#7bd0ff] hover:bg-[#00225a] rounded-lg transition-colors flex items-center justify-center"
            title="Open Sidebar"
          >
            <Menu size={24} className="md:hidden" />
            <PanelLeftOpen size={20} className="hidden md:block" />
          </button>
          <div className="font-extrabold text-lg tracking-tighter text-[#dee5ff] md:ml-4">
            AI Battle <span className="font-medium text-[#7bd0ff]">Arena</span>
          </div>
          
          <div className="flex-1"></div>
          
          {user && (
            <div className="hidden md:flex items-center gap-3 mr-4">
              <span className="text-sm text-[#939eb5] font-medium tracking-wide">
                {user.name}
              </span>
            </div>
          )}
          
          <button 
            onClick={logout}
            className="p-2 text-[#939eb5] hover:text-[#ff9993] hover:bg-[#7f2927]/30 rounded-lg transition-colors flex items-center justify-center gap-2"
            title="Log Out"
          >
            <span className="hidden md:block text-sm font-medium">Logout</span>
            <LogOut size={18} />
          </button>
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
