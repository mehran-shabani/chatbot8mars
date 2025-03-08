import React, { useState, useEffect } from 'react';
import { ChatMessage } from './components/ChatMessage';
import { ChatInput } from './components/ChatInput';
import { SplashScreen } from './components/SplashScreen';
import { Bot, LogOut } from 'lucide-react';
import { useAuthStore } from './store/authStore';
import { sendMessage } from './api/chat';
import { Message } from './types';
import { motion, AnimatePresence } from 'framer-motion';

function App() {
  const { isAuthenticated, user, logout } = useAuthStore();
  const [showSplash, setShowSplash] = useState(true);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: 1,
      text: "Hello! I'm your AI assistant. How can I help you today?",
      isBot: true,
      timestamp: new Date().toLocaleTimeString(),
    },
  ]);
  const [currentDocumentId, setCurrentDocumentId] = useState<string | undefined>();
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    const timer = setTimeout(() => {
      setShowSplash(false);
    }, 2000);
    return () => clearTimeout(timer);
  }, []);

  const handleSendMessage = async (text: string) => {
    const newMessage: Message = {
      id: messages.length + 1,
      text,
      isBot: false,
      timestamp: new Date().toLocaleTimeString(),
      status: 'sending',
    };
    
    setMessages((prev) => [...prev, newMessage]);
    setIsLoading(true);

    try {
      const reply = await sendMessage(text, currentDocumentId);
      const botResponse: Message = {
        id: messages.length + 2,
        text: reply,
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
        status: 'sent',
      };
      setMessages((prev) => [...prev, botResponse]);
    } catch (error) {
      setMessages((prev) =>
        prev.map((msg) =>
          msg.id === newMessage.id ? { ...msg, status: 'error' } : msg
        )
      );
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileUpload = (documentId: string) => {
    setCurrentDocumentId(documentId);
    setMessages((prev) => [
      ...prev,
      {
        id: messages.length + 1,
        text: "PDF uploaded successfully! You can now ask questions about its content.",
        isBot: true,
        timestamp: new Date().toLocaleTimeString(),
      },
    ]);
  };

  if (!isAuthenticated) {
    return (
      <div className="flex items-center justify-center min-h-screen bg-gradient-to-br from-blue-600 to-indigo-900">
        <motion.div
          initial={{ scale: 0.9, opacity: 0 }}
          animate={{ scale: 1, opacity: 1 }}
          className="bg-white p-8 rounded-2xl shadow-2xl max-w-md w-full mx-4"
        >
          <div className="text-center mb-8">
            <div className="w-16 h-16 rounded-full bg-blue-100 flex items-center justify-center mx-auto mb-4">
              <Bot size={32} className="text-blue-600" />
            </div>
            <h1 className="text-2xl font-bold text-gray-900">Welcome to ChatCraft</h1>
            <p className="text-gray-600 mt-2">Please log in to continue</p>
          </div>
          {/* Add your login form component here */}
        </motion.div>
      </div>
    );
  }

  return (
    <>
      <AnimatePresence>
        {showSplash && <SplashScreen />}
      </AnimatePresence>

      <div className="flex flex-col h-screen bg-gray-50">
        {/* Header */}
        <motion.div
          initial={{ y: -50, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          className="bg-white shadow-sm p-4 flex items-center justify-between"
        >
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-full bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center shadow-lg">
              <Bot size={24} className="text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold bg-gradient-to-r from-blue-600 to-indigo-600 text-transparent bg-clip-text">
                ChatCraft
              </h1>
              <p className="text-sm text-gray-500">AI Document Assistant</p>
            </div>
          </div>
          <div className="flex items-center gap-4">
            {user && (
              <span className="text-sm text-gray-600">
                Welcome, {user.name}
              </span>
            )}
            <motion.button
              whileHover={{ scale: 1.05 }}
              whileTap={{ scale: 0.95 }}
              onClick={() => logout()}
              className="p-2 rounded-full hover:bg-gray-100 text-gray-600 transition-colors"
            >
              <LogOut size={20} />
            </motion.button>
          </div>
        </motion.div>

        {/* Chat Messages */}
        <div className="flex-1 overflow-y-auto p-4">
          <div className="max-w-3xl mx-auto">
            <AnimatePresence initial={false}>
              {messages.map((message) => (
                <ChatMessage
                  key={message.id}
                  message={message.text}
                  isBot={message.isBot}
                  timestamp={message.timestamp}
                  status={message.status}
                />
              ))}
            </AnimatePresence>
            {isLoading && (
              <motion.div
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="flex justify-start mb-4"
              >
                <div className="bg-white rounded-full px-4 py-2 shadow-sm">
                  <div className="flex gap-1">
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '0ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '150ms' }} />
                    <div className="w-2 h-2 bg-blue-500 rounded-full animate-bounce" style={{ animationDelay: '300ms' }} />
                  </div>
                </div>
              </motion.div>
            )}
          </div>
        </div>

        {/* Chat Input */}
        <div className="max-w-3xl mx-auto w-full">
          <ChatInput
            onSendMessage={handleSendMessage}
            onFileUpload={handleFileUpload}
            isLoading={isLoading}
          />
        </div>
      </div>
    </>
  );
}

export default App;