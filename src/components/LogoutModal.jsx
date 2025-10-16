import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  Dimensions,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import { BlurView } from '@react-native-community/blur';

const { width, height } = Dimensions.get('window');

const LogoutModal = ({ isVisible, onClose, onConfirm }) => {
  const { theme } = useTheme();

  return (
    <Modal
      visible={isVisible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        {Platform.OS === 'ios' ? (
          <BlurView
            style={styles.blurBackground}
            blurType={theme.isDarkMode ? "dark" : "light"}
            blurAmount={10}
            reducedTransparencyFallbackColor="rgba(0,0,0,0.5)"
          />
        ) : (
          <View style={[styles.blurBackground, { backgroundColor: 'rgba(0,0,0,0.5)' }]} />
        )}
        
        <View style={styles.modalContainer}>
          <View style={[styles.modal, { backgroundColor: theme.colors.surface }]}>
            {/* Icon */}
            <View style={styles.iconContainer}>
              <View style={styles.iconBackground}>
                <Ionicons name="log-out-outline" size={24} color="#FFFFFF" />
              </View>
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.colors.text }]}>
              Logout
            </Text>

            {/* Main Message */}
            <Text style={[styles.message, { color: theme.colors.text }]}>
              Are you sure you want to logout? You will need to sign in again to access your account.
            </Text>

            {/* Info Box */}
            

            {/* Action Buttons */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.cancelButton, { backgroundColor: theme.colors.border }]}
                onPress={onClose}
              >
                <Text style={[styles.cancelButtonText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity>

              <TouchableOpacity
                style={styles.logoutButton}
                onPress={onConfirm}
              >
                <Text style={styles.logoutButtonText}>
                  Logout
                </Text>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  blurBackground: {
    ...StyleSheet.absoluteFillObject,
  },
  modalContainer: {
    width: width * 0.9,
    maxWidth: 400,
    paddingHorizontal: 20,
  },
  modal: {
    borderRadius: 20,
    padding: 24,
    alignItems: 'center',
  },
  iconContainer: {
    marginBottom: 20,
  },
  iconBackground: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#FF4444',
    justifyContent: 'center',
    alignItems: 'center',
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 16,
  },
  message: {
    fontSize: 16,
    textAlign: 'center',
    lineHeight: 22,
    marginBottom: 20,
  },
  infoBox: {
    borderRadius: 12,
    padding: 16,
    marginBottom: 24,
    width: '100%',
  },
  infoContent: {
    flexDirection: 'row',
    alignItems: 'flex-start',
  },
  infoText: {
    fontSize: 14,
    marginLeft: 12,
    flex: 1,
    lineHeight: 20,
  },
  buttonContainer: {
    flexDirection: 'row',
    width: '100%',
    gap: 12,
    marginTop:15
  },
  cancelButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
  },
  cancelButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
  logoutButton: {
    flex: 1,
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 12,
    alignItems: 'center',
    backgroundColor: '#FF4444',
  },
  logoutButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: '#FFFFFF',
  },
});

export default LogoutModal;
