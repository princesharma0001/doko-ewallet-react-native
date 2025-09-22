import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

const CryptoAccount = () => {
  const { theme } = useTheme();

  const cryptoTransactions = [
    {
      id: 1,
      type: 'Bitcoin',
      description: 'BTC Transaction',
      time: '07:36 AM',
      amount: '+ 0.5 BTC',
      status: 'Received',
      icon: 'logo-bitcoin',
      iconColor: '#F7931A',
    },
    {
      id: 2,
      type: 'Ethereum',
      description: 'ETH Transaction',
      time: '07:36 AM',
      amount: '- 2.1 ETH',
      status: 'Sent',
      icon: 'logo-ethereum',
      iconColor: '#627EEA',
    },
    {
      id: 3,
      type: 'Litecoin',
      description: 'LTC Transaction',
      time: '07:36 AM',
      amount: '+ 5.0 LTC',
      status: 'Received',
      icon: 'logo-bitcoin',
      iconColor: '#BFBBBB',
    },
    {
      id: 4,
      type: 'Ripple',
      description: 'XRP Transaction',
      time: '07:36 AM',
      amount: '- 100 XRP',
      status: 'Sent',
      icon: 'logo-bitcoin',
      iconColor: '#23292F',
    },
  ];

  const renderBalanceSection = () => (
    <View style={styles.balanceSection}>
      <Text style={[styles.balanceLabel, { color: theme.colors.textSecondary }]}>
        Your Crypto Balance
      </Text>
      <Text style={[styles.balanceAmount, { color: theme.colors.text }]}>
        $45,230.50
      </Text>
      <Text style={[styles.balanceSubtext, { color: theme.colors.textSecondary }]}>
        +12.5% (24h)
      </Text>
    </View>
  );

  const renderActionButtons = () => (
    <View style={styles.actionButtons}>
      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.actionIcon, { backgroundColor: '#F7931A' }]}>
          <Ionicons name="arrow-up" size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.actionText, { color: theme.colors.text }]}>Send</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.actionIcon, { backgroundColor: '#627EEA' }]}>
          <Ionicons name="arrow-down" size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.actionText, { color: theme.colors.text }]}>Receive</Text>
      </TouchableOpacity>

      <TouchableOpacity style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}>
        <View style={[styles.actionIcon, { backgroundColor: theme.colors.primary }]}>
          <Ionicons name="swap-horizontal" size={20} color="#FFFFFF" />
        </View>
        <Text style={[styles.actionText, { color: theme.colors.text }]}>Swap</Text>
      </TouchableOpacity>

      {/* <TouchableOpacity style={styles.addCardButton}>
        <Text style={[styles.addCardText, { color: theme.colors.primary }]}>+ Add Token</Text>
      </TouchableOpacity> */}
    </View>
  );

  const renderTransactionItem = (transaction) => (
    <TouchableOpacity key={transaction.id} style={[styles.transactionItem, { borderBottomColor: theme.colors.border }]}>
      <View style={styles.transactionLeft}>
        <View style={[styles.transactionIcon, { backgroundColor: transaction.iconColor }]}>
          <Ionicons name={transaction.icon} size={20} color="#FFFFFF" />
        </View>
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionType, { color: theme.colors.text }]}>
            {transaction.type}
          </Text>
          <Text style={[styles.transactionDescription, { color: theme.colors.textSecondary }]}>
            {transaction.description}
          </Text>
        </View>
      </View>
      <View style={styles.transactionRight}>
        <Text style={[styles.transactionTime, { color: theme.colors.textSecondary }]}>
          {transaction.time}
        </Text>
        <Text style={[styles.transactionAmount, { color: theme.colors.text }]}>
          {transaction.amount}
        </Text>
        <Text style={[styles.transactionStatus, { color: theme.colors.textSecondary }]}>
          {transaction.status}
        </Text>
      </View>
    </TouchableOpacity>
  );

  const renderLatestTransactions = () => (
    <View style={[styles.transactionsContainer, { backgroundColor: theme.colors.surface }]}>
      <Text style={[styles.transactionsTitle, { color: theme.colors.text }]}>
        Latest Crypto Transactions
      </Text>
      {cryptoTransactions.map(renderTransactionItem)}
    </View>
  );

  return (
    <ScrollView
      style={styles.scrollView}
      showsVerticalScrollIndicator={false}
      contentContainerStyle={styles.scrollContent}
    >
      {renderBalanceSection()}
      {renderActionButtons()}
      {renderLatestTransactions()}
      
      {/* Bottom padding for BottomBar */}
      <View style={{ height: 100 }} />
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 20,
  },
  balanceSection: {
    alignItems: 'center',
    paddingVertical: 30,
    paddingHorizontal: 20,
  },
  balanceLabel: {
    fontSize: 16,
    marginBottom: 8,
  },
  balanceAmount: {
    fontSize: 36,
    fontWeight: '700',
    marginBottom: 4,
  },
  balanceSubtext: {
    fontSize: 14,
    fontWeight: '500',
  },
  actionButtons: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    marginBottom: 30,
    alignItems: 'center',
    justifyContent:'center'
  },
  actionButton: {
    flex: 1,
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 12,
    borderRadius: 12,
    marginRight: 12,
  },
  actionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 8,
  },
  actionText: {
    fontSize: 14,
    fontWeight: '600',
  },
  addCardButton: {
    paddingVertical: 16,
    paddingHorizontal: 12,
  },
  addCardText: {
    fontSize: 14,
    fontWeight: '600',
    writingMode: 'vertical-rl',
    textOrientation: 'mixed',
  },
  transactionsContainer: {
    marginHorizontal: 20,
    borderRadius: 16,
    padding: 20,
    marginBottom: 20,
  },
  transactionsTitle: {
    fontSize: 18,
    fontWeight: '700',
    marginBottom: 20,
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  transactionDetails: {
    flex: 1,
  },
  transactionType: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionDescription: {
    fontSize: 14,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionTime: {
    fontSize: 12,
    marginBottom: 2,
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 12,
  },
});

export default CryptoAccount;
