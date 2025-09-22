import React, { useState, useCallback } from 'react';
import { View, StyleSheet, Text } from 'react-native';
import { useTheme } from '../theme';
import Button from './Button';

// Import all screens
import Splash from '../Screens/Splash';
import Signup from '../Screens/Signup';
import PhoneVerify from '../Screens/PhoneVerify';
import EnterNameSign from '../Screens/EnterNameSign';
import ButtonExamples from './ButtonExamples';

// Define screen types
export const SCREEN_TYPES = {
  SPLASH: 'SPLASH',
  SIGNUP: 'SIGNUP',
  PHONE_VERIFY: 'PHONE_VERIFY',
  ENTER_NAME_SIGN: 'ENTER_NAME_SIGN',
  MAIN_APP: 'MAIN_APP',
  BUTTON_EXAMPLES: 'BUTTON_EXAMPLES',
};

// Navigation context for passing navigation functions
export const NavigationContext = React.createContext();

const Router = () => {
  const { colors } = useTheme();
  
  // Current screen state
  const [currentScreen, setCurrentScreen] = useState(SCREEN_TYPES.SPLASH);
  
  // Screen-specific data
  const [screenData, setScreenData] = useState({
    userPhoneNumber: '',
    selectedCountry: {
      name: 'Poland Gold',
      code: '+01',
      flag: '🇵🇱',
      currency: 'PLN'
    },
  });

  // Navigation functions
  const navigateTo = useCallback((screen, data = {}) => {
    console.log(`Navigating to: ${screen}`, data);
    setCurrentScreen(screen);
    if (Object.keys(data).length > 0) {
      setScreenData(prev => ({ ...prev, ...data }));
    }
  }, []);

  const goBack = useCallback(() => {
    console.log(`Going back from: ${currentScreen}`);
    // Define back navigation logic
    switch (currentScreen) {
      case SCREEN_TYPES.PHONE_VERIFY:
        navigateTo(SCREEN_TYPES.SIGNUP);
        break;
      case SCREEN_TYPES.SIGNUP:
        navigateTo(SCREEN_TYPES.SPLASH);
        break;
      case SCREEN_TYPES.BUTTON_EXAMPLES:
        navigateTo(SCREEN_TYPES.MAIN_APP);
        break;
      default:
        navigateTo(SCREEN_TYPES.MAIN_APP);
    }
  }, [currentScreen, navigateTo]);

  // Screen-specific handlers
  const handleSplashFinish = useCallback(() => {
    navigateTo(SCREEN_TYPES.SIGNUP);
  }, [navigateTo]);

  const handleSignupSuccess = useCallback((phoneNumber) => {
    console.log('Signup successful with:', phoneNumber);
    navigateTo(SCREEN_TYPES.PHONE_VERIFY, { userPhoneNumber: phoneNumber });
  }, [navigateTo]);

  const handlePhoneVerifySuccess = useCallback(() => {
    console.log('Phone verification successful');
    navigateTo(SCREEN_TYPES.MAIN_APP);
  }, [navigateTo]);

  const handleResendCode = useCallback(() => {
    console.log('Resending verification code to:', screenData.userPhoneNumber);
    // Implement resend logic here
  }, [screenData.userPhoneNumber]);

  const handleSignIn = useCallback(() => {
    console.log('Navigate to Sign In screen');
    // You can implement navigation to sign in screen here
  }, []);

  const handleShowButtonExamples = useCallback(() => {
    navigateTo(SCREEN_TYPES.BUTTON_EXAMPLES);
  }, [navigateTo]);

  const handleShowSignup = useCallback(() => {
    navigateTo(SCREEN_TYPES.SIGNUP);
  }, [navigateTo]);

  const handleShowPhoneVerify = useCallback(() => {
    navigateTo(SCREEN_TYPES.PHONE_VERIFY, { 
      userPhoneNumber: '+91-9650448097' 
    });
  }, [navigateTo]);

  // Navigation context value
  const navigationContextValue = {
    currentScreen,
    screenData,
    navigateTo,
    goBack,
    // Screen-specific handlers
    handleSplashFinish,
    handleSignupSuccess,
    handlePhoneVerifySuccess,
    handleResendCode,
    handleSignIn,
    handleShowButtonExamples,
    handleShowSignup,
    handleShowPhoneVerify,
  };

  // Render current screen
  const renderCurrentScreen = () => {
    switch (currentScreen) {
      case SCREEN_TYPES.SPLASH:
        return (
          <Splash 
            onFinish={handleSplashFinish}
          />
        );

      case SCREEN_TYPES.SIGNUP:
        return (
          <Signup 
            onSignIn={handleSignIn}
            onSignupSuccess={handleSignupSuccess}
          />
        );

      case SCREEN_TYPES.PHONE_VERIFY:
        return (
          <PhoneVerify
            phoneNumber={screenData.userPhoneNumber}
            onVerifySuccess={handlePhoneVerifySuccess}
            onBack={goBack}
            onResendCode={handleResendCode}
          />
        );

      case SCREEN_TYPES.BUTTON_EXAMPLES:
        return (
          <ButtonExamples />
        );

      case SCREEN_TYPES.MAIN_APP:
        return (
          <MainApp 
            onShowSignup={handleShowSignup}
            onShowPhoneVerify={handleShowPhoneVerify}
            onShowButtonExamples={handleShowButtonExamples}
          />
        );

      default:
        return (
          <MainApp 
            onShowSignup={handleShowSignup}
            onShowPhoneVerify={handleShowPhoneVerify}
            onShowButtonExamples={handleShowButtonExamples}
          />
        );
    }
  };

  return (
    <NavigationContext.Provider value={navigationContextValue}>
      <View style={[styles.container, { backgroundColor: colors.background }]}>
        {renderCurrentScreen()}
      </View>
    </NavigationContext.Provider>
  );
};

// Main App component (extracted from App.tsx)
const MainApp = ({ onShowSignup, onShowPhoneVerify, onShowButtonExamples }) => {
  const { colors, spacing, typography } = useTheme();
  const { navigateTo } = React.useContext(NavigationContext);

  const handleToggleTheme = () => {
    // This would need to be passed from the theme context
    console.log('Toggle theme');
  };

  return (
    <View style={[styles.mainAppContainer, { backgroundColor: colors.background }]}>
      <View style={{ padding: spacing.lg }}>
        <Text style={{
          color: colors.text,
          fontSize: typography.sizes.xl,
          fontFamily: typography.fontFamily,
          fontWeight: typography.weights.bold,
          marginBottom: spacing.md,
        }}>
          DOKO
        </Text>
        
        <View style={{ gap: spacing.sm, marginBottom: spacing.lg }}>
          <Button 
            title="Toggle Theme" 
            variant="secondary" 
            onPress={handleToggleTheme} 
          />
          <Button 
            title="Show Signup Screen" 
            variant="primary" 
            onPress={onShowSignup} 
          />
          <Button 
            title="Show Phone Verify" 
            variant="outline" 
            onPress={onShowPhoneVerify} 
          />
          <Button 
            title="Button Examples" 
            variant="gradient"
            gradientColors={['#667eea', '#764ba2']}
            onPress={onShowButtonExamples} 
          />
        </View>
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  mainAppContainer: {
    flex: 1,
    justifyContent: 'center',
  },
});

export default Router;
