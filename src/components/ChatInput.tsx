import React, { useState, useRef } from 'react';
import { Send, Upload } from 'lucide-react';
import { uploadPdf } from '../api/chat';
import { motion } from 'framer-motion';

interface ChatInputProps {
  onSendMessage: (message: string) => void;
  onFileUpload: (documentId: string) => void;
  isLoading: boolean;
}

export function ChatInput({ onSendMessage, onFileUpload, isLoading }: ChatInputProps) {
  const [message, setMessage] = useState('');
  const [isUploading, setIsUploading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (message.trim() && !isLoading) {
      onSendMessage(message);
      setMessage('');
    }
  };

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.type === 'application/pdf') {
      setIsUploading(true);
      try {
        const documentId = await uploadPdf(file);
        onFileUpload(documentId);
      } catch (error) {
        console.error('Error uploading PDF:', error);
      } finally {
        setIsUploading(false);
      }
    }
  };

  return (
    <motion.form
      initial={{ y: 50, opacity: 0 }}
      animate={{ y: 0, opacity: 1 }}
      transition={{ duration: 0.3 }}
      onSubmit={handleSubmit}
      className="flex items-center gap-3 border-t p-4 bg-white shadow-lg"
    >
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileUpload}
        accept=".pdf"
        className="hidden"
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="button"
        onClick={() => fileInputRef.current?.click()}
        className="rounded-full p-3 text-gray-500 hover:bg-gray-100 transition-colors relative overflow-hidden"
        disabled={isUploading}
      >
        <Upload size={20} />
        {isUploading && (
          <motion.div
            className="absolute inset-0 bg-blue-500/10"
            initial={{ width: '0%' }}
            animate={{ width: '100%' }}
            transition={{ duration: 1, repeat: Infinity }}
          />
        )}
      </motion.button>
      <input
        type="text"
        value={message}
        onChange={(e) => setMessage(e.target.value)}
        placeholder={isUploading ? 'Uploading PDF...' : 'Type your message...'}
        className="flex-1 rounded-full border border-gray-200 px-6 py-3 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent bg-gray-50 placeholder-gray-400"
        disabled={isLoading || isUploading}
      />
      <motion.button
        whileHover={{ scale: 1.05 }}
        whileTap={{ scale: 0.95 }}
        type="submit"
        className="rounded-full bg-gradient-to-r from-blue-500 to-blue-600 p-3 text-white shadow-md hover:shadow-lg transition-shadow disabled:opacity-50 disabled:cursor-not-allowed"
        disabled={!message.trim() || isLoading || isUploading}
      >
        <Send size={20} />
      </motion.button>
    </motion.form>
  );
}