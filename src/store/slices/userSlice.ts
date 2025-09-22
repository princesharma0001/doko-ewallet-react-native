import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface User {
  _id: string;
  id: string;
  firstName: string;
  lastName: string;
  email: string;
  phone: string;
  countryCode: string;
  isPhoneVerified: string;
  isEmailVerified: string;
  userType: string;
  status: string;
  enabled2FA: string;
  verified2FA: string;
  isProfileCompleted: boolean;
  dateOfBirth?: string;
  passcode?: string;
  profilePic?: string;
  address?: {
    street: string;
    city: string;
    state: string;
    country: string;
    zipCode: string;
    formattedAddress: string;
  };
  location?: {
    type: string;
    coordinates?: number[];
  };
  createdAt: string;
  updatedAt: string;
  __v: number;
}

interface UserState {
  currentUser: User | null;
  isAuthenticated: boolean;
  isLoading: boolean;
  isProfileLoading: boolean;
  error: string | null;
  profileError: string | null;
}

const initialState: UserState = {
  currentUser: null,
  isAuthenticated: false,
  isLoading: false,
  isProfileLoading: false,
  error: null,
  profileError: null,
};

// Async thunk for getting user profile
export const getProfile = createAsyncThunk(
  'user/getProfile',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const result = await authService.getProfile(token);
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch profile');
    }
  }
);

const userSlice = createSlice({
  name: 'user',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    loginSuccess: (state, action: PayloadAction<User>) => {
      state.currentUser = action.payload;
      state.isAuthenticated = true;
      state.isLoading = false;
      state.error = null;
    },
    logout: (state) => {
      state.currentUser = null;
      state.isAuthenticated = false;
      state.isLoading = false;
      state.error = null;
    },
    updateProfile: (state, action: PayloadAction<Partial<User>>) => {
      if (state.currentUser) {
        state.currentUser = { ...state.currentUser, ...action.payload };
      }
    },
    clearError: (state) => {
      state.error = null;
    },
    clearProfileError: (state) => {
      state.profileError = null;
    },
    setProfileLoading: (state, action: PayloadAction<boolean>) => {
      state.isProfileLoading = action.payload;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Profile cases
      .addCase(getProfile.pending, (state) => {
        state.isProfileLoading = true;
        state.profileError = null;
      })
      .addCase(getProfile.fulfilled, (state, action) => {
        state.isProfileLoading = false;
        state.currentUser = action.payload;
        state.isAuthenticated = true;
        state.profileError = null;
      })
      .addCase(getProfile.rejected, (state, action) => {
        state.isProfileLoading = false;
        state.profileError = action.payload as string;
        // Don't clear authentication on profile fetch failure
      });
  },
});

export const {
  setLoading,
  setError,
  loginSuccess,
  logout,
  updateProfile,
  clearError,
  clearProfileError,
  setProfileLoading,
} = userSlice.actions;

export default userSlice.reducer;
