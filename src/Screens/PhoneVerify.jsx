import React, { useState, useRef, useEffect } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import AntDesign from 'react-native-vector-icons/AntDesign';

const { width, height } = Dimensions.get('window');

const PhoneVerify = ({ navigation, route }) => {
  const { theme } = useTheme();
  const { phoneNumber, selectedCountry } = route.params || {};
  const [otp, setOtp] = useState(['', '', '', '']);
  const [activeIndex, setActiveIndex] = useState(0);
  const [errorMessage, setErrorMessage] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
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

    // Update OTP array
    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto-focus next input if value is entered
    if (value && index < 3) {
      setActiveIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }

    // Check if all fields are filled
    if (newOtp.every(digit => digit !== '')) {
      handleSubmit(newOtp.join(''));
    }
  };

  const handleKeyPress = (key, index) => {
    if (key === 'Backspace' && !otp[index] && index > 0) {
      // Move to previous input if current is empty and backspace is pressed
      setActiveIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    }
  };

  const handleInputFocus = (index) => {
    setActiveIndex(index);
  };

  const handleSubmit = (otpCode) => {
    // Check if OTP is complete
    const completeOtp = otpCode || otp.join('');

    if (!completeOtp || completeOtp.length !== 4 || otp.some(digit => digit === '')) {
      setErrorMessage('Invalid code entered. Please check the code and try again.');
      return;
    }

    setIsSubmitting(true);
    setErrorMessage('');

    // Here you would typically verify the OTP with your backend
    console.log('Verifying OTP:', completeOtp);
    console.log('OTP Array:', otp);
    console.log('Complete OTP length:', completeOtp.length);
    console.log('OTP includes empty:', otp.some(digit => digit === ''));

    // Simulate verification with a delay
    setTimeout(() => {
      setIsSubmitting(false);

      // Simulate verification - change this logic as needed
      // For testing: accept any 4-digit code, or specifically '1234'
      if (completeOtp === '1234' || /^\d{4}$/.test(completeOtp)) {
        Alert.alert('Success', 'Phone number verified successfully!', [
          { text: 'OK', onPress: () => navigation.navigate('EnterNameSign') }
        ]);
      } else {
        setErrorMessage('Invalid code entered. Please check the code and try again.');
        // Clear OTP fields
        setOtp(['', '', '', '']);
        setActiveIndex(0);
        inputRefs.current[0]?.focus();
      }
    }, 1000);
  };

  const handleResendCode = () => {
    Alert.alert(
      'Resend Code',
      'A new verification code has been sent to your phone number.',
      [{ text: 'OK' }]
    );
    if (onResendCode) {
      onResendCode();
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
                  color:theme.colors.text,
                  fontFamily: theme.typography.fontFamily,
                  fontSize: theme.typography.sizes.xxl,
                  fontWeight: theme.typography.weights.bold,
                },
              ]}
            >
              Phone Verification
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
              Please enter 4-digit verification code sent to +91XXXXXXXX22
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

            {/* Resend Code Link */}

            {/* Debug Info - Remove in production */}


          </View>

          {/* Bottom Section with Submit Button */}
          <View style={styles.bottomSection}>
            <TouchableOpacity
              style={styles.resendContainer}
              // onPress={handleResendCode}
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
              onPress={() => handleSubmit(otp.join(''))}
              activeOpacity={isSubmitting ? 1 : 0.8}
              disabled={isSubmitting}
            >
              <LinearGradient
                colors={isSubmitting ? ["#666666", "#888888"] : ["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text
                  style={[
                    styles.createAccountText,
                    {
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.sizes.lg,
                      fontWeight: theme.typography.weights.medium,
                      opacity: isSubmitting ? 0.7 : 1,
                    },
                  ]}
                >
                  {isSubmitting ? 'Verifying...' : 'Submit'}
                </Text>
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
    // backgroundColor: 'rgba(0, 0, 0, 0.4)',
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
    // alignItems: 'center',
    // justifyContent: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    // textAlign: 'center',
    marginBottom: 16,
    letterSpacing: 0.5,
  },
  description: {
    // textAlign: 'center',
    marginBottom: 30,
    lineHeight: 22,
    // paddingHorizontal: 20,
  },
  otpContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 20,
    // paddingHorizontal: 20,
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
    // textDecorationLine: 'underline',
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 40,
  },
  submitButton: {
    marginBottom: 16,
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
    // marginTop: 12,
    marginBottom: 8,
    // paddingHorizontal: 20,
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
});

export default PhoneVerify;
