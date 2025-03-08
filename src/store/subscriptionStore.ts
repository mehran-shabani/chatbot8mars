import { create } from 'zustand';
import { SubscriptionPlan, SubscriptionTier } from '../types';

interface SubscriptionState {
  plans: SubscriptionPlan[];
  currentPlan: SubscriptionPlan | null;
  isLoading: boolean;
  error: string | null;
  subscribeToPlan: (planId: SubscriptionTier) => Promise<void>;
  cancelSubscription: () => Promise<void>;
}

export const useSubscriptionStore = create<SubscriptionState>((set) => ({
  plans: [
    {
      tier: 'basic',
      price: 299,
      duration: 1,
      features: [
        'Access to Gemini Pro',
        '40 agents per month',
        '1 month chat history',
        'Basic support'
      ],
      agentsLimit: 40,
      modelAccess: ['gemini-pro'],
      historyRetention: 1
    },
    {
      tier: 'pro',
      price: 559,
      duration: 3,
      features: [
        'Access to Claude 2',
        'Unlimited agents',
        '3 months chat history',
        'Priority support',
        'Custom instructions'
      ],
      agentsLimit: -1,
      modelAccess: ['gemini-pro', 'claude-2'],
      historyRetention: 3
    },
    {
      tier: 'enterprise',
      price: 999,
      duration: 6,
      features: [
        'Access to all models including GPT-4',
        'Unlimited agents',
        '6 months chat history',
        'Premium support',
        'Custom instructions',
        'API access',
        'Advanced analytics'
      ],
      agentsLimit: -1,
      modelAccess: ['gemini-pro', 'claude-2', 'gpt-4'],
      historyRetention: 6
    }
  ],
  currentPlan: null,
  isLoading: false,
  error: null,

  subscribeToPlan: async (planId) => {
    set({ isLoading: true, error: null });
    try {
      // API call would go here
      const selectedPlan = get().plans.find(p => p.tier === planId);
      if (!selectedPlan) throw new Error('Invalid plan selected');
      set({ currentPlan: selectedPlan });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  },

  cancelSubscription: async () => {
    set({ isLoading: true, error: null });
    try {
      // API call would go here
      set({ currentPlan: null });
    } catch (error) {
      set({ error: (error as Error).message });
    } finally {
      set({ isLoading: false });
    }
  }
}));