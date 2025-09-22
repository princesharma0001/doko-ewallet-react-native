import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);

  useEffect(() => {
    // Start the splash screen animation
    Animated.parallel([
      Animated.timing(fadeAnim, {
        toValue: 1,
        duration: 1000,
        useNativeDriver: true,
      }),
      Animated.spring(scaleAnim, {
        toValue: 1,
        tension: 50,
        friction: 7,
        useNativeDriver: true,
      }),
    ]).start();

    // Auto navigate to Signup after 3 seconds
    const timer = setTimeout(() => {
      navigation.replace('Login');
    }, 3000);

    return () => clearTimeout(timer);
  }, [fadeAnim, scaleAnim, navigation]);

  return (
    <View style={[styles.container, { backgroundColor: "#292935" }]}>
      <Animated.View
        style={[
          styles.content,
          {
            opacity: fadeAnim,
            transform: [{ scale: scaleAnim }],
          },
        ]}
      >
        {/* Logo */}
        <View style={styles.logoContainer}>
          <Image
            source={require('../assets/Images/Doko_with_Bamboo_Net_Logo.png')}
            style={styles.logo}
            resizeMode="contain"
          />
        </View>

        {/* App Name */}
        {/* <Text
          style={[
            styles.appName,
            {
              color: colors.text,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.xxl,
              fontWeight: typography.weights.bold,
              marginTop: spacing.xl,
            },
          ]}
        >
          DOKO
        </Text> */}

        {/* Tagline */}
        {/* <Text
          style={[
            styles.tagline,
            {
              color: colors.textSecondary || colors.text,
              fontFamily: typography.fontFamily,
              fontSize: typography.sizes.md,
              fontWeight: typography.weights.regular,
              marginTop: spacing.sm,
              opacity: 0.8,
            },
          ]}
        >
          Your Sustainable Shopping Companion
        </Text> */}

        {/* Loading indicator */}
        {/* <View style={[styles.loadingContainer, { marginTop: spacing.xl }]}>
          <View
            style={[
              styles.loadingDot,
              { backgroundColor: colors.primary || colors.text },
            ]}
          />
          <View
            style={[
              styles.loadingDot,
              { backgroundColor: colors.primary || colors.text },
            ]}
          />
          <View
            style={[
              styles.loadingDot,
              { backgroundColor: colors.primary || colors.text },
            ]}
          />
        </View> */}
      </Animated.View>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
     backgroundColor: '#000000',
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  logoContainer: {
    width: width * 0.6,
    height: width * 0.6,
    justifyContent: 'center',
    alignItems: 'center',
  },
  logo: {
    width: '100%',
    height: '100%',
  },
  appName: {
    textAlign: 'center',
    letterSpacing: 2,
  },
  tagline: {
    textAlign: 'center',
    letterSpacing: 0.5,
  },
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
  },
  loadingDot: {
    width: 8,
    height: 8,
    borderRadius: 4,
    marginHorizontal: 4,
    opacity: 0.6,
  },
});

export default Splash;
