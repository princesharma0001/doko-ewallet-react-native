import React, { useEffect } from 'react';
import {
  View,
  Text,
  Image,
  StyleSheet,
  Dimensions,
  Animated,
} from 'react-native';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { useAppDispatch, useAppSelector } from '../store';
import { getProfile } from '../store/slices/userSlice';

const { width, height } = Dimensions.get('window');

const Splash = ({ navigation }) => {
  const fadeAnim = new Animated.Value(0);
  const scaleAnim = new Animated.Value(0.8);
  const dispatch = useAppDispatch();
  const { currentUser, isProfileLoading, profileError } = useAppSelector((state) => state.user);

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

    // Check for stored token and navigate accordingly
    const checkAuthAndNavigate = async () => {
      try {
        const token = await AsyncStorage.getItem('dokoToken');
        
        // Wait for splash animation to complete (2 seconds)
        setTimeout(async () => {
          if (token) {
            // Token exists - fetch profile using Redux
            dispatch(getProfile());
          } else {
            // No token - navigate to Login
            navigation.replace('Login');
          }
        }, 2000);
      } catch (error) {
        console.error('Error checking token:', error);
        // On error, navigate to Login
        setTimeout(() => {
          navigation.replace('Login');
        }, 2000);
      }
    };

    checkAuthAndNavigate();
  }, [fadeAnim, scaleAnim, navigation, dispatch]);

  // Handle profile fetch result and navigate accordingly
  useEffect(() => {
    if (currentUser && !isProfileLoading) {
      // Profile fetched successfully
      if (currentUser.isProfileCompleted === true) {
        // Profile completed - navigate to EnterPassword with user data
        navigation.replace('EnterPassword', { 
          identity: currentUser.email || currentUser.phone,
          userData: currentUser
        });
      } else {
        // Profile not completed - navigate to EnterNameSign
        navigation.replace('EnterNameSign', {
          userData: currentUser,
          phoneNumber: currentUser.phone,
          selectedCountry: currentUser.countryCode
        });
      }
    } else if (profileError && !isProfileLoading) {
      // Profile fetch failed - navigate to Login
      console.error('Profile fetch failed:', profileError);
      navigation.replace('Login');
    }
  }, [currentUser, isProfileLoading, profileError, navigation]);

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
