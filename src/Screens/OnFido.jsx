import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Alert,
  ActivityIndicator,
  SafeAreaView,
  StatusBar,
} from 'react-native';
import { Onfido } from '@onfido/react-native-sdk';
import { useNavigation } from '@react-navigation/native';

const OnFidoScreen = () => {
  const navigation = useNavigation();
  const [isLoading, setIsLoading] = useState(false);
  const [sdkToken, setSdkToken] = useState(null);
  const [workflowRunId, setWorkflowRunId] = useState(null);

  // Configuration for OnFido SDK
  const onfidoConfig = {
    sdkToken: sdkToken,
    workflowRunId: workflowRunId,
    // Optional: Customize the appearance
    appearance: {
      primaryColor: '#1E88E5',
      primaryButtonColor: '#1E88E5',
      primaryButtonTextColor: '#FFFFFF',
      secondaryButtonColor: '#FFFFFF',
      secondaryButtonTextColor: '#1E88E5',
      backgroundColor: '#FFFFFF',
      textColor: '#000000',
      // Add more customization options as needed
    },
    // Optional: Configure supported document types
    documentTypes: {
      passport: true,
      driving_licence: true,
      national_identity_card: true,
    },
    // Optional: Configure supported countries
    countryCode: 'US', // Change to your target country
  };

  // Function to get SDK token from your backend
  const getSDKToken = async () => {
    try {
      setIsLoading(true);
      // TODO: Replace with your actual API call to get SDK token
      // This should be called from your backend for security
      const response = await fetch('YOUR_BACKEND_URL/api/onfido/sdk-token', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          // Add your authentication headers here
        },
        body: JSON.stringify({
          // Add any required parameters
        }),
      });
      
      const data = await response.json();
      
      if (data.sdkToken) {
        setSdkToken(data.sdkToken);
        setWorkflowRunId(data.workflowRunId);
        return true;
      } else {
        throw new Error('Failed to get SDK token');
      }
    } catch (error) {
      console.error('Error getting SDK token:', error);
      Alert.alert(
        'Error',
        'Failed to initialize OnFido. Please try again.',
        [{ text: 'OK' }]
      );
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  // Function to start OnFido verification
  const startOnfidoVerification = async () => {
    if (!sdkToken) {
      const tokenReceived = await getSDKToken();
      if (!tokenReceived) {
        return;
      }
    }

    try {
      setIsLoading(true);
      
      const result = await Onfido.start(onfidoConfig);
      
      // Handle the result based on OnFido SDK response
      if (result) {
        console.log('OnFido verification completed:', result);
        
        // Handle successful verification
        Alert.alert(
          'Verification Complete',
          'Your identity verification has been completed successfully!',
          [
            {
              text: 'OK',
              onPress: () => {
                // Navigate back or to next screen
                navigation.goBack();
              },
            },
          ]
        );
      }
    } catch (error) {
      console.error('OnFido verification error:', error);
      
      // Handle different types of errors
      if (error.code === 'ONFIDO_ERROR') {
        Alert.alert(
          'Verification Error',
          'There was an error during verification. Please try again.',
          [{ text: 'OK' }]
        );
      } else if (error.code === 'ONFIDO_CANCELLED') {
        // User cancelled the verification
        console.log('User cancelled OnFido verification');
      } else {
        Alert.alert(
          'Error',
          'An unexpected error occurred. Please try again.',
          [{ text: 'OK' }]
        );
      }
    } finally {
      setIsLoading(false);
    }
  };

  // Function to handle manual token input (for testing purposes)
  const handleManualTokenInput = () => {
    Alert.prompt(
      'Enter SDK Token',
      'Please enter your OnFido SDK token for testing:',
      [
        {
          text: 'Cancel',
          style: 'cancel',
        },
        {
          text: 'OK',
          onPress: (token) => {
            if (token && token.trim()) {
              setSdkToken(token.trim());
              Alert.alert('Success', 'SDK Token set successfully!');
            }
          },
        },
      ],
      'plain-text'
    );
  };

  return (
    <SafeAreaView style={styles.container}>
      <StatusBar barStyle="dark-content" backgroundColor="#FFFFFF" />
      
      <View style={styles.header}>
        <TouchableOpacity
          style={styles.backButton}
          onPress={() => navigation.goBack()}
        >
          <Text style={styles.backButtonText}>← Back</Text>
        </TouchableOpacity>
        <Text style={styles.title}>Identity Verification</Text>
      </View>

      <View style={styles.content}>
        <View style={styles.iconContainer}>
          <Text style={styles.icon}>🆔</Text>
        </View>
        
        <Text style={styles.mainTitle}>Verify Your Identity</Text>
        <Text style={styles.description}>
          Complete your identity verification using OnFido. This process helps us ensure the security of your account.
        </Text>

        <View style={styles.featuresContainer}>
          <Text style={styles.featuresTitle}>What you'll need:</Text>
          <Text style={styles.featureItem}>• A valid government-issued ID</Text>
          <Text style={styles.featureItem}>• A smartphone with camera</Text>
          <Text style={styles.featureItem}>• Good lighting for photos</Text>
        </View>

        {isLoading ? (
          <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color="#1E88E5" />
            <Text style={styles.loadingText}>Initializing verification...</Text>
          </View>
        ) : (
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.primaryButton}
              onPress={startOnfidoVerification}
              disabled={isLoading}
            >
              <Text style={styles.primaryButtonText}>Start Verification</Text>
            </TouchableOpacity>

            <TouchableOpacity
              style={styles.secondaryButton}
              onPress={handleManualTokenInput}
            >
              <Text style={styles.secondaryButtonText}>Enter SDK Token (Testing)</Text>
            </TouchableOpacity>
          </View>
        )}

        <View style={styles.infoContainer}>
          <Text style={styles.infoText}>
            Your information is encrypted and secure. We use industry-standard security measures to protect your data.
          </Text>
        </View>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#FFFFFF',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#E0E0E0',
  },
  backButton: {
    marginRight: 15,
  },
  backButtonText: {
    fontSize: 16,
    color: '#1E88E5',
    fontWeight: '500',
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: '#000000',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    paddingTop: 30,
  },
  iconContainer: {
    alignItems: 'center',
    marginBottom: 20,
  },
  icon: {
    fontSize: 60,
  },
  mainTitle: {
    fontSize: 24,
    fontWeight: '700',
    color: '#000000',
    textAlign: 'center',
    marginBottom: 15,
  },
  description: {
    fontSize: 16,
    color: '#666666',
    textAlign: 'center',
    lineHeight: 24,
    marginBottom: 30,
  },
  featuresContainer: {
    backgroundColor: '#F8F9FA',
    padding: 20,
    borderRadius: 12,
    marginBottom: 30,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#000000',
    marginBottom: 10,
  },
  featureItem: {
    fontSize: 14,
    color: '#666666',
    marginBottom: 5,
    lineHeight: 20,
  },
  loadingContainer: {
    alignItems: 'center',
    paddingVertical: 40,
  },
  loadingText: {
    fontSize: 16,
    color: '#666666',
    marginTop: 15,
  },
  buttonContainer: {
    marginBottom: 30,
  },
  primaryButton: {
    backgroundColor: '#1E88E5',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    marginBottom: 15,
  },
  primaryButtonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
  },
  secondaryButton: {
    backgroundColor: '#FFFFFF',
    paddingVertical: 15,
    paddingHorizontal: 30,
    borderRadius: 8,
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#1E88E5',
  },
  secondaryButtonText: {
    color: '#1E88E5',
    fontSize: 16,
    fontWeight: '500',
  },
  infoContainer: {
    backgroundColor: '#E3F2FD',
    padding: 15,
    borderRadius: 8,
    marginTop: 'auto',
    marginBottom: 20,
  },
  infoText: {
    fontSize: 12,
    color: '#1976D2',
    textAlign: 'center',
    lineHeight: 18,
  },
});

export default OnFidoScreen;

