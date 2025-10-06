import React, { useState, useRef } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
  StatusBar,
  TouchableWithoutFeedback,
  Keyboard,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import MaterialIcons from "react-native-vector-icons/MaterialIcons";
import SuccessModal from '../components/SuccessModal';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const AddRecieveQr = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [amount, setAmount] = useState('00.00');
  const [message, setMessage] = useState('');
  const [showMessage, setShowMessage] = useState(false);
  const [showSuccessModal, setShowSuccessModal] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [transferResult, setTransferResult] = useState(null);
  const messageInputRef = useRef(null);

  const recipient = route?.params?.recipient || '@Sami343';
  const usersDetails = route?.params?.data || '@Sami343';
  console.log("Sdgsagasdg",usersDetails);
  

  const handleAmountChange = (text) => {
    // Remove any non-numeric characters except decimal point
    const cleanText = text.replace(/[^0-9.]/g, '');

    // Ensure only one decimal point
    const parts = cleanText.split('.');
    if (parts.length > 2) {
      return;
    }

    // Limit to 2 decimal places
    if (parts[1] && parts[1].length > 2) {
      return;
    }

    setAmount(cleanText);
  };

  const handleAddMessage = () => {
    setShowMessage(true);
    setTimeout(() => {
      messageInputRef.current?.focus();
    }, 100);
  };

  const handleSendNow = async () => {
    // Validate amount
    const numAmount = parseFloat(amount);
    if (isNaN(numAmount) || numAmount <= 0) {
      Alert.alert('Error', 'Please enter a valid amount');
      return;
    }

    setIsLoading(true);
    try {
      // Get user token
      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        Alert.alert('Error', 'User not authenticated');
        setIsLoading(false);
        return;
      }

      // Get recipient identity from route params
      const recipientIdentity = usersDetails?.email
      if (!recipientIdentity) {
        Alert.alert('Error', 'Recipient information not found');
        setIsLoading(false);
        return;
      }

      // Call transfer API
      const result = await authService.sendTransfer(
        recipientIdentity,
        numAmount,
        'NPR', // Default currency, you can make this dynamic
        message || 'Transfer via DOKO',
        token
      );

      if (result.success) {
        console.log('Transfer successful:', result.data);
        setTransferResult(result.data);
        setShowSuccessModal(true);
        
        Toast.show({
          type: 'success',
          text1: 'Transfer Successful',
          text2: `Successfully sent $${numAmount.toFixed(2)} to ${recipient}`,
          position: 'top',
          visibilityTime: 4000,
        });
      } else {
        console.error('Transfer failed:', result.error);
        
        Toast.show({
          type: 'error',
          text1: 'Transfer Failed',
          text2: result.error || 'Failed to send transfer',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.error('Transfer error:', error);
      Alert.alert('Error', 'An unexpected error occurred during transfer');
      
      Toast.show({
        type: 'error',
        text1: 'Transfer Error',
        text2: 'An unexpected error occurred',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Reset form or navigate back
    setAmount('00.00');
    setMessage('');
    setShowMessage(false);
    // navigation.navigate('SearchUserChat', { recipient: '@Sami343' });
    navigation.goBack();
  };

  const formatAmount = (value) => {
    if (!value) return '$0.00';
    const numValue = parseFloat(value);
    return `$${numValue.toFixed(2)}`;
  };

  const displayAmount = () => {
    if (!amount) return '$0.00';
    const numValue = parseFloat(amount);
    if (isNaN(numValue)) return '$0.00';
    return `$${numValue.toFixed(2)}`;
  };


  return (
    <TouchableWithoutFeedback onPress={Keyboard.dismiss}>
      <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
        <StatusBar barStyle="light-content" backgroundColor={theme.colors.background} />

        {/* Header */}
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
          <TouchableOpacity
            style={styles.backButton}
            onPress={() => navigation.goBack()}
          >
            <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
          </TouchableOpacity>
          <Text style={[styles.recipientName, { color: theme.colors.text }]}>
            {recipient}
          </Text>
        </View>

        {/* Main Content with KeyboardAvoidingView */}
        <KeyboardAvoidingView
          style={styles.keyboardAvoidingView}
          behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
          keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
        >
          <View style={styles.mainContent}>
            {!showMessage ? (
              <>
                {/* Amount Display */}
                <View style={styles.amountContainer}>
                  <TextInput
                    style={[styles.amountText, { color: theme.colors.text }]}
                    value={amount ? `$${amount}` : ''}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    selectTextOnFocus
                    placeholder="$0.00"
                    placeholderTextColor={theme.colors.muted}
                  />
                </View>

                {/* Add Message Button */}


                {/* Send Now Button */}

                <View style={{ marginTop: 'auto', }}>
                  <TouchableOpacity
                    style={styles.addMessageButton}
                    onPress={handleAddMessage}
                  >
                    <Text style={styles.addMessageText}>Add Message</Text>
                  </TouchableOpacity>
                  <LinearGradient
                    colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.5, y: 0.5 }}
                    style={styles.sendButton}
                  >

                    <TouchableOpacity
                      style={styles.sendButtonContent}
                      onPress={handleSendNow}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.sendButtonText}>Send Now</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </>
            ) : (
              <>
                {/* Message Section */}
                <View style={styles.messageSection}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Message
                  </Text>
                  <TextInput
                    ref={messageInputRef}
                    style={[
                      styles.messageInput,
                      {
                        color: theme.colors.text,
                        maxHeight: 200, // ~10 lines (20px per line approx.)
                        textAlignVertical: "top", // important for Android
                        height: 140
                      },
                    ]}
                    value={message}
                    onChangeText={setMessage}
                    placeholder="Enter your message..."
                    placeholderTextColor={theme.colors.text}
                    multiline={true}
                    numberOfLines={10}
                    maxLength={200}
                  />

                </View>

                {/* Amount to Send Section */}
                <View style={styles.amountToSendSection}>
                  <Text style={[styles.sectionLabel, { color: theme.colors.textSecondary }]}>
                    Amount to Send
                  </Text>
                  <Text style={[styles.amountToSendText, { color: theme.colors.text }]}>
                    {displayAmount()}
                  </Text>
                </View>

                {/* Send Now Button */}
                <View style={{ marginTop: "auto" }}>
                  <TouchableOpacity
                    style={styles.addMessageButton}
                    onPress={() => setShowMessage(false)}
                    activeOpacity={0.7}
                  >
                    <View style={{ flexDirection: "row", alignItems: 'center' }}>
                      <Text style={styles.addMessageText}>{message ?? "Add Message"}</Text>
                      <MaterialIcons
                        name="edit"
                        size={18}
                        color="#4A90E2"
                        style={{ marginLeft: 6 }}
                      />
                      {/* <Edit size={20} color="#000" style={{ marginLeft: 8 }} /> */}
                    </View>
                  </TouchableOpacity>
                  <LinearGradient
                    colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.5, y: 0.5 }}
                    style={{
                      borderRadius: 12,
                      marginTop: 'auto',
                      marginBottom: 20,
                    }}
                  >
                    <TouchableOpacity
                      style={styles.sendButtonContent}
                      onPress={handleSendNow}
                      disabled={isLoading}
                    >
                      {isLoading ? (
                        <ActivityIndicator size="small" color="#FFFFFF" />
                      ) : (
                        <Text style={styles.sendButtonText}>Send Now</Text>
                      )}
                    </TouchableOpacity>
                  </LinearGradient>
                </View>
              </>
            )}
          </View>
        </KeyboardAvoidingView>

        {/* Success Modal */}
        <SuccessModal
          visible={showSuccessModal}
          onClose={handleCloseSuccessModal}
          amount={amount}
          recipient={recipient}
          transferResult={transferResult}
        />
        
        {/* Toast Messages */}
        <Toast />
      </SafeAreaView>
    </TouchableWithoutFeedback>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#282830',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    backgroundColor: '#1A1A22',
    gap: 85
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  backButton: {
    marginRight: 16,
  },
  backIcon: {
    fontSize: 24,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  recipientName: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  mainContent: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
  },
  amountContainer: {
    alignItems: 'center',
    flex: 0.6,
    justifyContent: 'center',
  },
  amountText: {
    fontSize: 48,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  addMessageButton: {
    alignItems: 'center',
    marginBottom: 20,
  },
  addMessageText: {
    fontSize: 16,
    color: '#4A90E2',
    fontWeight: '500',
  },
  sendButton: {
    borderRadius: 12,
    marginTop: 'auto',
    marginBottom: 20,
  },
  sendButtonContent: {
    paddingVertical: 16,
    paddingHorizontal: 24,
    alignItems: 'center',
  },
  sendButtonText: {
    fontSize: 18,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
  messageSection: {
    marginBottom: 30,
    paddingTop: 25
  },
  sectionLabel: {
    fontSize: 14,
    color: '#9CA3AF',
    marginBottom: 8,
  },
  messageInput: {
    fontSize: 16,
    color: '#FFFFFF',
    paddingVertical: 8,
    minHeight: 40,
  },
  amountToSendSection: {
    marginBottom: 40,
  },
  amountToSendText: {
    fontSize: 32,
    fontWeight: 'bold',
    color: '#FFFFFF',
  },
});

export default AddRecieveQr;
