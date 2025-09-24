import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import StripePaymentModal from './StripePaymentModal';

const StripeTestComponent = () => {
  const { theme } = useTheme();
  const [isModalVisible, setIsModalVisible] = useState(false);

  // Mock plan data for testing
  const mockPlan = {
    _id: '64f1234567890abcdef12345',
    id: '64f1234567890abcdef12345',
    name: 'Premium Plan',
    description: 'Full access to all features',
    price: 9.99,
    formattedPrice: '$9.99',
    durationText: 'month',
    features: [
      'Unlimited transactions',
      'Priority support',
      'Advanced analytics',
    ],
  };

  const handlePaymentSuccess = (subscriptionData) => {
    console.log('Payment successful!', subscriptionData);
    Alert.alert(
      'Success!', 
      'Payment completed successfully. Check console for details.',
      [{ text: 'OK', onPress: () => setIsModalVisible(false) }]
    );
  };

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        Stripe Payment Test
      </Text>
      
      <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
        Test the Stripe payment integration with a mock subscription plan.
      </Text>

      <View style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.planName, { color: theme.colors.text }]}>
          {mockPlan.name}
        </Text>
        <Text style={[styles.planPrice, { color: theme.colors.text }]}>
          {mockPlan.formattedPrice} / {mockPlan.durationText}
        </Text>
        <Text style={[styles.planDescription, { color: theme.colors.textSecondary }]}>
          {mockPlan.description}
        </Text>
      </View>

      <TouchableOpacity
        style={[styles.testButton, { backgroundColor: '#1AA5FF' }]}
        onPress={() => setIsModalVisible(true)}
        activeOpacity={0.8}
      >
        <Text style={styles.testButtonText}>
          Test Payment
        </Text>
      </TouchableOpacity>

      <View style={[styles.instructions, { backgroundColor: theme.colors.surface }]}>
        <Text style={[styles.instructionsTitle, { color: theme.colors.text }]}>
          Test Instructions:
        </Text>
        <Text style={[styles.instructionText, { color: theme.colors.textSecondary }]}>
          • Use test card: 4242 4242 4242 4242{'\n'}
          • Any future expiry date{'\n'}
          • Any 3-digit CVC{'\n'}
          • The payment will call your API endpoint
        </Text>
      </View>

      <StripePaymentModal
        visible={isModalVisible}
        onClose={() => setIsModalVisible(false)}
        planData={mockPlan}
        onPaymentSuccess={handlePaymentSuccess}
      />
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
    justifyContent: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    textAlign: 'center',
    marginBottom: 16,
  },
  description: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  planCard: {
    borderRadius: 12,
    padding: 20,
    marginBottom: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  planDescription: {
    fontSize: 14,
    lineHeight: 20,
  },
  testButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    marginBottom: 24,
  },
  testButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  instructions: {
    borderRadius: 8,
    padding: 16,
  },
  instructionsTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  instructionText: {
    fontSize: 14,
    lineHeight: 20,
  },
});

export default StripeTestComponent;
