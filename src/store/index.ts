import { configureStore } from '@reduxjs/toolkit';
import { useDispatch, useSelector, TypedUseSelectorHook } from 'react-redux';
import userSlice from './slices/userSlice';
import walletSlice from './slices/walletSlice';
import subscriptionSlice from './slices/subscriptionSlice';
import contentSlice from './slices/contentSlice';

export const store = configureStore({
  reducer: {
    user: userSlice,
    wallet: walletSlice,
    subscription: subscriptionSlice,
    content: contentSlice,
  },
  middleware: (getDefaultMiddleware) =>
    getDefaultMiddleware({
      serializableCheck: {
        ignoredActions: ['persist/PERSIST'],
      },
    }),
});

export type RootState = ReturnType<typeof store.getState>;
export type AppDispatch = typeof store.dispatch;

// Typed hooks
export const useAppDispatch = () => useDispatch<AppDispatch>();
export const useAppSelector: TypedUseSelectorHook<RootState> = useSelector;
