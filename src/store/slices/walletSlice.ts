import { createSlice, PayloadAction } from '@reduxjs/toolkit';

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
  balance: number;
  currency: string;
  transactions: Transaction[];
  isActive: boolean;
}

interface WalletState {
  wallet: Wallet;
  isLoading: boolean;
  error: string | null;
  transactionHistory: Transaction[];
}

const initialState: WalletState = {
  wallet: {
    balance: 0,
    currency: 'USD',
    transactions: [],
    isActive: false,
  },
  isLoading: false,
  error: null,
  transactionHistory: [],
};

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
    resetWallet: (state) => {
      state.wallet = initialState.wallet;
      state.transactionHistory = [];
      state.error = null;
    },
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
  resetWallet,
} = walletSlice.actions;

export default walletSlice.reducer;
