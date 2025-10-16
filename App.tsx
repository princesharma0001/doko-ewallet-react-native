/**
 * Sample React Native App
 * https://github.com/facebook/react-native
 *
 * @format
 */

import { StatusBar, StyleSheet } from 'react-native';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { Provider } from 'react-redux';
import Toast from 'react-native-toast-message';
import { StripeProvider } from '@stripe/stripe-react-native';
import { ThemeProvider, useTheme } from './src/context/ThemeContext';
import { LanguageProvider } from './src/context/LanguageContext';
import AppNavigator from './src/navigation/AppNavigator';
import { store } from './src/store';

// Replace with your actual Stripe publishable key
const STRIPE_PUBLISHABLE_KEY = 'pk_test_51SAlyKDQjTqdiW4xekxCvTTkStzWJnOTEHPb2IQX7PvMG9LXI2AknvzmVSVhpycpdVmf7ON2oWhoc6wl6cHo7kfo00VAfD2ENF';

function AppContent() {
  const { isDarkMode } = useTheme();

  return (
    <>
      <StatusBar 
        barStyle={isDarkMode ? 'light-content' : 'dark-content'} 
        backgroundColor={isDarkMode ? '#1C1C27' : '#FFFFFF'}
      />
      <AppNavigator />
      <Toast />
    </>
  );
}

function App() {
  return (
    <Provider store={store}>
      <SafeAreaProvider>
        <StripeProvider
          publishableKey={STRIPE_PUBLISHABLE_KEY}
          merchantIdentifier="merchant.com.doko.ewallet" // Replace with your merchant ID
          urlScheme="doko-ewallet" // Replace with your URL scheme
        >
          <ThemeProvider>
            <LanguageProvider>
              <AppContent />
            </LanguageProvider>
          </ThemeProvider>
        </StripeProvider>
      </SafeAreaProvider>
    </Provider>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
});

export default App;
