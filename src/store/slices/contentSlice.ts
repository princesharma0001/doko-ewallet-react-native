import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/apiService';

export interface ContentItem {
  _id: string;
  id: string;
  key: string;
  title: string;
  content: string;
  contentType: string;
  category: string;
  isActive: boolean;
  isPublic: boolean;
  description: string;
  metaData: {
    version?: string;
    lastReviewed?: string;
    language?: string;
    established?: string;
    location?: string;
    employees?: string;
    totalQuestions?: number;
    lastUpdated?: string;
    supportLevel?: string;
    supportHours?: string;
    languages?: string[];
    responseTime?: string;
    displayLocation?: string;
    priority?: string;
    totalFeatures?: number;
  };
  status: string;
  version: number;
  createdAt: string;
  updatedAt: string;
  __v: number;
  formattedContent: string | any[];
}

interface ContentState {
  allContent: ContentItem[];
  termsAndConditions: ContentItem | null;
  privacyPolicy: ContentItem | null;
  isLoading: boolean;
  error: string | null;
}

const initialState: ContentState = {
  allContent: [],
  termsAndConditions: null,
  privacyPolicy: null,
  isLoading: false,
  error: null,
};

// Async thunk for getting content
export const getContent = createAsyncThunk(
  'content/getContent',
  async (_, { rejectWithValue }) => {
    try {
      const result = await authService.getContent();
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch content');
    }
  }
);

const contentSlice = createSlice({
  name: 'content',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    clearError: (state) => {
      state.error = null;
    },
    setTermsAndConditions: (state, action: PayloadAction<ContentItem | null>) => {
      state.termsAndConditions = action.payload;
    },
    setPrivacyPolicy: (state, action: PayloadAction<ContentItem | null>) => {
      state.privacyPolicy = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Content cases
      .addCase(getContent.pending, (state) => {
        state.isLoading = true;
        state.error = null;
      })
      .addCase(getContent.fulfilled, (state, action) => {
        state.isLoading = false;
        state.allContent = action.payload;
        state.error = null;
        
        // Filter and set terms and conditions
        const termsAndConditions = action.payload.find(
          (item: ContentItem) => item.key === 'terms_and_conditions'
        );
        state.termsAndConditions = termsAndConditions || null;
        
        // Filter and set privacy policy
        const privacyPolicy = action.payload.find(
          (item: ContentItem) => item.key === 'privacy_policy'
        );
        state.privacyPolicy = privacyPolicy || null;
      })
      .addCase(getContent.rejected, (state, action) => {
        state.isLoading = false;
        state.error = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  clearError,
  setTermsAndConditions,
  setPrivacyPolicy,
} = contentSlice.actions;

export default contentSlice.reducer;
