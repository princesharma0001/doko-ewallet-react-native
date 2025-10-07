import React, { useState, useEffect, useRef } from 'react';
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
  FlatList,
  Animated,
  PanResponder,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import { useNavigation } from '@react-navigation/native';
import ReportUserModal from './ReportUserModal';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { transactionHistoryService } from '../services/apiService';

const { width, height } = Dimensions.get('window');

// Transaction Item Component
const TransactionItem = ({ item, theme, isFirst }) => {
  const getTransactionIcon = () => {
    if (item.isBrand && item.title === 'Burger King') {
      return (
        <View style={[styles.transactionIconContainer, { backgroundColor: '#FF6B00' }]}>
          <Text style={styles.brandText}>BK</Text>
        </View>
      );
    }

    return (
      <View style={[styles.transactionIconContainer, { backgroundColor: item.iconColor }]}>
        <Ionicons name={item.icon} size={20} color="white" />
      </View>
    );
  };

  return (
    <View style={[
      styles.transactionItem,
      {
        backgroundColor: isFirst ? theme.colors.surface : theme.colors.background,
        borderBottomColor: theme.colors.border
      }
    ]}>
      <View style={styles.transactionLeft}>
        {getTransactionIcon()}
        <View style={styles.transactionDetails}>
          <Text style={[styles.transactionTitle, { color: theme.colors.text }]}>
            {item.title}
          </Text>
          <Text style={[styles.transactionSubtitle, { color: theme.colors.textSecondary }]}>
            {item.subtitle}
          </Text>
        </View>
      </View>

      <View style={styles.transactionRight}>
        <Text style={[styles.transactionAmount, { color: theme.colors.text }]}>
          {item.amount}
        </Text>
        <Text style={[styles.transactionStatus, { color: theme.colors.textSecondary }]}>
          {item.type === 'send' ? 'Sent' : item.type === 'receive' ? "Received" : item.status}
        </Text>
      </View>
    </View>
  );
};

