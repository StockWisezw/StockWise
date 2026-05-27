import { create } from 'zustand';

export type PlanTier = 'free' | 'starter' | 'sme' | 'enterprise';
export type SubscriptionStatus = 'trialing' | 'active' | 'past_due' | 'canceled' | 'unpaid' | 'suspended';

interface SubscriptionState {
  tier: PlanTier;
  status: SubscriptionStatus;
  trialEndsAt: string | null;
  features: {
    maxBranches: number;
    maxUsers: number;
    hasPrioritySupport: boolean;
  };
  
  // Actions
  setSubscription: (tier: PlanTier, status: SubscriptionStatus) => void;
  checkFeatureAccess: (feature: keyof SubscriptionState['features']) => any;
}

const getFeaturesForTier = (tier: PlanTier) => {
  switch (tier) {
    case 'starter':
      return { maxBranches: 1, maxUsers: 3, hasPrioritySupport: false };
    case 'sme':
      return { maxBranches: 3, maxUsers: 10, hasPrioritySupport: false };
    case 'enterprise':
      return { maxBranches: 999, maxUsers: 999, hasPrioritySupport: true };
    default:
      return { maxBranches: 0, maxUsers: 1, hasPrioritySupport: false }; // Free / Expired
  }
};

export const useSubscription = create<SubscriptionState>((set, get) => ({
  tier: 'enterprise', // Developer mode unlocked everything
  status: 'active',
  trialEndsAt: null,
  features: getFeaturesForTier('enterprise'),

  setSubscription: (tier, status) => set({ 
    tier, 
    status,
    features: getFeaturesForTier(tier)
  }),

  // Helper to check capabilities in UI
  checkFeatureAccess: (feature) => {
    return get().features[feature];
  }
}));
