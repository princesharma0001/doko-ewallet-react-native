import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  KeyboardAvoidingView,
  Platform,
  Alert,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const ForgotVerify = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { identity, userData } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isResending, setIsResending] = useState(false);
  const inputRefs = useRef([]);

  useEffect(() => {
    // Auto-focus first input when component mounts
    if (inputRefs.current[0]) {
      inputRefs.current[0].focus();
    }
  }, []);

  const handleOtpChange = (value, index) => {
    // Clear error message when user starts typing
    if (errorMessage) {
      setErrorMessage('');
    }

    // Only allow single digit
    if (value.length > 1) {
      value = value.slice(-1);
    }

    // Only allow digits
    if (!/^\d*$/.test(value)) {
      return;
    }

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Move to next input if value is entered
    if (value && index < 3) {
      setActiveIndex(index + 1);
      if (inputRefs.current[index + 1]) {
        inputRefs.current[index + 1].focus();
      }
    }
  };

  const handleInputFocus = (index) => {
    setActiveIndex(index);
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace') {
      if (otp[index]) {
        // Clear current input
        const newOtp = [...otp];
        newOtp[index] = '';
        setOtp(newOtp);
      } else if (index > 0) {
        // Move to previous input
        setActiveIndex(index - 1);
        if (inputRefs.current[index - 1]) {
          inputRefs.current[index - 1].focus();
        }
      }
    }
  };

  const handleSubmit = async () => {
    const completeOtp = otp.join('');
    
    // Check if OTP is empty or incomplete
    if (!completeOtp || completeOtp.length !== 4) {
      setErrorMessage('Please enter the 4-digit verification code');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    try {
      const result = await authService.verifyOTP(identity, completeOtp, "PASSWORD_RESET");
      console.log("SDAgasdgsa",result);
      
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Verification Successful',
          text2: 'Code verified successfully',
          position: 'top',
          visibilityTime: 2000,
        });
          await AsyncStorage.setItem(
          "dokoToken",
          result.data?.token
        );

        // Navigate to CreatePassword screen for passcode reset
        navigation.navigate('ForgotCreatePassword', {
          userData: userData,
          isResetPasscode: true
        });
      } else {
        Toast.show({
          type: 'error',
          text1: 'Verification Failed',
          text2: result.error || 'Invalid verification code',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Verification error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleResendCode = async () => {
    setIsResending(true);
    
    try {
      const result = await authService.forgotPasscode(identity);
      
      if (result.success) {
        Toast.show({
          type: 'success',
          text1: 'Code Sent',
          text2: 'New verification code sent successfully',
          position: 'top',
          visibilityTime: 2000,
        });
        
        // Clear current OTP
        setOtp(['', '', '', '']);
        setActiveIndex(0);
        if (inputRefs.current[0]) {
          inputRefs.current[0].focus();
        }
      } else {
        Toast.show({
          type: 'error',
          text1: 'Failed',
          text2: result.error || 'Failed to resend code',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Resend error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setIsResending(false);
    }
  };

  const renderOtpInput = (index) => {
    const isActive = activeIndex === index;
    const hasValue = otp[index] !== '';
    const hasError = errorMessage !== '';

    return (
      <TextInput
        key={index}
        ref={(ref) => (inputRefs.current[index] = ref)}
        style={[
          styles.otpInput,
          {
            borderColor: hasError ? '#FF3B30' : (isActive || hasValue ? theme.colors.text : '#3D4065'),
            backgroundColor: hasError ? 'rgba(255, 59, 48, 0.1)' : (isActive || hasValue ? 'rgba(255, 255, 255, 0.1)' : 'transparent'),
            color: hasError ? '#FF3B30' : theme.colors.text,
          },
        ]}
        value={otp[index]}
        onChangeText={(value) => handleOtpChange(value, index)}
        onKeyPress={({ nativeEvent }) => handleKeyPress(nativeEvent.key, index)}
        onFocus={() => handleInputFocus(index)}
        keyboardType="numeric"
        maxLength={1}
        textAlign="center"
        selectTextOnFocus
      />
    );
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Dark overlay for better text readability */}
        <View style={styles.overlay}>
          {/* Header with Back Button */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          </View>

          {/* Main Content */}
          <View style={styles.content}>
            {/* Title */}
            <Text
              style={[
                styles.title,
                {
                  color: theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.xxl,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              Verify Your Identity
            </Text>

            {/* Description */}
            <Text
              style={[
                styles.description,
                {
                  color: '#8C90BF',
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.md,
                  fontWeight: theme.typography.weights.regular,
                },
              ]}
            >
              Please enter 4-digit verification code sent to {identity}
            </Text>

            {/* OTP Input Fields */}
            <View style={styles.otpContainer}>
              {[0, 1, 2, 3].map((index) => renderOtpInput(index))}
            </View>

            {/* Error Message */}
            {errorMessage ? (
              <Text
                style={[
                  styles.errorMessage,
                  {
                    color: '#FF3B30',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.sizes.sm,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                {errorMessage}
              </Text>
            ) : null}
          </View>

          {/* Bottom Section with Submit Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.resendContainer}
              onPress={handleResendCode}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.resendText,
                  {
                    color: '#169BFF',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.sizes.md,
                    fontWeight: theme.typography.weights.medium,
                  },
                ]}
              >
                Didn't receive the code?
              </Text>
            </TouchableOpacity>
            <TouchableOpacity
              style={[styles.submitButton, isSubmitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              activeOpacity={isSubmitting ? 1 : 0.8}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={isSubmitting ? ["#666666", "#888888"] : ["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
                {isSubmitting ? (
                  <View style={styles.loadingContainer}>
                    <ActivityIndicator color="#FFFFFF" size="small" />
                    <Text
                      style={[
                        styles.createAccountText,
                        {
                          fontFamily: theme.typography.fontFamily,
                          fontSize: theme.typography.sizes.lg,
                          fontWeight: theme.typography.weights.medium,
                          marginLeft: 8,
                        },
                      ]}
                    >
                      Verifying...
                    </Text>
                  </View>
                ) : (
                  <Text
                    style={[
                      styles.createAccountText,
                      {
                        fontFamily: theme.typography.fontFamily,
                        fontSize: theme.typography.sizes.lg,
                        fontWeight: theme.typography.weights.medium,
                      },
                    ]}
                  >
                    Submit
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 20,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    flex: 1,
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    marginBottom: 30,
    lineHeight: 22,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
  },
  otpInput: {
    width: 70,
    height: 60,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 24,
    fontWeight: 'bold',
    color: '#FFFFFF',
    textAlign: 'center',
    marginHorizontal: 4,
  },
  resendContainer: {
    // marginBottom: 20,
  },
  resendText: {
    textAlign: 'center',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  submitButton: {
    marginTop: 20,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  submitText: {
    color: '#FFFFFF',
    textAlign: 'center',
    fontSize: 18,
    fontWeight: '600',
  },
  errorMessage: {
    textAlign: 'center',
    marginBottom: 8,
  },
  submitButtonDisabled: {
    opacity: 0.6,
  },
  debugContainer: {
    marginTop: 20,
    padding: 10,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    borderRadius: 8,
  },
  debugText: {
    color: '#FFFFFF',
    fontSize: 12,
    fontFamily: 'monospace',
    marginBottom: 4,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
});

export default ForgotVerify;
