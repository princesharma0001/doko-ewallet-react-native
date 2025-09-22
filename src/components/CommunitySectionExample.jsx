import React from 'react';
import { View, Alert } from 'react-native';
import CommunitySection from './CommunitySection';
import { ThemeProvider } from '../context/ThemeContext';

const CommunitySectionExample = () => {
  const handleBackPress = () => {
    Alert.alert('Back', 'Navigate back to previous screen');
    // Add your navigation logic here
    // Example: navigation.goBack();
  };

  const handleCreateChannel = () => {
    Alert.alert('Create Channel', 'Navigate to create channel screen');
    // Add your navigation logic here
    // Example: navigation.navigate('CreateChannel');
  };

  return (
    <ThemeProvider>
      <CommunitySection
        onBackPress={handleBackPress}
        onCreateChannel={handleCreateChannel}
      />
    </ThemeProvider>
  );
};

export default CommunitySectionExample;
