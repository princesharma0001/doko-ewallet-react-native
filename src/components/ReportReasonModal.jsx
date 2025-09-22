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
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const ReportReasonModal = ({ visible, onClose, onReport }) => {
  const { theme, isDarkMode } = useTheme();
  const [showOptionsModal, setShowOptionsModal] = useState(false);
  const [selectedOption, setSelectedOption] = useState(null);

  const reportOptions = [
    {
      id: 'scam',
      title: 'Scam',
      description: 'Misled you to send money',
      icon: 'R',
      color: '#FF4444'
    },
    {
      id: 'unauthorized',
      title: 'Unauthorized Transaction',
      description: 'Conducted payments without your consent',
      icon: 'R',
      color: '#FF4444'
    },
    {
      id: 'impersonation',
      title: 'Impersonation',
      description: 'Pretended to be someone else',
      icon: 'R',
      color: '#FF4444'
    },
    {
      id: 'phishing',
      title: 'Phishing Attempts',
      description: 'Sent fraudulent messages to obtain sensitive data',
      icon: 'R',
      color: '#FF4444'
    }
  ];

  const handleOptionSelect = (option) => {
    setSelectedOption(option);
    setShowOptionsModal(false);
  };

  const handleReport = () => {
    if (selectedOption) {
      onReport(selectedOption);
    }
  };

  const OptionsModal = () => (
    <Modal
      visible={showOptionsModal}
      transparent
      animationType="slide"
      onRequestClose={() => setShowOptionsModal(false)}
    >
      <View style={styles.optionsOverlay}>
        <TouchableOpacity
          style={styles.optionsBackdrop}
          activeOpacity={1}
          onPress={() => setShowOptionsModal(false)}
        />
        <View style={[styles.optionsContainer, { backgroundColor: theme.colors.background }]}>
          {/* Handle */}
          <View style={[styles.handle, { backgroundColor: theme.colors.border }]} />
          
          {/* Header */}
          <View style={styles.optionsHeader}>
            <Text style={[styles.optionsTitle, { color: theme.colors.text }]}>
              Select option
            </Text>
          </View>

          {/* Options List */}
          <ScrollView style={styles.optionsList} showsVerticalScrollIndicator={false}>
            {reportOptions.map((option) => (
              <TouchableOpacity
                key={option.id}
                style={[styles.optionItem,]}
                onPress={() => handleOptionSelect(option)}
                activeOpacity={0.7}
              >
                <View style={[styles.optionIcon, ]}>
                  <Text style={styles.optionIconText}>{option.icon}</Text>
                </View>
                <View style={styles.optionContent}>
                  <Text style={[styles.optionTitle, { color: theme.colors.text }]}>
                    {option.title}
                  </Text>
                  <Text style={[styles.optionDescription, { color: theme.colors.textSecondary }]}>
                    {option.description}
                  </Text>
                </View>
              </TouchableOpacity>
            ))}
          </ScrollView>
        </View>
      </View>
    </Modal>
  );

  return (
    <>
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
            </View>

            {/* Title */}
            <Text style={[styles.title, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
              Why are you reporting him?
            </Text>

            {/* Content */}
            <ScrollView 
              style={styles.scrollContainer}
              contentContainerStyle={styles.content}
              showsVerticalScrollIndicator={false}
              bounces={false}
            >
              {/* Choose one section */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                  Choose one
                </Text>
                
                {/* Dropdown */}
                <TouchableOpacity
                  style={[styles.dropdown, { backgroundColor: theme.colors.surface, borderColor: theme.colors.border }]}
                  onPress={() => setShowOptionsModal(true)}
                  activeOpacity={0.7}
                >
                  <Text style={[styles.dropdownText, { color: selectedOption ? theme.colors.text : theme.colors.textSecondary }]}>
                    {selectedOption ? selectedOption.title : 'Select an option'}
                  </Text>
                  <Ionicons name="chevron-down" size={20} color={theme.colors.textSecondary} />
                </TouchableOpacity>
              </View>

              {/* Scams include section */}
              <View style={styles.section}>
                <Text style={[styles.sectionLabel, { color: theme.colors.text }]}>
                  Scams include
                </Text>
                
                <View style={styles.scamList}>
                  <View style={styles.scamItem}>
                    <Text style={[styles.scamTitle, { color: theme.colors.text }]}>
                      Fake Investment Schemes:
                    </Text>
                    <Text style={[styles.scamDescription, { color: theme.colors.textSecondary }]}>
                      User promised high returns on investments that turned out to be false or non-existent
                    </Text>
                  </View>
                  
                  <View style={styles.scamItem}>
                    <Text style={[styles.scamTitle, { color: theme.colors.text }]}>
                      Advance Fee Fraud:
                    </Text>
                    <Text style={[styles.scamDescription, { color: theme.colors.textSecondary }]}>
                      User requested upfront for good or services that were never delivered
                    </Text>
                  </View>
                  
                  <View style={styles.scamItem}>
                    <Text style={[styles.scamTitle, { color: theme.colors.text }]}>
                      Non-Delivery of Goods or Services:
                    </Text>
                    <Text style={[styles.scamDescription, { color: theme.colors.textSecondary }]}>
                      The user accepted payment but never delivered the promised goods or services
                    </Text>
                  </View>
                </View>
              </View>
            </ScrollView>

            {/* Report Button - Fixed at bottom */}
            <View style={styles.buttonContainer}>
              <TouchableOpacity
                style={[styles.gradientButton, { opacity: selectedOption ? 1 : 0.5 }]}
                onPress={handleReport}
                // activeOpacity={selectedOption ? 0.8 : 1}
                // disabled={!selectedOption}
              >
                <LinearGradient
                  colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                  start={{ x: 0, y: 0 }}
                  end={{ x: 1.5, y: 0.5 }}
                  style={styles.gradient}
                >
                  <Text style={styles.buttonText}>Report</Text>
                </LinearGradient>
              </TouchableOpacity>
            </View>
          </View>
        </View>
      </Modal>

      {/* Options Modal */}
      <OptionsModal />
    </>
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
    marginHorizontal: 20,
    marginBottom: 20,
  },
  scrollContainer: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
    paddingTop: 0,
    paddingBottom: 30,
    flexGrow: 1,
  },
  section: {
    marginBottom: 32,
  },
  sectionLabel: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 12,
  },
  dropdown: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 16,
    paddingVertical: 16,
    borderRadius: 12,
    borderWidth: 1,
  },
  dropdownText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
    flex: 1,
  },
  scamList: {
    gap: 16,
  },
  scamItem: {
    gap: 4,
  },
  scamTitle: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  scamDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 20,
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
  // Options Modal Styles
  optionsOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  optionsBackdrop: {
    flex: 1,
  },
  optionsContainer: {
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    maxHeight: height * 0.6,
    paddingBottom: 20,
  },
  handle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: 'center',
    marginTop: 8,
    marginBottom: 16,
  },
  optionsHeader: {
    paddingHorizontal: 20,
    paddingBottom: 16,
  },
  optionsTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  optionsList: {
    paddingHorizontal: 20,
  },
  optionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    marginBottom: 8,
  },
  optionIcon: {
    width: 32,
    height: 32,
    borderRadius: 16,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  optionIconText: {
    color: '#FF4141',
    fontSize: 30,
    fontWeight: '700',
    fontFamily: 'System',
  },
  optionContent: {
    flex: 1,
  },
  optionTitle: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
    marginBottom: 2,
  },
  optionDescription: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    lineHeight: 18,
  },
});

export default ReportReasonModal;