const UserProfileModal = ({ visible, onClose, user, groupData, onActionPress }) => {
  console.log("sfdghdsfghdfs", groupData);

  const { theme } = useTheme();
  const navigation = useNavigation();
  const [showReportModal, setShowReportModal] = useState(false);
  const [showTransactionHistory, setShowTransactionHistory] = useState(false);
  const [stats, setStats] = useState({ totalSent: 0, totalReceived: 0 });
  const [historyItems, setHistoryItems] = useState([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const panY = useRef(new Animated.Value(0)).current;
  const resetPositionAnim = () => Animated.timing(panY, { toValue: 0, duration: 200, useNativeDriver: true });
  const closePositionAnim = () => Animated.timing(panY, { toValue: height, duration: 200, useNativeDriver: true });

  const panResponder = useRef(
    PanResponder.create({
      onMoveShouldSetPanResponder: (_, gesture) => gesture.dy > 5,
      onPanResponderMove: (_, gesture) => {
        if (gesture.dy > 0) {
          panY.setValue(gesture.dy);
        }
      },
      onPanResponderRelease: (_, gesture) => {
        if (gesture.dy > 120) {
          closePositionAnim().start(() => {
            panY.setValue(0);
            setShowTransactionHistory(false);
          });
        } else {
          resetPositionAnim().start();
        }
      },
    })
  ).current;
  console.log("historyItemshistoryItems", historyItems);




  const mapDocToItem = (doc) => {
    const isSend = doc.type?.toString().toLowerCase().includes('send');
    const isReceive = doc.type?.toString().toLowerCase().includes('receive');
    const title = isSend
      ? `Send: ${doc.receiverId?.firstName || ''} ${doc.receiverId?.lastName || ''}`.trim()
      : isReceive
        ? `${doc.userId?.firstName || ''} ${doc.userId?.lastName || ''}`.trim()
        : doc.description || 'Transaction';
    return {
      id: doc.id || doc._id,
      type: isSend ? 'send' : isReceive ? 'receive' : 'other',
      title,
      subtitle: new Date(doc.createdAt || doc.processedAt).toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' }),
      amount: `${doc.isCredit ? '+' : ''}${doc.isDebit ? '-' : ''}${doc.formattedAmount || `${doc.currency} ${doc.amount}`}`,
      status: (doc.transactionStatus || 'STATUS').toLowerCase() === 'completed' ? 'Sended' : (doc.transactionStatus || ''),
      icon: isSend ? 'paper-plane-outline' : isReceive ? 'download-outline' : 'swap-horizontal',
      iconColor: isSend ? '#169BFF' : isReceive ? '#4CAF50' : '#9E9E9E',
    };
  };

  const fetchTransactionStats = async () => {
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      const filterUserId = (groupData?.recipientId || groupData?.recipientId || groupData?.recipientId || '').toString();
      if (!filterUserId) return;
      const result = await transactionHistoryService.getUserTransactionHistory(filterUserId, token);
      if (result.success) {
        const totals = result.stats || result.data?.stats || {};
        setStats({
          totalSent: totals.totalSent || 0,
          totalReceived: totals.totalReceived || 0,
        });
      }
    } catch (e) {
      // silent fail
    }
  };

  const openHistoryModal = async () => {
    setShowTransactionHistory(true);
    setIsLoadingHistory(true);
    panY.setValue(0);
    try {
      const token = await AsyncStorage.getItem('dokoToken');
      const filterUserId = (groupData?.recipientId || groupData?.recipientId || groupData?.recipientId || '').toString();
      const result = await transactionHistoryService.getUserTransactionHistory(filterUserId, token);
      if (result.success) {
        const items = (result.docs || []).map(mapDocToItem);
        setHistoryItems(items);
      } else {
        setHistoryItems(transactionHistory);
      }
    } catch (e) {
      setHistoryItems(transactionHistory);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  useEffect(() => {
    if (visible) {
      fetchTransactionStats();
    }
  }, [visible, user]);


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
      <TouchableOpacity
        style={styles.seeAllBtn}
        onPress={openHistoryModal}
      >
        <Text style={[styles.seeAllText, { color: theme.colors.primary }]}>See all</Text>
      </TouchableOpacity>

      <View style={styles.row}>
        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total received</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{stats.totalReceived}</Text>
        </View>

        <View style={styles.divider} />

        <View style={styles.section}>
          <Text style={[styles.label, { color: theme.colors.textSecondary }]}>Total sent</Text>
          <Text style={[styles.value, { color: theme.colors.text }]}>{stats.totalSent}</Text>
        </View>
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
                <View style={[styles.chatAvatar, { backgroundColor: theme.colors.primary }]}>

                  <Text style={[styles.chatAvatarText, { color: '#FFFFFF' }]}>
                    D
                  </Text>

                </View>
                {/* <View style={[styles.avatar,]}>
                  <Image source={require("../assets/Images/userProfile.png")} style={{ width: 80, height: 160, resizeMode: "contain", borderRadius: 40 }} />

                </View> */}
                <Text style={[styles.username, { color: theme.colors.text }]}>
                  {groupData?.name || user?.firstName || 'username'}
                </Text>
              </View>
            </View>

            {/* Action Buttons */}
            {/* <View style={styles.actionButtonsContainer}>
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
                onPress={() => {
                  onActionPress();
                  navigation.navigate('AddingAmount', {
                    data: user,
                  });
                }}
              />
            </View> */}
            {/* <View style={{ marginBottom: 20, width: 220 }}>

              <ActionButton
                icon="person-add"
                title="Send friend request"
                backgroundColor="#FF7B001A"
                iconColor="#FF7B00"
                onPress={() => handleActionPress('send-friend-request')}
                style={styles.fullWidthButton}
              />
            </View> */}

            {/* Transactions Section */}
            <View style={[styles.section, { marginTop: 10 }]}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Transactions
              </Text>
              <EmptySection />
            </View>

            {/* Pending Request Section */}
            {/* <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Pending request
              </Text>
              <EmptySectionRequest />
            </View> */}

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

      {/* Transaction History Modal */}
      <Modal
        visible={showTransactionHistory}
        transparent
        animationType="slide"
        onRequestClose={() => setShowTransactionHistory(false)}
      >
        <StatusBar
          barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
          backgroundColor="transparent"
          translucent
        />
        <View style={styles.transactionModalOverlay}>
          <TouchableOpacity style={styles.transactionModalBackdrop} activeOpacity={1} onPress={() => setShowTransactionHistory(false)} />
          <Animated.View
            style={[
              styles.transactionModalContainer,
              { backgroundColor: theme.colors.background, transform: [{ translateY: panY }] },
            ]}
            {...panResponder.panHandlers}
          > 
            {/* Header */}
            <View style={styles.transactionModalHeader}>
              <TouchableOpacity
                style={styles.transactionModalBackButton}
                onPress={() => setShowTransactionHistory(false)}
                activeOpacity={0.7}
              >
                <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
              </TouchableOpacity>
              <Text style={[styles.transactionModalTitle, { color: theme.colors.text }]}>
                All Transaction
              </Text>
              <View style={styles.transactionModalHeaderSpacer} />
            </View>

            {/* Transaction List */}
            <FlatList
              data={historyItems || []}
              keyExtractor={(item) => item.id}
              showsVerticalScrollIndicator={false}
              contentContainerStyle={styles.transactionListContainer}
              renderItem={({ item, index }) => (
                <TransactionItem
                  item={item}
                  theme={theme}
                  isFirst={index === 0}
                />
              )}
              ListEmptyComponent={() => (
                <View style={{ alignItems: 'center', justifyContent: 'center', paddingVertical: 40 }}>
                  <Text style={{ color: theme.colors.textSecondary, fontSize: 16 }}>
                    No transactions found
                  </Text>
                </View>
              )}
            />
          </Animated.View>
        </View>
      </Modal>
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
  chatAvatar: {
    width: 60,
    height: 60,
    borderRadius: 50,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 5,
  },
  chatAvatarText: {
    fontSize: 28,
    fontWeight: "700",
  },
  profileSection: {
    // alignItems: 'center',
    marginBottom: 15,
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
    paddingHorizontal: 16,
    paddingBottom: 16,
    paddingTop: 28, // extra space for absolute See all button
    margin: 0,
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
    marginTop: 12,
    paddingHorizontal: 4,
  },
  section: {
    flex: 1,
    alignItems: "center",
    minWidth: 120,
  },
  label: {
    fontSize: 16,
    marginBottom: 4,
    textAlign: 'center',
    fontWeight: '600'
  },
  value: {
    fontSize: 18,
    fontWeight: "700",
    textAlign: 'center',
  },
  divider: {
    width: 1,
    height: 48,
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
  // Transaction History Modal Styles
  transactionModalOverlay: {
    flex: 1,
    backgroundColor: 'rgba(0, 0, 0, 0.5)',
    justifyContent: 'flex-end',
  },
  transactionModalBackdrop: {
    ...StyleSheet.absoluteFillObject,
  },
  transactionModalContainer: {
    height: height * 0.85,
    borderTopLeftRadius: 20,
    borderTopRightRadius: 20,
  },
  transactionModalHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    borderBottomWidth: 1,
    borderBottomColor: '#333',
  },
  transactionModalBackButton: {
    padding: 4,
  },
  transactionModalTitle: {
    fontSize: 20,
    fontWeight: 'bold',
    flex: 1,
    textAlign: 'center',
    marginRight: 28, // To center the title (accounting for back button width)
  },
  transactionModalHeaderSpacer: {
    width: 28, // Same as back button width for centering
  },
  transactionListContainer: {
    paddingBottom: 20,
    marginTop: 15
  },
  transactionItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 16,
    marginBottom: 5,
    borderRadius: 15,
    marginHorizontal: 10,
    // borderBottomWidth: 1,
  },
  transactionLeft: {
    flexDirection: 'row',
    alignItems: 'center',
    flex: 1,
  },
  transactionIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 12,
  },
  brandText: {
    color: 'white',
    fontSize: 12,
    fontWeight: 'bold',
  },
  transactionDetails: {
    flex: 1,
  },
  transactionTitle: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
  },
  transactionSubtitle: {
    fontSize: 14,
    opacity: 0.7,
  },
  transactionRight: {
    alignItems: 'flex-end',
  },
  transactionAmount: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 2,
  },
  transactionStatus: {
    fontSize: 14,
    opacity: 0.7,
  },
});

export default UserProfileModal;
