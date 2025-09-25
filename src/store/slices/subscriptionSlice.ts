import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Plan {
  _id: string;
  id: string;
  name: string;
  description: string;
  price: number;
  currency: string;
  duration: number;
  durationType: string;
  features: string[];
  maxUsers: number;
  maxTransactions: number;
  maxWallets: number;
  maxCards: number;
  isActive: boolean;
  isPopular: boolean;
  planType: string;
  status: string;
  subscriberCount: number;
  formattedPrice: string;
  durationText: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy: string;
}

export interface PaymentDetails {
  stripeSubscriptionId: string | null;
  stripeCustomerId: string;
  stripePaymentIntentId: string;
  paymentMethod: string;
  amount: number;
  currency: string;
  paymentStatus: string;
  client_secret: string;
}

export interface UsageStats {
  usersCreated: number;
  transactionsCount: number;
  walletsCreated: number;
  cardsCreated: number;
}

export interface ActiveSubscription {
  _id: string;
  id: string;
  userId: string;
  planId: Plan;
  subscriptionStatus: string;
  startDate: string;
  endDate: string;
  autoRenew: boolean;
  isTrialPeriod: boolean;
  createdBy: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
  updatedBy: string;
  isActive: boolean;
  daysRemaining: number;
  paymentDetails: PaymentDetails;
  usageStats: UsageStats;
}

interface SubscriptionState {
  plans: Plan[];
  selectedPlan: Plan | null;
  activeSubscription: ActiveSubscription | null;
  isLoading: boolean;
  isSubscriptionLoading: boolean;
  error: string | null;
  subscriptionError: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  selectedPlan: null,
  activeSubscription: null,
  isLoading: false,
  isSubscriptionLoading: false,
  error: null,
  subscriptionError: null,
};

// Async thunk for getting subscription plans
export const getPlans = createAsyncThunk(
  'subscription/getPlans',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getPlans();
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch plans');
    }
  }
);

// Async thunk for getting active subscription
export const getActiveSubscription = createAsyncThunk(
  'subscription/getActiveSubscription',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const result = await authService.getActiveSubscription(token);
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch active subscription');
    }
  }
);

const subscriptionSlice = createSlice({
  name: 'subscription',
  initialState,
  reducers: {
    setSelectedPlan: (state, action: PayloadAction<Plan | null>) => {
      state.selectedPlan = action.payload;
    },
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearSubscriptionError: (state) => {
      state.subscriptionError = null;
    },
    setSubscriptionLoading: (state, action: PayloadAction<boolean>) => {
      state.isSubscriptionLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Plans cases
      .addCase(getPlans.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getPlans.fulfilled, (state, action) => {
        state.isLoading = false;
        state.plans = action.payload;
        state.error = null;
        
        // Set the first plan as selected by default
        if (action.payload.length > 0 && !state.selectedPlan) {
          state.selectedPlan = action.payload[0];
        }
      })
      .addCase(getPlans.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      })
      // Get Active Subscription cases
      .addCase(getActiveSubscription.pending, (state) => {
        state.isSubscriptionLoading = true;
        state.subscriptionError = null;
      })
      .addCase(getActiveSubscription.fulfilled, (state, action) => {
        state.isSubscriptionLoading = false;
        state.activeSubscription = action.payload;
        state.subscriptionError = null;
      })
      .addCase(getActiveSubscription.rejected, (state, action) => {
        state.isSubscriptionLoading = false;
        state.subscriptionError = action.payload as string;
      });
  },
});

export const {
  setSelectedPlan,
  setLoading,
  setError,
  clearError,
  clearSubscriptionError,
  setSubscriptionLoading,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
