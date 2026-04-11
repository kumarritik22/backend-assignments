import React, { useState, useEffect } from 'react';
import Sidebar from './Sidebar';
import ChatWindow from './ChatWindow';
import { MOCK_CHAT_HISTORY } from '../data/mockData';
import { Menu, PanelLeftOpen } from 'lucide-react';
import axios from 'axios';

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
    <div className="flex h-screen bg-slate-100 dark:bg-[#060e20] overflow-hidden md:flex-row relative">
      
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
          flex items-center p-4 bg-white dark:bg-[#06122d] border-b border-slate-200 dark:border-slate-800 z-10 transition-all
          ${(!isSidebarOpen || window.innerWidth < 768) ? 'justify-between md:justify-start' : 'hidden'}
        `}>
          <button 
            onClick={() => setIsSidebarOpen(true)}
            className="p-2 -ml-2 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-lg transition-colors flex items-center justify-center"
            title="Open Sidebar"
          >
            <Menu size={24} className="md:hidden" />
            <PanelLeftOpen size={20} className="hidden md:block" />
          </button>
          <div className="font-bold text-lg text-slate-800 dark:text-slate-100 md:ml-4">
            Model<span className="font-light text-blue-600">Arena</span>
          </div>
          <div className="w-8 md:hidden"></div> {/* Spacer for centering on mobile */}
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
