export interface User {
  id: string;
  email: string;
  name: string;
  subscription?: SubscriptionPlan;
}

export interface Message {
  id: number;
  text: string;
  isBot: boolean;
  timestamp: string;
  status?: 'sending' | 'sent' | 'error';
  modelId?: string;
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface ApiError {
  message: string;
  code?: string;
}

export interface Agent {
  id: string;
  name: string;
  websiteUrl: string;
  instructions: string;
  model: AIModel;
  createdAt: string;
}

export interface AIModel {
  id: string;
  name: string;
  provider: 'openai' | 'anthropic' | 'google';
  isAvailable: boolean;
  requiredPlan: SubscriptionTier;
}

export interface ChatHistory {
  id: string;
  agentId: string;
  title: string;
  lastMessage: string;
  timestamp: string;
  messages: Message[];
}

export type SubscriptionTier = 'basic' | 'pro' | 'enterprise';

export interface SubscriptionPlan {
  tier: SubscriptionTier;
  price: number;
  duration: number; // in months
  features: string[];
  agentsLimit: number;
  modelAccess: string[];
  historyRetention: number; // in months
}