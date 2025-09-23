import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  Dimensions,
  StatusBar,
  Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import ReportUserModal from './ReportUserModal';

const { width, height } = Dimensions.get('window');

const UserProfileModal = ({ visible, onClose, user, onActionPress }) => {
  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showReportModal, setShowReportModal] = useState(false);

  const handleActionPress = (action) => {
    console.log('Action pressed:', action);
    if (action === 'report-user') {
      setShowReportModal(true);
    } else {
      onActionPress(action);
    }
  };

  const handleReportContinue = (selectedReason) => {
    setShowReportModal(false);
    console.log('Report submitted with reason:', selectedReason);
    onActionPress('report-user-confirmed', selectedReason);
  };

  const handleReportClose = () => {
    setShowReportModal(false);
  };

  const ActionButton = ({ icon, title, onPress, backgroundColor, iconColor = 'white' }) => (
    <TouchableOpacity
      style={[styles.actionButton, { backgroundColor }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <Ionicons name={icon} size={20} color={iconColor} />
      <Text style={[styles.actionButtonText, { color: iconColor }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const ReportButton = ({ icon, title, onPress, iconColor = '#FF4444' }) => (
    <TouchableOpacity
      style={[styles.reportButton, { backgroundColor: theme.colors.surface }]}
      onPress={onPress}
      activeOpacity={0.8}
    >
      <MaterialIcons name={icon} size={20} color={iconColor} />
      <Text style={[styles.reportButtonText, { color: theme.colors.text }]}>
        {title}
      </Text>
    </TouchableOpacity>
  );

  const EmptySection = ({ title }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.surface, }]}>
      <TouchableOpacity style={styles.seeAllBtn} >
        <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total received</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>100</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total sent</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>2000</Text>
        </View>
      </View>
    </View>
  );

  const EmptySectionRequest = ({ title }) => (
    <View style={[styles.card, { backgroundColor: theme.colors.surface }]}>
      {/* First row - Friend request sent */}
      <View style={styles.row}>
        <MaterialIcons name="person-add" size={25} color="#FF8C00" />
        <Text style={[styles.rowText, { color: theme.colors.text }]}>
          Friend request sent
        </Text>
      </View>

      {/* Second row - Sent money request */}
      <View style={[styles.row, { marginTop: 10 }]}>
        <MaterialIcons name="lock-clock" size={25} color="#246BFD" />
        <Text style={[styles.rowText, { color: theme.colors.text }]}>
          Sent money request
        </Text>
        <Text style={[styles.amount, { color: theme.colors.text }]}>$30</Text>
      </View>
    </View>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
      <StatusBar
        barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
        backgroundColor="transparent"
        translucent
      />
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={onClose}
        />
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

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* User Profile Section */}
            <View style={styles.profileSection}>
              <View style={styles.avatarContainer}>
                <View style={[styles.avatar,]}>
                  <Image source={require("../assets/Images/userProfile.png")} style={{ width: 80, height: 160, resizeMode: "contain", borderRadius: 40 }} />

                </View>
                <Text style={[styles.username, { color: theme.colors.text }]}>
                  @{user?.username || 'username'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            <View style={styles.actionButtonsContainer}>
              <ActionButton
                icon="add"
                iconColor="#169BFF"
                title="Request money"
                backgroundColor={theme.colors.surface}
                onPress={() => handleActionPress('request-money')}
              />
              <ActionButton
                icon="arrow-forward"
                iconColor="#169BFF"
                title="Send"
                backgroundColor={theme.colors.surface}
                onPress={() => { onActionPress(), navigation.navigate('AddingAmount') }}
              />
            </View>
            <View style={{ marginBottom: 20, width: 220 }}>

              <ActionButton
                icon="person-add"
                title="Send friend request"
                backgroundColor="#FF7B001A"
                iconColor="#FF7B00"
                onPress={() => handleActionPress('send-friend-request')}
                style={styles.fullWidthButton}
              />
            </View>

            {/* Transactions Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Transactions
              </Text>
              <EmptySection />
            </View>

            {/* Pending Request Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Pending request
              </Text>
              <EmptySectionRequest />
            </View>

            {/* Report Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Report
              </Text>
              <View style={styles.reportButtonsContainer}>
                <ReportButton
                  icon="person-off"
                  title="Report user"
                  onPress={() => handleActionPress('report-user')}
                />
                <ReportButton
                  icon="security"
                  title="Report fraud"
                  onPress={() => handleActionPress('report-fraud')}
                />
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Report User Modal */}
      <ReportUserModal
        visible={showReportModal}
        onClose={handleReportClose}
        onContinue={handleReportContinue}
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
  modalBackdrop: {
    flex: 1,
  },
  modalContainer: {
    height: height * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
    paddingTop: 20,
  },
  header: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  backButton: {
    padding: 4,
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  profileSection: {
    // alignItems: 'center',
    marginBottom: 32,
  },
  avatarContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 12,
    // alignItems: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    marginVertical: 8,
  },
  row: {
    flexDirection: 'row',
    alignItems: 'center',
    // marginBottom: 12,
  },
  rowText: {
    flex: 1,
    marginLeft: 8,
    fontSize: 16,
    fontWeight: 500
  },
  amount: {
    fontWeight: '600',
    fontSize: 16,
  },
  avatar: {
    width: 80,
    height: 80,
    borderRadius: 40,
    alignItems: 'center',
    justifyContent: 'center',
    marginBottom: 16,
    // position: 'relative',
  },
  avatarText: {
    color: 'white',
    fontSize: 32,
    fontWeight: '700',
    fontFamily: 'System',
  },
  verifiedBadge: {
    position: 'absolute',
    bottom: 2,
    right: 2,
    width: 24,
    height: 24,
    borderRadius: 12,
    backgroundColor: '#169BFF',
    alignItems: 'center',
    justifyContent: 'center',
  },
  card: {
    borderRadius: 12,
    padding: 16,
    margin: 12,
    position: "relative",
  },
  seeAllBtn: {
    position: "absolute",
    right: 16,
    top: 12,
  },
  seeAllText: {
    fontSize: 12,
    fontWeight: "600",
  },
  row: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginTop: 10,
  },
  section: {
    flex: 1,
    alignItems: "center",
  },
  label: {
    fontSize: 14,
    marginBottom: 4,
  },
  value: {
    fontSize: 20,
    fontWeight: "bold",
  },
  divider: {
    width: 1,
    backgroundColor: "#444", // or theme.colors.border
    marginHorizontal: 10,
  },
  username: {
    fontSize: 20,
    fontWeight: '600',
    fontFamily: 'System',
  },
  actionButtonsContainer: {
    flexDirection: 'row',
    gap: 12,
    marginBottom: 12,
  },
  actionButton: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 14,
    paddingHorizontal: 20,
    borderRadius: 50,
    gap: 8,
  },
  fullWidthButton: {
    marginBottom: 32,
  },
  actionButtonText: {
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    marginBottom: 12,
    fontFamily: 'System',
  },
  emptySection: {
    paddingVertical: 24,
    paddingHorizontal: 16,
    borderRadius: 12,
    alignItems: 'center',
  },
  emptyText: {
    fontSize: 14,
    fontFamily: 'System',
  },
  reportButtonsContainer: {
    gap: 8,
  },
  reportButton: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 16,
    paddingHorizontal: 16,
    borderRadius: 12,
    gap: 12,
  },
  reportButtonText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
});

export default UserProfileModal;
