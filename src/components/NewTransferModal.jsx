import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  Modal,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';

const { width: screenWidth, height: screenHeight } = Dimensions.get('window');

const NewTransferModal = ({ visible, onClose }) => {
  const { theme } = useTheme();

  const handleSendMoney = () => {
    onClose();
    console.log('Send Money clicked');
  };

  const handlePaymentLink = () => {
    onClose();
    console.log('Payment Link clicked');
  };

  return (
    <Modal
      visible={visible}
      transparent={true}
      animationType="slide"
      onRequestClose={onClose}
    >
      <View style={styles.overlay}>
        <View
          style={[styles.modalContainer, { backgroundColor: theme.colors.card }]}
        >
          {/* Drag Handle */}
          <View
            style={[styles.dragHandle, { backgroundColor: theme.colors.muted }]}
          />

          {/* Modal Title */}
          <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
            New transfer
          </Text>

          {/* Options Container */}
          <View style={styles.optionsContainer}>
            {/* Send Money Option */}
            <TouchableHighlight
              style={styles.optionButton}
              onPress={handleSendMoney}
              underlayColor={theme.colors.border} // highlight color
              activeOpacity={0.9}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon]}>
                  <Text
                    style={[
                      styles.iconText,
                      { color: '#169BFF', fontSize: 35 },
                    ]}
                  >
                    D
                  </Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[styles.optionTitle, { color: theme.colors.text }]}
                  >
                    Send Money
                  </Text>
                  <Text
                    style={[
                      styles.optionSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Send money instantly
                  </Text>
                </View>
              </View>
            </TouchableHighlight>

            {/* Payment Link Option */}
            <TouchableHighlight
              style={styles.optionButton}
              onPress={handlePaymentLink}
              underlayColor={theme.colors.border}
              activeOpacity={0.9}
            >
              <View style={styles.optionContent}>
                <View style={[styles.optionIcon]}>
                  <Text style={[styles.iconText, { color: '#169BFF' }]}>🔗</Text>
                </View>
                <View style={styles.optionTextContainer}>
                  <Text
                    style={[styles.optionTitle, { color: theme.colors.text }]}
                  >
                    Payment link
                  </Text>
                  <Text
                    style={[
                      styles.optionSubtitle,
                      { color: theme.colors.textSecondary },
                    ]}
                  >
                    Request payment
                  </Text>
                </View>
              </View>
            </TouchableHighlight>
          </View>
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
  },
  modalContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingHorizontal: 20,
    paddingTop: 12,
    paddingBottom: 40,
    minHeight: screenHeight * 0.3,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    marginBottom: 15,
    alignSelf: 'center',
    opacity: 0.3,
  },
  modalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 24,
  },
  optionsContainer: {
    gap: 12,
  },
  optionButton: {
    borderRadius: 12,
    padding: 16,
  },
  optionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  optionIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: 'bold',
  },
  optionTextContainer: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 4,
  },
  optionSubtitle: {
    fontSize: 14,
    opacity: 0.8,
  },
});

export default NewTransferModal;
