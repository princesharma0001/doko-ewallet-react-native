import React, { useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  TouchableOpacity,
  Dimensions,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const SuccessModal = ({ visible, onClose, amount, recipient }) => {
  const { theme } = useTheme();

  // Auto close modal after 3 seconds
  useEffect(() => {
    if (visible) {
      const timer = setTimeout(() => {
        onClose();
      }, 3000);

      return () => clearTimeout(timer);
    }
  }, [visible, onClose]);

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Drag Handle */}
          <View style={[styles.dragHandle, { backgroundColor: theme.colors.muted }]} />

          {/* Success Icon */}
          <View style={styles.iconContainer}>
            <Image source={require("../assets/Images/DONE.png")} style={{ width: 65, height: 65 }} />
            {/* <View style={styles.successIcon}>
              <Text style={styles.checkmark}>✓</Text>
            </View> */}
          </View>

          {/* Success Message */}
          <Text style={[styles.successMessage, { color: theme.colors.text }]}>
            You Sent {amount ? `$${amount}` : '$0.00'}
          </Text>

          {/* Delivery Status */}
          <Text style={[styles.deliveryStatus, { color: theme.colors.textSecondary }]}>
            Arriving: Instantly
          </Text>

          {/* Close Button */}
          {/* <TouchableOpacity
            style={[styles.closeButton, { backgroundColor: theme.colors.primary }]}
            onPress={onClose}
          >
            <Text style={[styles.closeButtonText, { color: theme.colors.primaryText }]}>
              Done
            </Text>
          </TouchableOpacity> */}
        </View>
      </View>
    </Modal>
  );
};

const styles = StyleSheet.create({
  overlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
    paddingBottom: 0,
  },
  modalContainer: {
    backgroundColor: '#1A1A22',
    borderRadius: 20,
    paddingHorizontal: 24,
    // paddingTop: 12,
    marginHorizontal: 16,
    marginBottom: 30,
    alignItems: 'center',
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 32,
    opacity: 0.3,
  },
  iconContainer: {
    marginBottom: 24,
  },
  successIcon: {
    width: 80,
    height: 80,
    borderRadius: 40,
    backgroundColor: '#34C759',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#34C759',
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  checkmark: {
    fontSize: 40,
    color: '#FFFFFF',
    fontWeight: 'bold',
  },
  successMessage: {
    fontSize: 24,
    fontWeight: 'bold',
    textAlign: 'center',
    marginBottom: 8,
  },
  deliveryStatus: {
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 20,
    opacity: 0.8,
  },
  closeButton: {
    paddingHorizontal: 32,
    paddingVertical: 12,
    borderRadius: 8,
    minWidth: 120,
    alignItems: 'center',
    marginTop: 8,
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: '600',
  },
});

export default SuccessModal;
