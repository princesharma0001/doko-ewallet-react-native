import { createSlice, PayloadAction, createAsyncThunk } from '@reduxjs/toolkit';
import { authService } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

export interface Transaction {
  id: string;
  type: 'send' | 'receive' | 'deposit' | 'withdraw';
  amount: number;
  currency: string;
  recipient?: string;
  description?: string;
  timestamp: number;
  status: 'pending' | 'completed' | 'failed';
}

export interface Wallet {
  _id: string;
  id: string;
  userId: string;
  walletType: string;
  name: string;
  currency: string;
  balance: number;
  holdBalance: number;
  isDefault: boolean;
  status: string;
  createdAt: string;
  updatedAt: string;
  __v: number;
}

export interface WalletSummary {
  totalWallets: number;
  totalBalance: {
    USD: number;
    USDC: number;
    NPR: number;
  };
  walletsByType: {
    PERSONAL: Wallet[];
    SAVINGS: Wallet[];
  };
}

export interface WalletListResponse {
  wallets: Wallet[];
  summary: WalletSummary;
}

interface WalletState {
  wallet: Wallet | null;
  walletList: Wallet[];
  walletSummary: WalletSummary | null;
  defaultWallet: Wallet | null;
  isLoading: boolean;
  isWalletListLoading: boolean;
  error: string | null;
  walletListError: string | null;
  transactionHistory: Transaction[];
}

const initialState: WalletState = {
  wallet: null,
  walletList: [],
  walletSummary: null,
  defaultWallet: null,
  isLoading: false,
  isWalletListLoading: false,
  error: null,
  walletListError: null,
  transactionHistory: [],
};

// Async thunk for getting wallet list
export const getWalletList = createAsyncThunk(
  'wallet/getWalletList',
  async (_, { rejectWithValue }) => {
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        return rejectWithValue('No token found');
      }

      const result = await authService.getWalletList(token);
      
      if (result.success) {
        return result.data;
      } else {
        return rejectWithValue(result.error);
      }
    } catch (error) {
      return rejectWithValue(error.message || 'Failed to fetch wallet list');
    }
  }
);

const walletSlice = createSlice({
  name: 'wallet',
  initialState,
  reducers: {
    setLoading: (state, action: PayloadAction<boolean>) => {
      state.isLoading = action.payload;
    },
    setError: (state, action: PayloadAction<string | null>) => {
      state.error = action.payload;
    },
    setBalance: (state, action: PayloadAction<number>) => {
      state.wallet.balance = action.payload;
    },
    addTransaction: (state, action: PayloadAction<Transaction>) => {
      state.wallet.transactions.unshift(action.payload);
      state.transactionHistory.unshift(action.payload);
    },
    updateTransactionStatus: (state, action: PayloadAction<{ id: string; status: Transaction['status'] }>) => {
      const { id, status } = action.payload;
      const transaction = state.wallet.transactions.find(t => t.id === id);
      if (transaction) {
        transaction.status = status;
      }
      const historyTransaction = state.transactionHistory.find(t => t.id === id);
      if (historyTransaction) {
        historyTransaction.status = status;
      }
    },
    activateWallet: (state) => {
      state.wallet.isActive = true;
    },
    deactivateWallet: (state) => {
      state.wallet.isActive = false;
    },
    clearError: (state) => {
      state.error = null;
    },
    clearWalletListError: (state) => {
      state.walletListError = null;
    },
    setWalletListLoading: (state, action: PayloadAction<boolean>) => {
      state.isWalletListLoading = action.payload;
    },
    resetWallet: (state) => {
      state.wallet = initialState.wallet;
      state.transactionHistory = [];
      state.error = null;
    },
  },
  extraReducers: (builder) => {
    builder
      // Get Wallet List cases
      .addCase(getWalletList.pending, (state) => {
        state.isWalletListLoading = true;
        state.walletListError = null;
      })
      .addCase(getWalletList.fulfilled, (state, action) => {
        state.isWalletListLoading = false;
        state.walletList = action.payload.wallets;
        state.walletSummary = action.payload.summary;
        
        // Find and set the default wallet
        console.log("adfsadgafs",action.payload.wallets);
        
        const defaultWallet = action.payload.wallets.find(wallet => wallet?.isDefault);
        if (defaultWallet) {
          state.defaultWallet = defaultWallet;
          state.wallet = defaultWallet;
        }
        
        state.walletListError = null;
      })
      .addCase(getWalletList.rejected, (state, action) => {
        state.isWalletListLoading = false;
        state.walletListError = action.payload as string;
      });
  },
});

export const {
  setLoading,
  setError,
  setBalance,
  addTransaction,
  updateTransactionStatus,
  activateWallet,
  deactivateWallet,
  clearError,
  clearWalletListError,
  setWalletListLoading,
  resetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
