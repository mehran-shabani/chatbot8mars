import React, { useState } from 'react';
import { motion } from 'framer-motion';
import { Bot, Globe, FileText, Check } from 'lucide-react';
import { useAgentStore } from '../store/agentStore';
import { useSubscriptionStore } from '../store/subscriptionStore';
import { AIModel } from '../types';

export function AgentCreator() {
  const { availableModels, createAgent, isLoading } = useAgentStore();
  const { currentPlan } = useSubscriptionStore();
  const [websiteUrl, setWebsiteUrl] = useState('');
  const [instructions, setInstructions] = useState('');
  const [selectedModel, setSelectedModel] = useState<string>('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (websiteUrl && instructions && selectedModel) {
      await createAgent(websiteUrl, instructions, selectedModel);
    }
  };

  const getAvailableModels = () => {
    if (!currentPlan) return availableModels.filter(m => m.requiredPlan === 'basic');
    return availableModels.filter(m => 
      currentPlan.modelAccess.includes(m.id)
    );
  };

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="bg-white rounded-2xl shadow-xl p-6 max-w-2xl mx-auto"
    >
      <div className="flex items-center gap-3 mb-6">
        <div className="w-12 h-12 rounded-full bg-blue-100 flex items-center justify-center">
          <Bot size={24} className="text-blue-600" />
        </div>
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Create New Agent</h2>
          <p className="text-gray-500">Train an AI agent for your e-commerce site</p>
        </div>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Website URL
          </label>
          <div className="relative">
            <Globe size={20} className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400" />
            <input
              type="url"
              value={websiteUrl}
              onChange={(e) => setWebsiteUrl(e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2"
              placeholder="https://your-store.com"
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Instructions
          </label>
          <div className="relative">
            <FileText size={20} className="absolute left-3 top-3 text-gray-400" />
            <textarea
              value={instructions}
              onChange={(e) => setInstructions(e.target.value)}
              className="pl-10 w-full rounded-lg border border-gray-200 focus:ring-2 focus:ring-blue-500 focus:border-transparent py-2 h-32"
              placeholder="Provide instructions for your AI agent..."
              required
            />
          </div>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-2">
            Select AI Model
          </label>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {getAvailableModels().map((model: AIModel) => (
              <motion.button
                key={model.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                type="button"
                onClick={() => setSelectedModel(model.id)}
                className={`relative p-4 rounded-lg border ${
                  selectedModel === model.id
                    ? 'border-blue-500 bg-blue-50'
                    : 'border-gray-200 hover:border-blue-200'
                }`}
              >
                {selectedModel === model.id && (
                  <div className="absolute top-2 right-2">
                    <Check size={16} className="text-blue-500" />
                  </div>
                )}
                <h3 className="font-medium text-gray-900">{model.name}</h3>
                <p className="text-sm text-gray-500">{model.provider}</p>
              </motion.button>
            ))}
          </div>
        </div>

        <motion.button
          whileHover={{ scale: 1.02 }}
          whileTap={{ scale: 0.98 }}
          type="submit"
          className="w-full bg-gradient-to-r from-blue-500 to-blue-600 text-white rounded-lg py-3 font-medium shadow-md hover:shadow-lg transition-shadow disabled:opacity-50"
          disabled={isLoading || !websiteUrl || !instructions || !selectedModel}
        >
          {isLoading ? 'Creating Agent...' : 'Create Agent'}
        </motion.button>
      </form>
    </motion.div>
  );
}