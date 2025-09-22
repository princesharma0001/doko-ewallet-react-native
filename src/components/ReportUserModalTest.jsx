import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  SafeAreaView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import UserProfileModal from './UserProfileModal';
import ReportUserModal from './ReportUserModal';

const ReportUserModalTest = () => {
  const { theme, isDarkMode, toggleTheme } = useTheme();
  const [showUserModal, setShowUserModal] = useState(false);
  const [showReportModal, setShowReportModal] = useState(false);

  const mockUser = {
    username: 'testuser',
    name: 'Test User',
  };

  const handleActionPress = (action) => {
    console.log('Action pressed:', action);
    if (action === 'report-user') {
      setShowReportModal(true);
    }
  };

  const handleReportContinue = () => {
    setShowReportModal(false);
    console.log('Report user confirmed');
  };

  return (
    <SafeAreaView style={[styles.container, { backgroundColor: theme.colors.background }]}>
      <View style={styles.header}>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Report User Modal Test
        </Text>
        <TouchableOpacity
          style={[styles.themeButton, { backgroundColor: theme.colors.surface }]}
          onPress={toggleTheme}
        >
          <Text style={[styles.themeButtonText, { color: theme.colors.text }]}>
            {isDarkMode ? 'Light' : 'Dark'} Theme
          </Text>
        </TouchableOpacity>
      </View>

      <View style={styles.content}>
        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          onPress={() => setShowUserModal(true)}
        >
          <Text style={styles.buttonText}>Open User Profile Modal</Text>
        </TouchableOpacity>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.surface }]}
          onPress={() => setShowReportModal(true)}
        >
          <Text style={[styles.buttonText, { color: theme.colors.text }]}>
            Open Report User Modal Directly
          </Text>
        </TouchableOpacity>

        <Text style={[styles.description, { color: theme.colors.textSecondary }]}>
          Current theme: {isDarkMode ? 'Dark' : 'Light'}
        </Text>
      </View>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showUserModal}
        onClose={() => setShowUserModal(false)}
        user={mockUser}
        onActionPress={handleActionPress}
      />

      {/* Report User Modal */}
      <ReportUserModal
        visible={showReportModal}
        onClose={() => setShowReportModal(false)}
        onContinue={handleReportContinue}
      />
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: '700',
    fontFamily: 'System',
  },
  themeButton: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
  },
  themeButtonText: {
    fontSize: 14,
    fontWeight: '600',
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 20,
  },
  button: {
    paddingHorizontal: 24,
    paddingVertical: 16,
    borderRadius: 12,
    minWidth: 200,
    alignItems: 'center',
  },
  buttonText: {
    color: '#FFFFFF',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  description: {
    fontSize: 14,
    fontFamily: 'System',
    marginTop: 20,
  },
});

export default ReportUserModalTest;
