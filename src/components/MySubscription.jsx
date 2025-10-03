import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  StatusBar,
  Dimensions,
  Modal,
  TextInput,
  Alert,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useAppSelector } from '../store';

const { width, height } = Dimensions.get('window');

const MySubscription = ({ navigation }) => {
  const { theme } = useTheme();
  const { currentUser } = useAppSelector((state) => state.user);
    const { activeSubscription, isSubscriptionLoading, subscriptionError } = useAppSelector((state) => state.subscription);
  console.log("adgsadgsdgsafasdf",activeSubscription);
  
  // State management
  const [authToken, setAuthToken] = useState(null);
  const [subscriptionData, setSubscriptionData] = useState(null);
  const [showCancelModal, setShowCancelModal] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [isCancelling, setIsCancelling] = useState(false);
  
  // Load auth token and subscription data
  useEffect(() => {
    loadAuthToken();
  }, []);

  const loadAuthToken = async () => {
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      setAuthToken(token);
    } catch (error) {
      console.error('Error loading auth token:', error);
    }
  };



  // Cancel subscription functions
  const handleCancelSubscription = () => {
    if (!subscriptionData?.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'No active subscription found to cancel',
      });
      return;
    }
    setShowCancelModal(true);
  };

  const handleConfirmCancel = async () => {
    if (!cancelReason.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please provide a reason for cancellation',
      });
      return;
    }

    if (!authToken || !activeSubscription?.id) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Unable to cancel subscription',
      });
      return;
    }

    setIsCancelling(true);

    try {
      const response = await authService.cancelSubscription(
        activeSubscription.id,
        cancelReason.trim(),
        authToken
      );

      if (response.success) {
        Toast.show({
          type: 'success',
          text1: 'Success',
          text2: response.message || 'Subscription cancelled successfully',
        });
        
        // Close modal and reset state
        setShowCancelModal(false);
        setCancelReason('');
        
        // Reload subscription data
      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error || 'Failed to cancel subscription',
        });
      }
    } catch (error) {
      console.error('Cancel subscription error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
      });
    } finally {
      setIsCancelling(false);
    }
  };

  const handleCancelModal = () => {
    setShowCancelModal(false);
    setCancelReason('');
  };
  

  const subscriptionFeatures = [
    {
      id: 'card-issued',
      title: 'Card issued',
      type: 'number',
      value: '3',
    },
    {
      id: 'free-virtual-cards',
      title: 'Free Virtual Cards',
      type: 'slider',
      current: 2,
      total: 3,
    },
    {
      id: 'no-commission-trades',
      title: 'No Commission Trades',
      type: 'slider',
      current: 2,
      total: 3,
    },
    {
      id: 'cashback-received-1',
      title: 'Cashback Received',
      type: 'number',
      value: '3',
    },
    {
      id: 'cashback-received-2',
      title: 'Cashback Received',
      type: 'number',
      value: '3',
    },
    {
      id: 'Cancel Subscription',
      title: 'Cancel Subscription',
      type: 'cancel',
      isClickable: true,
    },
  ];

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor={theme.colors.background}
      />
      <View style={styles.headerContent}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation?.goBack()}
        >
          <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
        </TouchableOpacity>

        <View style={styles.headerSpacer} />
      </View>
    </View>
  );

  const renderProgressSlider = (current, total) => {
    const percentage = (current / total) * 100;

    return (
      <View style={styles.sliderContainer}>
        <View style={[styles.sliderTrack, { backgroundColor: theme.colors.border }]}>
          <View
            style={[
              styles.sliderFill,
              {
                width: `${percentage}%`,
                backgroundColor: theme.colors.primary
              }
            ]}
          />
          <View
            style={[
              styles.sliderThumb,
              {
                left: `${percentage}%`,
                backgroundColor: theme.colors.primaryText
              }
            ]}
          />
        </View>
        <Text style={[styles.sliderText, { color: theme.colors.text }]}>
          {current}/{total}
        </Text>
      </View>
    );
  };

  const renderFeatureCard = (feature) => (
    <TouchableOpacity
      key={feature.id}
      style={[
        styles.featureCard, 
        { backgroundColor: theme.colors.surface },
        feature.isClickable && styles.clickableCard
      ]}
      onPress={feature.isClickable ? handleCancelSubscription : null}
      activeOpacity={feature.isClickable ? 0.7 : 1}
    >
      <Text style={[
        styles.featureTitle, 
        { color: feature.isClickable ? '#F44336' : theme.colors.text }
      ]}>
        {feature.title}
      </Text>

      {feature.type === 'number' ? (
        <Text style={[styles.featureValue, { color: theme.colors.text }]}>
          {feature.value}
        </Text>
      ) : feature.type === 'slider' ? (
        renderProgressSlider(feature.current, feature.total)
      ) : feature.type === 'cancel' ? (
        <Ionicons name="chevron-forward" size={20} color="#F44336" />
      ) : null}
    </TouchableOpacity>
  );

  const renderSubscriptionFeatures = () => (
    <View style={styles.featuresContainer}>
      <View style={styles.titleContainer}>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>My Pro Subscription</Text>
      </View>
      {subscriptionFeatures.map(renderFeatureCard)}
    </View>
  );

  return (
    <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
      {renderHeader()}
      <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
        <View style={styles.content}>
          {renderSubscriptionFeatures()}
        </View>
      </ScrollView>

      {/* Cancel Subscription Modal */}
      <Modal
        visible={showCancelModal}
        animationType="slide"
        presentationStyle="pageSheet"
        transparent={true}
      >
        <View style={styles.modalOverlay}>
          <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
            <View style={[styles.modalHeader, { backgroundColor: theme.colors.surface }]}>
              <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                Cancel Subscription
              </Text>
              <TouchableOpacity
                onPress={handleCancelModal}
                style={styles.modalCloseButton}
              >
                <Ionicons name="close" size={24} color={theme.colors.text} />
              </TouchableOpacity>
            </View>
            
            <View style={styles.modalContent}>
              <Text style={[styles.modalDescription, { color: theme.colors.text }]}>
                We're sorry to see you go! Please let us know why you're cancelling your subscription:
              </Text>
              
              <TextInput
                style={[
                  styles.reasonInput,
                  {
                    color: theme.colors.text,
                    backgroundColor: theme.colors.surface,
                    borderColor: theme.colors.textSecondary
                  }
                ]}
                placeholder="Enter your reason for cancellation..."
                placeholderTextColor={theme.colors.textSecondary}
                value={cancelReason}
                onChangeText={setCancelReason}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
                maxLength={200}
              />
              
              <Text style={[styles.charCount, { color: theme.colors.textSecondary }]}>
                {cancelReason.length}/200 characters
              </Text>
            </View>
            
            <View style={[styles.modalActions, ]}>
              <TouchableOpacity
                style={[styles.modalButton, styles.cancelButton]}
                onPress={handleCancelModal}
              >
                <Text style={[styles.modalButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>
              
              <TouchableOpacity
                style={[
                  styles.modalButton,
                  styles.confirmButton,
                  { 
                    backgroundColor: cancelReason.trim() ? '#F44336' : '#ccc',
                    opacity: cancelReason.trim() ? 1 : 0.6
                  }
                ]}
                onPress={handleConfirmCancel}
                disabled={!cancelReason.trim() || isCancelling}
              >
                {isCancelling ? (
                  <ActivityIndicator size="small" color="white" />
                ) : (
                  <Text style={styles.confirmButtonText}>
                   Okay
                  </Text>
                )}
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    paddingTop: 50,
  },
  headerContent: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
  },
  backButton: {
    padding: 8,
    marginRight: 16,
  },
  headerTitle: {
    fontSize: 38,
    fontWeight: '700',
  },
  headerSpacer: {
    flex: 1,
  },
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  scrollView: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  featuresContainer: {
    gap: 16,
  },
  featureCard: {
    borderRadius: 12,
    paddingHorizontal: 20,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  featureTitle: {
    fontSize: 16,
    fontWeight: '500',
    flex: 1,
  },
  featureValue: {
    fontSize: 18,
    fontWeight: '600',
  },
  sliderContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
  },
  sliderTrack: {
    width: 80,
    height: 6,
    borderRadius: 3,
    position: 'relative',
  },
  sliderFill: {
    height: '100%',
    borderRadius: 3,
  },
  sliderThumb: {
    position: 'absolute',
    top: -4,
    width: 14,
    height: 14,
    borderRadius: 7,
    marginLeft: -7,
  },
  sliderText: {
    fontSize: 14,
    fontWeight: '500',
    minWidth: 30,
    textAlign: 'right',
  },
  clickableCard: {
    borderWidth: 1,
    borderColor: '#F44336',
  },
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    margin:10,
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: '90%',
    minHeight: '60%',
  },
  modalHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: '600',
  },
  modalCloseButton: {
    padding: 4,
  },
  modalContent: {
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  modalDescription: {
    fontSize: 16,
    lineHeight: 24,
    marginBottom: 16,
  },
  reasonInput: {
    borderWidth: 1,
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 12,
    fontSize: 16,
    minHeight: 150,
    marginBottom: 8,
  },
  charCount: {
    fontSize: 12,
    textAlign: 'right',
  },
  modalActions: {
    flexDirection: 'row',
    paddingHorizontal: 20,
    paddingVertical: 16,
    gap: 12,
  },
  modalButton: {
    flex: 1,
    paddingVertical: 12,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
  },
  cancelButton: {
    backgroundColor: 'transparent',
    borderWidth: 1,
    borderColor: '#ccc',
  },
  confirmButton: {
    // backgroundColor is set dynamically
  },
  modalButtonText: {
    fontSize: 16,
    fontWeight: '500',
  },
  confirmButtonText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
  },
});

export default MySubscription;
