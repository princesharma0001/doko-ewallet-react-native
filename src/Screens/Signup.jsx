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
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import CountryPicker from '../components/CountryPicker';
import { useTheme } from '../context/ThemeContext';
import { SafeAreaView } from 'react-native-safe-area-context';

const { width, height } = Dimensions.get('window');

const Signup = ({ navigation }) => {
  const [phoneNumber, setPhoneNumber] = useState('');
  const { theme,isDarkMode } = useTheme();
  console.log("adgsadgasd",isDarkMode);
  

  const [selectedCountry, setSelectedCountry] = useState({
    name: 'Poland Gold',
    code: '+01',
    flag: '🇵🇱',
    currency: 'PLN'
  });
  const [showCountryPicker, setShowCountryPicker] = useState(false);

  const handleCreateAccount = () => {
    if (!phoneNumber.trim()) {
      Alert.alert('Error', 'Please enter your phone number');
      return;
    }

    if (phoneNumber.length < 10) {
      Alert.alert('Error', 'Please enter a valid phone number');
      return;
    }

    // Navigate to PhoneVerify with phone number
    const fullPhoneNumber = selectedCountry.code + phoneNumber;
    console.log('Creating account with:', fullPhoneNumber);
    navigation.navigate('PhoneVerify', {
      userPhoneNumber: fullPhoneNumber,
      selectedCountry: selectedCountry
    });
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
              style={styles.createAccountButton}
              onPress={handleCreateAccount}
              activeOpacity={0.8}
            >
              <LinearGradient
                // colors={['#007AFF', '#6B22E7']}
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}   // top-left
                end={{ x: 1.5, y: 0.5 }}  // towards right-middle

                style={styles.gradientButton}
              >
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
});

export default Signup;
