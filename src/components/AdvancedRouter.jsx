import React, { useState, useCallback, useRef, useEffect } from 'react';
import { View, StyleSheet, BackHandler, Alert, Text } from 'react-native';
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
  EMAIL_VERIFY: 'EMAIL_VERIFY',
};

// Navigation context
export const NavigationContext = React.createContext();

const AdvancedRouter = () => {
  const { colors } = useTheme();
  
  // Navigation state
  const [currentScreen, setCurrentScreen] = useState(SCREEN_TYPES.SPLASH);
  const [navigationHistory, setNavigationHistory] = useState([SCREEN_TYPES.SPLASH]);
  const [screenData, setScreenData] = useState({
    userPhoneNumber: '',
    selectedCountry: {
      name: 'Poland Gold',
      code: '+01',
      flag: '🇵🇱',
      currency: 'PLN'
    },
    userData: {},
  });

  // Refs for navigation
  const navigationRef = useRef({
    canGoBack: () => navigationHistory.length > 1,
    getCurrentScreen: () => currentScreen,
    getHistory: () => navigationHistory,
  });

  // Handle Android back button
  useEffect(() => {
    const backAction = () => {
      if (navigationRef.current.canGoBack()) {
        goBack();
        return true;
      } else {
        Alert.alert(
          'Exit App',
          'Are you sure you want to exit?',
          [
            { text: 'Cancel', style: 'cancel' },
            { text: 'Exit', onPress: () => BackHandler.exitApp() }
          ]
        );
        return true;
      }
    };

    const backHandler = BackHandler.addEventListener('hardwareBackPress', backAction);
    return () => backHandler.remove();
  }, [navigationHistory]);

  // Navigation functions
  const navigateTo = useCallback((screen, data = {}, addToHistory = true) => {
    console.log(`Navigating to: ${screen}`, data);
    
    setCurrentScreen(screen);
    
    if (Object.keys(data).length > 0) {
      setScreenData(prev => ({ ...prev, ...data }));
    }

    if (addToHistory) {
      setNavigationHistory(prev => [...prev, screen]);
    }
  }, []);

  const goBack = useCallback(() => {
    if (navigationHistory.length <= 1) {
      console.log('Cannot go back - at root screen');
      return;
    }

    const previousScreen = navigationHistory[navigationHistory.length - 2];
    console.log(`Going back from: ${currentScreen} to: ${previousScreen}`);
    
    setCurrentScreen(previousScreen);
    setNavigationHistory(prev => prev.slice(0, -1));
  }, [currentScreen, navigationHistory]);

  const resetToScreen = useCallback((screen, data = {}) => {
    console.log(`Resetting to: ${screen}`, data);
    setCurrentScreen(screen);
    setNavigationHistory([screen]);
    
    if (Object.keys(data).length > 0) {
      setScreenData(prev => ({ ...prev, ...data }));
    }
  }, []);

  const replaceScreen = useCallback((screen, data = {}) => {
    console.log(`Replacing current screen with: ${screen}`, data);
    setCurrentScreen(screen);
    setNavigationHistory(prev => [...prev.slice(0, -1), screen]);
    
    if (Object.keys(data).length > 0) {
      setScreenData(prev => ({ ...prev, ...data }));
    }
  }, []);

  // Screen-specific handlers
  const handleSplashFinish = useCallback(() => {
    navigateTo(SCREEN_TYPES.SIGNUP);
  }, [navigateTo]);

  const handleSignupSuccess = useCallback((phoneNumber) => {
    console.log('Signup successful with:', phoneNumber);
    navigateTo(SCREEN_TYPES.PHONE_VERIFY, { userPhoneNumber: phoneNumber });
  }, [navigateTo]);

  const handleEmailVerify = useCallback((phoneNumber) => {
    console.log('Signup successful with:', phoneNumber);
    navigateTo(SCREEN_TYPES.EMAIL_VERIFY, { userPhoneNumber: phoneNumber });
  }, [navigateTo]);

  const handlePhoneVerifySuccess = useCallback(() => {
    console.log('Phone verification successful');
    navigateTo(SCREEN_TYPES.ENTER_NAME_SIGN, { 
      userData: { 
        ...screenData.userData, 
        phoneVerified: true,
        phoneNumber: screenData.userPhoneNumber 
      } 
    });
  }, [navigateTo, screenData]);

  const handleEnterNameSuccess = useCallback((nameData) => {
    console.log('Name entry successful:', nameData);
    navigateTo(SCREEN_TYPES.MAIN_APP, { 
      userData: { 
        ...screenData.userData, 
        ...nameData,
        profileComplete: true
      } 
    });
  }, [navigateTo, screenData]);

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

  const handleLogout = useCallback(() => {
    Alert.alert(
      'Logout',
      'Are you sure you want to logout?',
      [
        { text: 'Cancel', style: 'cancel' },
        { 
          text: 'Logout', 
          onPress: () => {
            resetToScreen(SCREEN_TYPES.SPLASH, {
              userData: {},
              userPhoneNumber: '',
            });
          }
        }
      ]
    );
  }, [resetToScreen]);

  // Navigation context value
  const navigationContextValue = {
    // Current state
    currentScreen,
    screenData,
    navigationHistory,
    
    // Navigation functions
    navigateTo,
    goBack,
    resetToScreen,
    replaceScreen,
    
    // Utility functions
    canGoBack: navigationRef.current.canGoBack,
    getCurrentScreen: navigationRef.current.getCurrentScreen,
    getHistory: navigationRef.current.getHistory,
    
    // Screen-specific handlers
    handleSplashFinish,
    handleSignupSuccess,
    handlePhoneVerifySuccess,
    handleEnterNameSuccess,
    handleResendCode,
    handleSignIn,
    handleShowButtonExamples,
    handleShowSignup,
    handleShowPhoneVerify,
    handleLogout,
  };

  // Update navigation ref
  useEffect(() => {
    navigationRef.current = {
      canGoBack: () => navigationHistory.length > 1,
      getCurrentScreen: () => currentScreen,
      getHistory: () => navigationHistory,
    };
  }, [currentScreen, navigationHistory]);

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

      case SCREEN_TYPES.ENTER_NAME_SIGN:
        return (
          <EnterNameSign
            onContinue={handleEnterNameSuccess}
            onSignIn={handleSignIn}
            onBack={goBack}
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
            onLogout={handleLogout}
            userData={screenData.userData}
          />
        );

      default:
        return (
          <MainApp 
            onShowSignup={handleShowSignup}
            onShowPhoneVerify={handleShowPhoneVerify}
            onShowButtonExamples={handleShowButtonExamples}
            onLogout={handleLogout}
            userData={screenData.userData}
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

// Main App component
const MainApp = ({ onShowSignup, onShowPhoneVerify, onShowButtonExamples, onLogout, userData }) => {
  const { colors, spacing, typography } = useTheme();
  const { navigateTo, goBack } = React.useContext(NavigationContext);

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

        {userData.phoneVerified && (
          <Text style={{
            color: colors.textSecondary || colors.text,
            fontSize: typography.sizes.sm,
            marginBottom: spacing.md,
          }}>
            Welcome! Phone verified: {userData.phoneNumber}
          </Text>
        )}
        
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
          {userData.phoneVerified && (
            <Button 
              title="Logout" 
              variant="danger" 
              onPress={onLogout} 
            />
          )}
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

export default AdvancedRouter;
