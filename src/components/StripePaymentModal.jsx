import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ActivityIndicator,
  Alert,
  Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useAppSelector } from '../store';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useStripe, CardField, useConfirmPayment, useStripePayment } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const StripePaymentModal = ({ 
  visible, 
  onClose, 
  planData, 
  onPaymentSuccess 
}) => {
  const { theme } = useTheme();
  const { currentUser } = useAppSelector((state) => state.user);
  const { confirmPayment } = useConfirmPayment();
  const { createPaymentMethod } = useStripe();
  const [loading, setLoading] = useState(false);
  const [paymentIntent, setPaymentIntent] = useState(null);
  const [cardDetails, setCardDetails] = useState(null);

  const handlePaymentVerification = async (subscriptionData) => {
    try {
      console.log('Verifying payment for subscription:', subscriptionData);
      
      // Get user token
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        console.error('No user token found for payment verification');
        return;
      }

      // Get payment intent ID from subscription data
      const paymentIntentId = subscriptionData?.paymentDetails?.stripePaymentIntentId;
      if (!paymentIntentId) {
        console.error('No payment intent ID found in subscription data');
        return;
      }

      // Call verify payment API
      const verifyResult = await authService.verifyPayment(paymentIntentId, token);
      
      if (verifyResult.success) {
        console.log('final_payment', verifyResult.data);
        Toast.show({
          type: 'success',
          text1: 'Payment Verified',
          text2: 'Your subscription has been successfully verified!',
          position: 'top',
          visibilityTime: 4000,
        });
        
        // Call success callback with verified data
        if (onPaymentSuccess) {
          onPaymentSuccess(subscriptionData);
        }
        onClose();
      } else {
        console.error('Payment verification failed:', verifyResult.error);
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: verifyResult.error || 'Failed to verify payment',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.error('Payment verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Verification Error',
        text2: 'An error occurred while verifying payment',
        position: 'top',
        visibilityTime: 4000,
      });
    }
  };

  const handlePayment = async () => {
    if (!planData) {
      Alert.alert('Error', 'No plan selected');
      return;
    }

    if (!cardDetails?.complete) {
      Alert.alert('Error', 'Please enter complete card details');
      return;
    }

    setLoading(true);
    try {
      // Get user token
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        setLoading(false);
        return;
      }

      // Call your API to create subscription and get payment intent
      const result = await authService.purchaseSubscription(
        planData._id || planData.id,
        false, // autoRenew
        token
      );

      console.log("sdagsadgsadg",result);
      

      if (result.success && result.data?.paymentDetails?.client_secret) {
        const { client_secret } = result.data.paymentDetails;
        console.log("Payment Intent ID from API:", client_secret);
        console.log("Full API response:", result.data);
        
        // The issue is that your API returns payment intent ID (pi_xxx) 
        // but Stripe needs client secret (pi_xxx_secret_xxx)
        // We need to either:
        // 1. Update your backend to return client secret, OR
        // 2. Use a different approach
        
        // For now, let's try to use the payment intent ID as client secret
        // This might work if the format is correct
        let clientSecret = client_secret;
        
        // If the payment intent ID doesn't contain '_secret_', we need to get the client secret
        if (!clientSecret.includes('_secret_')) {
          console.log("❌ ERROR: Your API returned payment intent ID but Stripe needs client secret!");
          console.log("❌ Current value:", clientSecret);
          console.log("❌ Expected format: pi_xxx_secret_xxx");
          
          Alert.alert(
            'Backend Configuration Required',
            `Your backend API needs to return the Stripe client secret instead of payment intent ID.\n\n` +
            `Current: ${clientSecret}\n` +
            `Expected: pi_xxx_secret_xxx\n\n` +
            `Please update your backend to return the client secret from the Stripe Payment Intent.`
          );
          setLoading(false);
          return;
        }
        
        console.log("Using client secret:", clientSecret);
        
        // Confirm payment with Stripe
        const { error, paymentIntent: confirmedPaymentIntent } = await confirmPayment(
          clientSecret,
          {
            paymentMethodType: 'Card',
            paymentMethodData: {
              billingDetails: {
                name: currentUser?.firstName + ' ' + currentUser?.lastName || 'Customer',
                email: currentUser?.email || '',
              },
            },
          }
        );

        if (error) {
          console.error('Payment failed:', error);
          Alert.alert('Payment Failed', error.message);
        } else if (confirmedPaymentIntent) {
          console.log('Payment successful:', confirmedPaymentIntent);
          
          // Call payment verification
          await handlePaymentVerification(result.data);
        }
      } else {
        Alert.alert('Error', result.error || 'Failed to create payment intent');
      }
    } catch (error) {
      console.error('Payment error:', error);
      Alert.alert('Error', 'An unexpected error occurred during payment');
    } finally {
      setLoading(false);
    }
  };

  const renderContent = () => (
    <View style={[styles.modalContent, { backgroundColor: theme.colors.surface }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Complete Payment
        </Text>
        <TouchableOpacity onPress={onClose} style={styles.closeButton}>
          <Text style={[styles.closeText, { color: theme.colors.textSecondary }]}>
            ✕
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.planInfo}>
        <Text style={[styles.planName, { color: theme.colors.text }]}>
          {planData?.name || 'Plan'}
        </Text>
        <Text style={[styles.planPrice, { color: theme.colors.text }]}>
          {planData?.formattedPrice || '$0.00'} / {planData?.durationText || 'month'}
        </Text>
        <Text style={[styles.planDescription, { color: theme.colors.textSecondary }]}>
          {planData?.description || ''}
        </Text>
      </View>

      <View style={styles.paymentInfo}>
        <Text style={[styles.paymentTitle, { color: theme.colors.text }]}>
          Payment Summary
        </Text>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, { color: theme.colors.text }]}>
            Subscription Fee
          </Text>
          <Text style={[styles.paymentValue, { color: theme.colors.text }]}>
            {planData?.formattedPrice || '$0.00'}
          </Text>
        </View>
        <View style={styles.paymentRow}>
          <Text style={[styles.paymentLabel, { color: theme.colors.text }]}>
            Account Deposit
          </Text>
          <Text style={[styles.paymentValue, { color: theme.colors.text }]}>
            $30.00
          </Text>
        </View>
        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />
        <View style={styles.paymentRow}>
          <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
            Total
          </Text>
          <Text style={[styles.totalValue, { color: theme.colors.text }]}>
            ${((planData?.price || 0) + 30).toFixed(2)}
          </Text>
        </View>
      </View>

      {/* Card Input Field */}
      <View style={styles.cardInputContainer}>
        <Text style={[styles.cardInputLabel, { color: theme.colors.text }]}>
          Card Details
        </Text>
        <CardField
          postalCodeEnabled={false}
          placeholders={{
            number: '4242 4242 4242 4242',
          }}
          cardStyle={{
            backgroundColor: theme.colors.surface,
            textColor: theme.colors.text,
            borderColor: theme.colors.border,
            borderWidth: 1,
            borderRadius: 8,
            fontSize: 16,
            placeholderColor: theme.colors.textSecondary,
          }}
          style={styles.cardField}
          onCardChange={(cardDetails) => {
            setCardDetails(cardDetails);
          }}
        />
      </View>

      <TouchableOpacity
        style={[
          styles.payButton, 
          { 
            backgroundColor: cardDetails?.complete ? '#1AA5FF' : '#CCCCCC',
            opacity: cardDetails?.complete ? 1 : 0.6
          }
        ]}
        onPress={handlePayment}
        disabled={loading || !cardDetails?.complete}
        activeOpacity={0.8}
      >
        {loading ? (
          <ActivityIndicator color="#FFFFFF" size="small" />
        ) : (
          <Text style={styles.payButtonText}>
            Pay with Card
          </Text>
        )}
      </TouchableOpacity>

      <Text style={[styles.securityText, { color: theme.colors.textSecondary }]}>
        🔒 Your payment is secure and encrypted
      </Text>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.backdrop}
          activeOpacity={1}
          onPress={onClose}
        />
        <View style={styles.modalContainer}>
          {renderContent()}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'center',
    alignItems: 'center',
  },
  backdrop: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
  },
  modalContent: {
    borderRadius: 20,
    padding: 24,
    shadowColor: '#000',
    shadowOffset: {
      width: 0,
      height: 10,
    },
    shadowOpacity: 0.25,
    shadowRadius: 20,
    elevation: 10,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
  },
  closeButton: {
    padding: 8,
  },
  closeText: {
    fontSize: 20,
    fontWeight: '600',
  },
  planInfo: {
    marginBottom: 24,
    alignItems: 'center',
  },
  planName: {
    fontSize: 20,
    fontWeight: '600',
    marginBottom: 8,
  },
  planPrice: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 4,
  },
  planDescription: {
    fontSize: 14,
    textAlign: 'center',
    lineHeight: 20,
  },
  paymentInfo: {
    marginBottom: 24,
  },
  paymentTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
  },
  paymentRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 8,
  },
  paymentLabel: {
    fontSize: 14,
    fontWeight: '500',
  },
  paymentValue: {
    fontSize: 14,
    fontWeight: '500',
  },
  divider: {
    height: 1,
    marginVertical: 12,
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: '700',
  },
  totalValue: {
    fontSize: 16,
    fontWeight: '700',
  },
  payButton: {
    borderRadius: 12,
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
  },
  payButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '700',
  },
  securityText: {
    fontSize: 12,
    textAlign: 'center',
    fontWeight: '500',
  },
  cardInputContainer: {
    marginBottom: 20,
  },
  cardInputLabel: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 8,
  },
  cardField: {
    width: '100%',
    height: 50,
  },
});

export default StripePaymentModal;
