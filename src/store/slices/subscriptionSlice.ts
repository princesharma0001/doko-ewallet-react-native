import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/apiService';

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

interface SubscriptionState {
  plans: Plan[];
  selectedPlan: Plan | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: SubscriptionState = {
  plans: [],
  selectedPlan: null,
  isLoading: false,
  error: null,
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
      });
  },
});

export const {
  setSelectedPlan,
  setLoading,
  setError,
  clearError,
} = subscriptionSlice.actions;

export default subscriptionSlice.reducer;
