import React, { useState } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  StyleSheet,
  Dimensions,
  ImageBackground,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  Alert,
  Image,
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../theme';

const { width, height } = Dimensions.get('window');

const TakeSelfie = ({ navigation, route }) => {
  const { colors, spacing, typography } = useTheme();
  const [isProcessing, setIsProcessing] = useState(false);

  const handleTakeSelfie = () => {
    // Navigate directly to camera screen
    navigation.navigate('CreatePassword')
    // navigation.navigate('CameraScreen', { userData: route.params?.userData });
  };

  const handleSkip = () => {
    Alert.alert(
      'Skip Selfie',
      'Are you sure you want to skip taking a selfie?',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Skip',
          onPress: () => navigation.navigate('EmailVerify')
        }
      ]
    );
  };

  return (
    <ImageBackground
      source={require('../assets/Images/BgBack.png')}
      style={styles.container}
      resizeMode="cover"
    >
      <KeyboardAvoidingView
        style={styles.keyboardAvoidingView}
        behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        keyboardVerticalOffset={Platform.OS === 'ios' ? 0 : 20}
      >
        {/* Dark overlay for better text readability */}
        <View style={styles.overlay}>
          {/* Header with Back Button */}
          {/* <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={() => navigation.goBack()}
              activeOpacity={0.7}
            >
              <Text style={styles.backIcon}>←</Text>
            </TouchableOpacity>
          </View> */}

          {/* Scrollable Content Container */}
          <ScrollView
            style={styles.scrollableContent}
            contentContainerStyle={styles.scrollContentContainer}
            keyboardShouldPersistTaps="handled"
            showsVerticalScrollIndicator={false}
          >
            {/* Main Content */}
            <View style={styles.content}>
              {/* Title */}
              <Text
                style={[
                  styles.title,
                  {
                    color: '#FFFFFF',
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.xxl,
                    fontWeight: typography.weights.bold,
                  },
                ]}
              >
                Take a selfie
              </Text>

              {/* Selfie Icon */}
              <View style={styles.selfieIconContainer}>
                <Image source={require('../assets/Images/Selfies.png')} style={styles.selfieIcon} />
              </View>

              {/* Information Box */}
              <View style={styles.infoBox}>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>📷</Text>
                  <Text style={styles.infoText}>It won't be your profile picture.</Text>
                </View>
                <View style={styles.infoItem}>
                  <Text style={styles.infoIcon}>🛡️</Text>
                  <Text style={styles.infoText}>Your photo is secured and is only used for verification purposes.</Text>
                </View>
              </View>
            </View>
          </ScrollView>

          {/* Fixed Bottom Section */}
          <View style={styles.bottomSection}>
            {/* Continue Button */}
            <TouchableOpacity
              style={styles.continueButton}
              onPress={handleTakeSelfie}
              activeOpacity={0.8}
              disabled={isProcessing}
            >
              <LinearGradient
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradientButton}
              >
                <Text
                  style={[
                    styles.continueText,
                    {
                      fontFamily: typography.fontFamily,
                      fontSize: typography.sizes.lg,
                      fontWeight: typography.weights.medium,
                    },
                  ]}
                >
                  {isProcessing ? 'Processing...' : 'Continue'}
                </Text>
              </LinearGradient>
            </TouchableOpacity>

            {/* Skip Button */}
            <TouchableOpacity
              style={styles.skipButton}
              onPress={handleSkip}
              activeOpacity={0.7}
            >
              <Text
                style={[
                  styles.skipText,
                  {
                    color: '#8C90BF',
                    fontFamily: typography.fontFamily,
                    fontSize: typography.sizes.md,
                    fontWeight: typography.weights.regular,
                  },
                ]}
              >
                Skip for now
              </Text>
            </TouchableOpacity>
          </View>
        </View>
      </KeyboardAvoidingView>
    </ImageBackground>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
     backgroundColor: '#000000',
  },
  keyboardAvoidingView: {
    flex: 1,
  },
  overlay: {
    flex: 1,
    paddingTop: 80,
  },
  header: {
    paddingHorizontal: 20,
    paddingBottom: 12,
    zIndex: 10,
  },
  scrollableContent: {
    flex: 1,
  },
  scrollContentContainer: {
    flexGrow: 1,
  },
  backButton: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: 'rgba(255, 255, 255, 0.1)',
    alignItems: 'center',
    justifyContent: 'center',
  },
  backIcon: {
    color: '#FFFFFF',
    fontSize: 20,
    fontWeight: 'bold',
  },
  content: {
    paddingHorizontal: 24,
    paddingVertical: 12,
    // alignItems: 'center',
  },
  title: {
    fontSize: 28,
    fontWeight: 'bold',
    marginBottom: 40,
    letterSpacing: 0.5,
    // textAlign: 'center',
  },
  selfieIconContainer: {
    marginBottom: 40,
    flex: 1,
    alignItems: 'center',
  },
  selfieIcon: {
    width: width * 0.6,
    height: height * 0.2,
    resizeMode: 'contain',
    // borderRadius: 60,
    // backgroundColor: '#1AA5FF',
    // borderWidth: 3,
    // borderColor: '#0D4F8C',
    alignItems: 'center',
    justifyContent: 'center',
    // shadowColor: '#1AA5FF',
    // shadowOffset: {
    //   width: 0,
    //   height: 4,
    // },
    // shadowOpacity: 0.3,
    // shadowRadius: 8,
    // elevation: 8,
  },
  personIcon: {
    fontSize: 50,
    color: '#FFFFFF',
  },
  infoBox: {
    backgroundColor: '#2C2C37',
    borderRadius: 16,
    padding: 20,
    width: '100%',
    // borderWidth: 1,
    // borderColor: 'rgba(255, 255, 255, 0.1)',
  },
  infoItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 16,
  },
  infoIcon: {
    fontSize: 20,
    marginRight: 12,
    width: 24,
  },
  infoText: {
    color: '#FFFFFFBF',
    fontSize: 14,
    fontFamily: 'System',
    flex: 1,
    lineHeight: 18,
  },
  bottomSection: {
    paddingHorizontal: 24,
    paddingBottom: 15,
    paddingTop: 16,
  },
  continueButton: {
    marginBottom: 16,
  },
  gradientButton: {
    paddingVertical: 14,
    borderRadius: 12,
    alignItems: 'center',
    justifyContent: 'center',
  },
  continueText: {
    color: '#FFFFFF',
    textAlign: 'center',
  },
  skipButton: {
    alignItems: 'center',
    paddingVertical: 8,
  },
  skipText: {
    textAlign: 'center',
    textDecorationLine: 'underline',
  },
});

export default TakeSelfie;
