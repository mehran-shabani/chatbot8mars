import React from 'react';

import { User, Bot, AlertCircle } from 'lucide-react';

import { motion } from 'framer-motion';



interface ChatMessageProps {

  message: string;

  isBot: boolean;

  timestamp: string;

  status?: 'sending' | 'sent' | 'error';

}



export function ChatMessage({ message, isBot, timestamp, status }: ChatMessageProps) {

  return (

    <motion.div

      initial={{ opacity: 0, y: 20 }}

      animate={{ opacity: 1, y: 0 }}

      transition={{ duration: 0.3 }}

      className={`flex ${isBot ? 'justify-start' : 'justify-end'} mb-4`}

    >

      <div className={`flex ${isBot ? 'flex-row' : 'flex-row-reverse'} max-w-[80%] items-start gap-3`}>

        <motion.div

          initial={{ scale: 0 }}

          animate={{ scale: 1 }}

          transition={{ type: "spring", stiffness: 200 }}

          className={`w-10 h-10 rounded-full flex items-center justify-center ${

            isBot ? 'bg-gradient-to-br from-blue-500 to-blue-600' : 'bg-gradient-to-br from-green-500 to-green-600'

          } shadow-lg`}

        >

          {isBot ? (

            <Bot size={24} className="text-white" />

          ) : (

            <User size={24} className="text-white" />

          )}

        </motion.div>

        <div className="flex-1">

          <div

            className={`rounded-2xl px-6 py-3 shadow-sm ${

              isBot

                ? 'bg-white text-gray-800'

                : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white'

            } ${status === 'error' ? 'border-2 border-red-300' : ''}`}

          >

            <p className="text-sm leading-relaxed">{message}</p>

            {status === 'error' && (

              <div className="flex items-center gap-1 mt-2 text-red-500 text-xs">

                <AlertCircle size={12} />

                <span>Failed to send message</span>

              </div>

            )}

          </div>

          <div className="flex items-center gap-2 mt-1 px-2">

            <span className="text-xs text-gray-500">{timestamp}</span>

            {status === 'sending' && (

              <motion.span

                initial={{ opacity: 0 }}

                animate={{ opacity: 1 }}

                className="text-xs text-blue-500 flex items-center gap-1"

              >

                <span className="relative flex h-2 w-2">

                  <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-blue-400 opacity-75"></span>

                  <span className="relative inline-flex rounded-full h-2 w-2 bg-blue-500"></span>

                </span>

                Sending...

              </motion.span>

            )}

          </div>

        </div>

      </div>

    </motion.div>

  );

}

