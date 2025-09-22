import React from 'react';
import { View, Text, TouchableOpacity, StyleSheet } from 'react-native';
import { useAppDispatch, useAppSelector } from '../hooks/redux';
import { loginSuccess, logout, updateProfile } from '../store/slices/userSlice';
import { setBalance, addTransaction } from '../store/slices/walletSlice';

const ReduxExample: React.FC = () => {
  const dispatch = useAppDispatch();
  const { currentUser, isAuthenticated } = useAppSelector((state) => state.user);
  const { wallet } = useAppSelector((state) => state.wallet);

  const handleLogin = () => {
    dispatch(loginSuccess({
      id: '1',
      name: 'John Doe',
      email: 'john@example.com',
      phone: '+1234567890',
      isVerified: true,
    }));
  };

  const handleLogout = () => {
    dispatch(logout());
  };

  const handleUpdateProfile = () => {
    dispatch(updateProfile({
      name: 'Jane Doe',
      email: 'jane@example.com',
    }));
  };

  const handleAddBalance = () => {
    dispatch(setBalance(wallet.balance + 100));
  };

  const handleAddTransaction = () => {
    dispatch(addTransaction({
      id: Date.now().toString(),
      type: 'deposit',
      amount: 50,
      currency: 'USD',
      description: 'Test transaction',
      timestamp: Date.now(),
      status: 'completed',
    }));
  };

  return (
    <View style={styles.container}>
      <Text style={styles.title}>Redux Example</Text>
      
      <View style={styles.section}>
        <Text style={styles.sectionTitle}>User State:</Text>
        <Text>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
        {currentUser && (
          <View>
            <Text>Name: {currentUser.name}</Text>
            <Text>Email: {currentUser.email}</Text>
            <Text>Phone: {currentUser.phone}</Text>
          </View>
        )}
        
        <TouchableOpacity style={styles.button} onPress={handleLogin}>
          <Text style={styles.buttonText}>Login</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleLogout}>
          <Text style={styles.buttonText}>Logout</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleUpdateProfile}>
          <Text style={styles.buttonText}>Update Profile</Text>
        </TouchableOpacity>
      </View>

      <View style={styles.section}>
        <Text style={styles.sectionTitle}>Wallet State:</Text>
        <Text>Balance: ${wallet.balance}</Text>
        <Text>Currency: {wallet.currency}</Text>
        <Text>Transactions: {wallet.transactions.length}</Text>
        
        <TouchableOpacity style={styles.button} onPress={handleAddBalance}>
          <Text style={styles.buttonText}>Add $100</Text>
        </TouchableOpacity>
        
        <TouchableOpacity style={styles.button} onPress={handleAddTransaction}>
          <Text style={styles.buttonText}>Add Transaction</Text>
        </TouchableOpacity>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    backgroundColor: '#f5f5f5',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
    textAlign: 'center',
  },
  section: {
    backgroundColor: 'white',
    padding: 15,
    marginBottom: 15,
    borderRadius: 8,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 3.84,
    elevation: 5,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  button: {
    backgroundColor: '#007AFF',
    padding: 12,
    borderRadius: 6,
    marginVertical: 5,
    alignItems: 'center',
  },
  buttonText: {
    color: 'white',
    fontWeight: 'bold',
  },
});

export default ReduxExample;
