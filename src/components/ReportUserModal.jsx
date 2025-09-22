import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  StatusBar,
  Dimensions,
  ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import ReportReasonModal from './ReportReasonModal';

const { width, height } = Dimensions.get('window');

const ReportUserModal = ({ visible, onClose, onContinue }) => {
  const { theme, isDarkMode } = useTheme();
  const [showReasonModal, setShowReasonModal] = useState(false);

  const handleContinue = () => {
    setShowReasonModal(true);
  };

  const handleReasonClose = () => {
    setShowReasonModal(false);
  };

  const handleReport = (selectedReason) => {
    setShowReasonModal(false);
    onContinue(selectedReason);
  };

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle={isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.modalOverlay}>
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.background }]}>
          {/* Header */}
          <View style={styles.header}>
            <TouchableOpacity
              style={styles.backButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
            </TouchableOpacity>
          
            <TouchableOpacity
              style={styles.doneButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <Text style={[styles.doneText, { color: theme.colors.primary }]}>
                Done
              </Text>
            </TouchableOpacity>
          </View>
            <Text style={[styles.title, { color: theme.colors.text,fontSize:theme.typography.sizes.xxl }]}>
              Report User
            </Text>

          {/* Content */}
          <ScrollView 
            style={styles.scrollContainer}
            contentContainerStyle={styles.content}
            showsVerticalScrollIndicator={false}
            bounces={false}
          >
            {/* What happens next section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                What happens next
              </Text>
              <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
                After reporting user we will open an investigation in their accounts and will be in contact with the both of you.
              </Text>
            </View>

            {/* Accountability section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Accountability
              </Text>
              <Text style={[styles.sectionText, { color: theme.colors.textSecondary }]}>
                We will hold you accountable for any false information, please only report a user if your are sure there has been misconduct by this user.
              </Text>
            </View>
          </ScrollView>

          {/* Continue Button - Fixed at bottom */}
          <View style={styles.buttonContainer}>
            <TouchableOpacity
              style={styles.gradientButton}
              onPress={handleContinue}
              activeOpacity={0.8}
            >
              <LinearGradient
                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                start={{ x: 0, y: 0 }}
                end={{ x: 1.5, y: 0.5 }}
                style={styles.gradient}
              >
                <Text style={styles.buttonText}>Continue</Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>

      {/* Report Reason Modal */}
      <ReportReasonModal
        visible={showReasonModal}
        onClose={handleReasonClose}
        onReport={handleReport}
      />
    </Modal>
  );
};

const styles = StyleSheet.create({
  modalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  modalContainer: {
    width: width,
    height: height * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
    paddingBottom: 0,
    justifyContent: 'space-between',
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
    paddingTop: 10,
  },
  backButton: {
    padding: 4,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
    // flex: 1,
    // textAlign: 'center',
    marginHorizontal: 20,
  },
  doneButton: {
    padding: 4,
  },
  doneText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 40,
    paddingBottom: 30,
    flexGrow: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 12,
  },
  sectionText: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 24,
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingBottom: 40,
    paddingTop: 20,
    backgroundColor: 'transparent',
  },
  gradientButton: {
    borderRadius: 12,
    overflow: 'hidden',
  },
  gradient: {
    paddingVertical: 16,
    alignItems: 'center',
    justifyContent: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
});

export default ReportUserModal;
