import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useScreenNavigation } from '../hooks/useNavigation';
import Button from './Button';
import { useTheme } from '../theme';

const NavigationExample = () => {
  const { colors, spacing, typography } = useTheme();
  
  // Using the basic navigation hook
  const navigation = useNavigation();
  
  // Using the screen-specific navigation hook
  const screenNav = useScreenNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Navigation Example
      </Text>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Current State
        </Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Current Screen: {navigation.currentScreen}
        </Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Can Go Back: {navigation.canGoBack() ? 'Yes' : 'No'}
        </Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Phone Verified: {screenNav.isPhoneVerified() ? 'Yes' : 'No'}
        </Text>
        <Text style={[styles.info, { color: colors.textSecondary }]}>
          Has User Data: {screenNav.hasUserData() ? 'Yes' : 'No'}
        </Text>
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Navigation Actions
        </Text>
        
        <Button 
          title="Go to Signup" 
          variant="primary" 
          onPress={screenNav.goToSignup}
          style={styles.button}
        />
        
        <Button 
          title="Go to Phone Verify" 
          variant="outline" 
          onPress={() => screenNav.goToPhoneVerify('+91-9650448097')}
          style={styles.button}
        />
        
        <Button 
          title="Go to Main App" 
          variant="secondary" 
          onPress={screenNav.goToMainApp}
          style={styles.button}
        />
        
        <Button 
          title="Go to Button Examples" 
          variant="gradient"
          gradientColors={['#667eea', '#764ba2']}
          onPress={screenNav.goToButtonExamples}
          style={styles.button}
        />
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Navigation History
        </Text>
        {navigation.navigationHistory.map((screen, index) => (
          <Text 
            key={index} 
            style={[
              styles.historyItem, 
              { 
                color: screen === navigation.currentScreen ? colors.primary : colors.textSecondary,
                fontWeight: screen === navigation.currentScreen ? 'bold' : 'normal'
              }
            ]}
          >
            {index + 1}. {screen}
          </Text>
        ))}
      </View>

      <View style={styles.section}>
        <Text style={[styles.sectionTitle, { color: colors.text }]}>
          Advanced Actions
        </Text>
        
        <Button 
          title="Go Back" 
          variant="secondary" 
          onPress={navigation.goBack}
          disabled={!navigation.canGoBack()}
          style={styles.button}
        />
        
        <Button 
          title="Reset to Splash" 
          variant="danger" 
          onPress={() => navigation.resetToScreen('SPLASH')}
          style={styles.button}
        />
        
        <Button 
          title="Replace with Main App" 
          variant="outline" 
          onPress={() => navigation.replaceScreen('MAIN_APP')}
          style={styles.button}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 20,
  },
  section: {
    marginBottom: 30,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  info: {
    fontSize: 14,
    marginBottom: 5,
  },
  button: {
    marginBottom: 10,
  },
  historyItem: {
    fontSize: 14,
    marginBottom: 5,
    paddingLeft: 10,
  },
});

export default NavigationExample;
