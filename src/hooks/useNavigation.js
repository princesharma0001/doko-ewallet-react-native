import { useContext } from 'react';
import { NavigationContext } from '../components/AdvancedRouter';

/**
 * Custom hook for navigation
 * Provides access to navigation functions and current state
 */
export const useNavigation = () => {
  const context = useContext(NavigationContext);
  
  if (!context) {
    throw new Error('useNavigation must be used within a NavigationProvider');
  }
  
  return context;
};

/**
 * Custom hook for screen-specific navigation
 * Provides common navigation patterns
 */
export const useScreenNavigation = () => {
  const navigation = useNavigation();
  
  return {
    // Basic navigation
    navigate: navigation.navigateTo,
    goBack: navigation.goBack,
    reset: navigation.resetToScreen,
    replace: navigation.replaceScreen,
    
    // Screen-specific navigation
    goToSplash: () => navigation.navigateTo('SPLASH'),
    goToSignup: () => navigation.navigateTo('SIGNUP'),
    goToPhoneVerify: (phoneNumber) => navigation.navigateTo('PHONE_VERIFY', { userPhoneNumber: phoneNumber }),
    goToEnterNameSign: () => navigation.navigateTo('ENTER_NAME_SIGN'),
    goToMainApp: () => navigation.navigateTo('MAIN_APP'),
    goToButtonExamples: () => navigation.navigateTo('BUTTON_EXAMPLES'),
    
    // Current state
    currentScreen: navigation.currentScreen,
    screenData: navigation.screenData,
    canGoBack: navigation.canGoBack(),
    
    // Utility functions
    isCurrentScreen: (screen) => navigation.currentScreen === screen,
    hasUserData: () => Object.keys(navigation.screenData.userData || {}).length > 0,
    isPhoneVerified: () => navigation.screenData.userData?.phoneVerified === true,
  };
};

export default useNavigation;
