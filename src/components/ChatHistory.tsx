import React from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { MessageSquare, Trash2, Clock, ChevronRight } from 'lucide-react';
import { format } from 'date-fns';
import { useAgentStore } from '../store/agentStore';
import type { ChatHistory as ChatHistoryType } from '../types';

export function ChatHistory() {
  const { chatHistories, selectedAgent, loadChatHistory } = useAgentStore();
  const [isOpen, setIsOpen] = React.useState(true);

  const filteredHistories = chatHistories.filter(
    history => history.agentId === selectedAgent?.id
  );

  const toggleSidebar = () => setIsOpen(!isOpen);

  return (
    <motion.div
      initial={{ x: -300 }}
      animate={{ x: isOpen ? 0 : -300 }}
      className="fixed left-0 top-0 h-screen bg-white shadow-xl z-10 flex"
    >
      <div className="w-80 h-full flex flex-col">
        <div className="p-4 border-b flex items-center justify-between">
          <div className="flex items-center gap-2">
            <MessageSquare size={20} className="text-blue-600" />
            <h2 className="font-semibold text-gray-900">Chat History</h2>
          </div>
        </div>

        <div className="flex-1 overflow-y-auto p-4">
          <AnimatePresence>
            {filteredHistories.map((history: ChatHistoryType) => (
              <motion.div
                key={history.id}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                className="mb-4"
              >
                <button
                  onClick={() => loadChatHistory(history.agentId)}
                  className="w-full text-left p-4 rounded-lg bg-gray-50 hover:bg-gray-100 transition-colors"
                >
                  <div className="flex items-center justify-between mb-2">
                    <h3 className="font-medium text-gray-900 truncate">
                      {history.title}
                    </h3>
                    <button className="text-gray-400 hover:text-red-500">
                      <Trash2 size={16} />
                    </button>
                  </div>
                  <p className="text-sm text-gray-500 truncate mb-2">
                    {history.lastMessage}
                  </p>
                  <div className="flex items-center gap-1 text-xs text-gray-400">
                    <Clock size={12} />
                    <span>
                      {format(new Date(history.timestamp), 'MMM d, yyyy h:mm a')}
                    </span>
                  </div>
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      </div>

      <button
        onClick={toggleSidebar}
        className="absolute -right-8 top-1/2 transform -translate-y-1/2 bg-white shadow-md rounded-r-lg p-2"
      >
        <motion.div
          animate={{ rotate: isOpen ? 0 : 180 }}
          transition={{ duration: 0.2 }}
        >
          <ChevronRight size={20} className="text-gray-600" />
        </motion.div>
      </button>
    </motion.div>
  );
}