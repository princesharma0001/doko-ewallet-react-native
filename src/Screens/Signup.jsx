import React, { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  Image,
  Alert,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ActivityIndicator,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import Toast from 'react-native-toast-message';
import CountryPicker from '../components/CountryPicker';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';
import { authService } from '../services/apiService';

const { width, height } = Dimensions.get('window');

const Signup = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const { theme,isDarkMode } = useTheme();
  console.log("adgsadgasd",isDarkMode);
  

  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Poland Gold',
    code: '+01',
    flag: '🇵🇱',
    currency: 'PLN'
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleCreateAccount = async () => {
    if (!phoneNumber.trim()) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter your phone number',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    if (phoneNumber.length < 10) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Please enter a valid phone number',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setIsLoading(true);

    try {
      // Prepare signup data with only country code and phone number
      const signupData = {
        countryCode: selectedCountry.code,
        phone: phoneNumber,
        // email: `user${Date.now()}@example.com`, // Generate temporary email
        // username: `user${Date.now()}`, // Generate temporary username
        // firstName: 'User', // Default first name
        // lastName: 'Name', // Default last name
        // passcode: '123456', // Default passcode
        // deviceToken: 'device_token_here' // Default device token
      };

      console.log('Calling signup API with:', signupData);

      // Call signup API
      const signupResult = await authService.signup(signupData);

      if (signupResult.success) {
        console.log('Signup successful:', signupResult.data);
        
        // Call resend OTP API with the email from signup response
        const resendOTPResult = await authService.resendOTP(signupResult?.data?.phone);
        
        if (resendOTPResult.success) {
          console.log('OTP sent successfully',resendOTPResult);
          Toast.show({
            type: 'success',
            text1: 'Success',
            text2: `Account created successfully! ${resendOTPResult.data?.otp} OTP has been sent to your phone.`,
            position: 'top',
            visibilityTime: 4000,
          });
          
          // Navigate to PhoneVerify with the created user data
          navigation.navigate('PhoneVerify', {
            userPhoneNumber:phoneNumber,
            selectedCountry: selectedCountry,
            userData: signupResult.data,
            phone: signupResult.data.phone
          });
        } else {
          console.error('Resend OTP failed:', resendOTPResult);
          Toast.show({
            type: 'error',
            text1: 'Error',
            text2: resendOTPResult.error,
            position: 'top',
            visibilityTime: 4000,
          });
        }
      } else {
        console.error('Signup failed:', signupResult.error);
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: signupResult.error || 'Failed to create account. Please try again.',
          position: 'top',
          visibilityTime: 4000,
        });
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'An unexpected error occurred. Please try again.',
        position: 'top',
        visibilityTime: 4000,
      });
    } finally {
      setIsLoading(false);
    }
  };

  const handleSignIn = () => {
    navigation.navigate('Login');

    // Navigate to sign in screen (you can create this later)
    console.log('Navigate to Sign In screen');
  };

  const handleCountryCodePress = () => {
    setShowCountryPicker(true);
  };

  const handleCountrySelect = (country) => {
    setSelectedCountry(country);
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
          {/* Header with Logo and App Name */}
          <View style={styles.header}>
            <View style={styles.logoContainer}>
              <Image
                source={isDarkMode ? require('../assets/Images/Doko_with_Bamboo_Net_Logo.png') :require('../assets/Images/BlackLogo.png') }
                style={styles.logo}
                resizeMode="contain"
              />
            </View>
          </View>

          {/* Main Title */}
          <Text
            style={[
              styles.title,
              {
                color: theme.colors.text,
                fontFamily: theme.typography.fontFamily,
                fontSize: theme.typography.sizes.xxl,
                fontWeight: theme.typography.weights.bold,
                marginTop: theme.spacing.xl,
              },
            ]}
          >
            Let's Get Started!
          </Text>

          {/* Input Section */}
          <View style={styles.inputSection}>
            <View style={styles.inputContainer}>
              {/* Country Code Button */}
              <TouchableOpacity
                style={[
                  styles.countryCodeButton,
                  {
                    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#3D4065',
                  },
                ]}
                onPress={handleCountryCodePress}
              >
                <View style={styles.flagContainer}>
                  <Text style={styles.flagEmoji}>{selectedCountry.flag}</Text>
                </View>
                <Text
                  style={[
                    styles.countryCodeText,
                    {
                      color: theme.colors.text,
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.sizes.md,
                    },
                  ]}
                >
                  {selectedCountry.code}
                </Text>
              </TouchableOpacity>

              {/* Phone Number Input */}
              <TextInput
                style={[
                  styles.phoneInput,
                  {
                    // backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    borderColor: '#3D4065',
                    color: '#9E9E9E',
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
                placeholder="Enter your phone number"
                placeholderTextColor="#9E9E9E"
                value={phoneNumber}
                onChangeText={setPhoneNumber}
                keyboardType="phone-pad"
                maxLength={15}
              />
            </View>
          </View>

          {/* Bottom Fixed Section */}
          <View style={styles.bottomSection}>
            {/* Create Account Button */}
            <TouchableOpacity
              style={[
                styles.createAccountButton,
                isLoading && styles.disabledButton
              ]}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
              disabled={isLoading}
            >
              <LinearGradient
                // colors={['#007AFF', '#6B22E7']}
                colors={isLoading ? ["#9E9E9E", "#9E9E9E", "#9E9E9E", "#9E9E9E"] : ["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}   // top-left
                end={{ x: 1.5, y: 0.5 }}  // towards right-middle

                style={styles.gradientButton}
              >
                {isLoading ? (
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
                      Creating Account...
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
                    Create Account
                  </Text>
                )}
              </LinearGradient>
            </TouchableOpacity>

            {/* Sign In Link */}
            <View style={styles.signInContainer}>
              <Text
                style={[
                  styles.signInText,
                  {
                    color: theme.colors.text,
                    fontFamily: theme.typography.fontFamily,
                    fontSize: theme.typography.sizes.md,
                  },
                ]}
              >
                Already have an account?{' '}
              </Text>
              <TouchableOpacity onPress={handleSignIn}>
                <Text
                  style={[
                    styles.signInLink,
                    {
                      color: '#007AFF',
                      fontFamily: theme.typography.fontFamily,
                      fontSize: theme.typography.sizes.md,
                      fontWeight: theme.typography.weights.semiBold,
                    },
                  ]}
                >
                  Sign In
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </KeyboardAvoidingView>

      {/* Country Picker Modal */}
      <CountryPicker
        visible={showCountryPicker}
        onClose={() => setShowCountryPicker(false)}
        onSelect={handleCountrySelect}
        selectedCountry={selectedCountry}
      />
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
    // backgroundColor: 'rgba(0, 0, 0, 0.4)', // Dark overlay for better text readability
    paddingHorizontal: 24,
    paddingTop: 40,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingTop: 10,
  },
  logoContainer: {
    width: 150,
    height: 40,
    marginRight: 12,
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    letterSpacing: 1,
  },
  title: {
    letterSpacing: 0.5,
  },
  inputSection: {
    flex: 1,
    justifyContent: 'flex-start',
    paddingTop: 40,
  },
  inputContainer: {
    flexDirection: 'row',
    marginBottom: 24,
    gap: 12,
  },
  bottomSection: {
    paddingBottom: 50,
  },
  countryCodeButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    minWidth: 100,
  },
  flagContainer: {
    marginRight: 8,
  },
  flag: {
    width: 20,
    height: 14,
    backgroundColor: '#FF0000', // Red flag color
    borderRadius: 2,
    position: 'relative',
  },
  flagEmoji: {
    fontSize: 18,
  },
  countryCodeText: {
    fontWeight: '500',
  },
  phoneInput: {
    flex: 1,
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
    fontSize: 16,
  },
  createAccountButton: {
    marginBottom: 16,
    marginTop: 20,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  createAccountText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  signInContainer: {
    flexDirection: 'row',
    justifyContent: 'center',
    alignItems: 'center',
  },
  signInText: {
    textAlign: 'center',
  },
  signInLink: {
    textAlign: 'center',
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabledButton: {
    opacity: 0.7,
  },
});

export default Signup;
