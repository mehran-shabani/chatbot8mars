import { create } from 'zustand';
import { Agent, AIModel, ChatHistory } from '../types';

interface AgentState {
  agents: Agent[];
  selectedAgent: Agent | null;
  chatHistories: ChatHistory[];
  availableModels: AIModel[];
  isLoading: boolean;
  error: string | null;
  createAgent: (websiteUrl: string, instructions: string, modelId: string) => Promise<void>;
  selectAgent: (agentId: string) => void;
  loadChatHistory: (agentId: string) => Promise<void>;
  deleteAgent: (agentId: string) => Promise<void>;
}

export const useAgentStore = create<AgentState>((set, get) => ({
  agents: [],
  selectedAgent: null,
  chatHistories: [],
  availableModels: [
    {
      id: 'gpt-4',
      name: 'GPT-4',
      provider: 'openai',
      isAvailable: true,
      requiredPlan: 'enterprise'
    },
    {
      id: 'gemini-pro',
      name: 'Gemini Pro',
      provider: 'google',
      isAvailable: true,
      requiredPlan: 'basic'
    },
    {
      id: 'claude-2',
      name: 'Claude 2',
      provider: 'anthropic',
      isAvailable: true,
      requiredPlan: 'pro'
    }
  ],
  isLoading: false,
  error: null,

  createAgent: async (websiteUrl, instructions, modelId) => {
    set({ isLoading: true, error: null });
    try {
      // API call would go here
      const newAgent: Agent = {
        id: Date.now().toString(),
        name: `Agent for ${new URL(websiteUrl).hostname}`,
        websiteUrl,
        instructions,
        model: get().availableModels.find(m => m.id === modelId)!,
        createdAt: new Date().toISOString()
      };
      set(state => ({
        agents: [...state.agents, newAgent],
        selectedAgent: newAgent
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  selectAgent: (agentId) => {
    const agent = get().agents.find(a => a.id === agentId);
    set({ selectedAgent: agent || null });
  },

  loadChatHistory: async (agentId) => {
    set({ isLoading: true, error: null });
    try {
      // API call would go here
      // For now, using mock data
      const history: ChatHistory = {
        id: Date.now().toString(),
        agentId,
        title: 'New Conversation',
        lastMessage: '',
        timestamp: new Date().toISOString(),
        messages: []
      };
      set(state => ({
        chatHistories: [...state.chatHistories, history]
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  deleteAgent: async (agentId) => {
    set({ isLoading: true, error: null });
    try {
      // API call would go here
      set(state => ({
        agents: state.agents.filter(a => a.id !== agentId),
        selectedAgent: state.selectedAgent?.id === agentId ? null : state.selectedAgent
      }));
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  }
}));