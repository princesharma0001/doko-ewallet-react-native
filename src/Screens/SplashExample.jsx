import React, { useState } from 'react';
import { View, StyleSheet, Button, Text } from 'react-native';
import Splash from './Splash';
import { useTheme } from '../theme';

const SplashExample = () => {
  const [showSplash, setShowSplash] = useState(false);
  const { colors, spacing } = useTheme();

  const handleSplashFinish = () => {
    setShowSplash(false);
    console.log('Splash screen finished!');
  };

  if (showSplash) {
    return <Splash onFinish={handleSplashFinish} />;
  }

  return (
    <View style={[styles.container, { backgroundColor: colors.background }]}>
      <Text style={[styles.title, { color: colors.text }]}>
        Splash Screen Example
      </Text>
      <Button
        title="Show Splash Screen"
        onPress={() => setShowSplash(true)}
        color={colors.primary}
      />
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
});

export default SplashExample;
