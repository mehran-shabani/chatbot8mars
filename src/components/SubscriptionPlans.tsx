import React from 'react';
import { motion } from 'framer-motion';
import { Check, Star } from 'lucide-react';
import { useSubscriptionStore } from '../store/subscriptionStore';
import type { SubscriptionTier } from '../types';

export function SubscriptionPlans() {
  const { plans, currentPlan, subscribeToPlan, isLoading } = useSubscriptionStore();

  const handleSubscribe = async (tier: SubscriptionTier) => {
    await subscribeToPlan(tier);
  };

  return (
    <div className="py-12 px-4">
      <div className="max-w-7xl mx-auto">
        <div className="text-center mb-12">
          <h2 className="text-3xl font-bold text-gray-900 mb-4">Choose Your Plan</h2>
          <p className="text-lg text-gray-600">Select the perfect plan for your business needs</p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {plans.map((plan) => (
            <motion.div
              key={plan.tier}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              whileHover={{ scale: 1.02 }}
              className={`rounded-2xl p-8 ${
                plan.tier === 'enterprise'
                  ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white'
                  : 'bg-white'
              } shadow-xl`}
            >
              <div className="flex items-center justify-between mb-8">
                <h3 className={`text-2xl font-bold ${
                  plan.tier === 'enterprise' ? 'text-white' : 'text-gray-900'
                }`}>
                  {plan.tier.charAt(0).toUpperCase() + plan.tier.slice(1)}
                </h3>
                {plan.tier === 'enterprise' && (
                  <Star className="text-yellow-300" size={24} />
                )}
              </div>

              <div className="mb-8">
                <span className="text-4xl font-bold">${plan.price}</span>
                <span className={`${
                  plan.tier === 'enterprise' ? 'text-blue-100' : 'text-gray-500'
                }`}>/{plan.duration} month{plan.duration > 1 ? 's' : ''}</span>
              </div>

              <ul className="space-y-4 mb-8">
                {plan.features.map((feature, index) => (
                  <li key={index} className="flex items-center gap-3">
                    <Check size={20} className={
                      plan.tier === 'enterprise' ? 'text-blue-200' : 'text-blue-500'
                    } />
                    <span className={
                      plan.tier === 'enterprise' ? 'text-blue-50' : 'text-gray-600'
                    }>{feature}</span>
                  </li>
                ))}
              </ul>

              <motion.button
                whileHover={{ scale: 1.05 }}
                whileTap={{ scale: 0.95 }}
                onClick={() => handleSubscribe(plan.tier)}
                disabled={isLoading || currentPlan?.tier === plan.tier}
                className={`w-full py-3 px-6 rounded-lg font-medium transition-shadow ${
                  plan.tier === 'enterprise'
                    ? 'bg-white text-blue-600 hover:shadow-lg'
                    : 'bg-gradient-to-r from-blue-500 to-blue-600 text-white hover:shadow-lg'
                } disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {currentPlan?.tier === plan.tier ? 'Current Plan' : 'Subscribe Now'}
              </motion.button>
            </motion.div>
          ))}
        </div>
      </div>
    </div>
  );
}