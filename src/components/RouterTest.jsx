import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { useNavigation, useScreenNavigation } from '../hooks/useNavigation';
import Button from './Button';
import { useTheme } from '../theme';

const RouterTest = () => {
  const { colors, spacing, typography } = useTheme();
  const navigation = useNavigation();
  const screenNav = useScreenNavigation();

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Router Test
      </Text>
      
      <Text style={[styles.info, { color: colors.textSecondary }]}>
        Current Screen: {navigation.currentScreen}
      </Text>
      
      <Text style={[styles.info, { color: colors.textSecondary }]}>
        Can Go Back: {navigation.canGoBack() ? 'Yes' : 'No'}
      </Text>
      
      <View style={styles.buttonContainer}>
        <Button 
          title="Test Navigation" 
          variant="primary" 
          onPress={() => {
            console.log('Navigation test successful!');
            screenNav.goToSignup();
          }}
        />
      </View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 20,
  },
  info: {
    fontSize: 16,
    marginBottom: 10,
  },
  buttonContainer: {
    marginTop: 20,
  },
});

export default RouterTest;
