import React, { useState } from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Modal,
  ScrollView,
  TextInput,
  Dimensions,
  TouchableHighlight,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddDokoFriendModal from './AddDokoFriendModal';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const TransferModal = ({ visible, onClose, onSelectRecipient }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDokoFriendModal, setShowAddDokoFriendModal] = useState(false);
  const navigation = useNavigation();

  const recipientTypes = [
    {
      id: 'doko-user',
      title: 'DOKO user',
      icon: 'R',
      // isSelected: true,
    },
    {
      id: 'bank-recipient',
      title: 'Bank recipient',
      icon: 'bank',
    },
    {
      id: 'send-international',
      title: 'Send international',
      icon: 'globe',
    },
    // {
    //   id: 'send-locally',
    //   title: 'Send locally',
    //   icon: 'tree',
    // },
  ];

  const recentRecipients = [
    {
      id: 'sami',
      name: 'Sami',
      initials: 'S',
      avatarColor: '#4CAF50',
      lastTransaction: 'You sent $25',
      emoji: '🌸',
      date: 'Thu',
    },
    {
      id: 'housen-soufan',
      name: 'Housen Soufan',
      initials: 'HS',
      avatarColor: '#E91E63',
      lastTransaction: 'Sent you $40',
      emoji: '💰',
      date: 'Thu',
    },
    {
      id: 'swati',
      name: 'Swati',
      initials: 'KB',
      avatarColor: '#2196F3',
      lastTransaction: 'You sent $26',
      emoji: '🌸',
      date: 'Mon',
    },
    {
      id: 'david-o',
      name: 'David O',
      initials: 'DO',
      avatarColor: '#FF9800',
      lastTransaction: 'You sent $5.98',
      emoji: '🌸',
      date: 'Mon',
    },
  ];

  const handleRecipientTypePress = (type) => {
    console.log('Selected recipient type:', type.title);
    if (type.id === 'doko-user') {
      setShowAddDokoFriendModal(true);
    } else if(type.id === "send-international"){
      onClose()
      navigation.navigate("SendInternational")

    } else {
      onSelectRecipient(type);
    }
  };

  const handleAddDokoFriendOption = (option) => {
    console.log('Selected DOKO friend option:', option.title);
    setShowAddDokoFriendModal(false);
    onSelectRecipient({ ...option, type: 'doko-friend-option' });
  };

  const handleRecentRecipientPress = (recipient) => {
    console.log('Selected recent recipient:', recipient.name);
    onSelectRecipient(recipient);
  };

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'R':
        return <Text style={[styles.iconText, { color: "#169BFF",fontSize:32,fontWeight:'700' }]}>R</Text>;
      case 'bank':
        return <Ionicons name="business" size={24} color={theme.colors.primary} />;
      case 'globe':
        return <Ionicons name="globe" size={24} color={theme.colors.primary} />;
      case 'tree':
        return <Ionicons name="leaf" size={24} color={theme.colors.primary} />;
      default:
        return <Ionicons name="person" size={24} color={theme.colors.primary} />;
    }
  };

const RecipientTypeItem = ({ type }) => (
  <TouchableHighlight
    onPress={() => handleRecipientTypePress(type)}
    underlayColor={theme.colors.surface} // highlight color when pressed
    style={{ borderRadius: 8 }} // optional: to clip highlight to rounded corners
  >
    <View
      style={[
        styles.recipientTypeItem,
        // { backgroundColor: theme.colors.surface },
      ]}
    >
      <View style={styles.typeIconContainer}>
        {getIconComponent(type.icon)}
      </View>
      <Text style={[styles.typeTitle, { color: theme.colors.text }]}>
        {type.title}
      </Text>
    </View>
  </TouchableHighlight>
);
  const RecentRecipientItem = ({ recipient }) => (
    <TouchableOpacity
      style={styles.recentRecipientItem}
      onPress={() => handleRecentRecipientPress(recipient)}
      activeOpacity={0.7}
    >
      <View style={[styles.avatar, { backgroundColor: recipient.avatarColor }]}>
        <Text style={styles.avatarText}>{recipient.initials}</Text>
      </View>
      <View style={styles.recipientInfo}>
        <Text style={[styles.recipientName, { color: theme.colors.text }]}>
          {recipient.name}
        </Text>
        <Text style={[styles.lastTransaction, { color: theme.colors.textSecondary }]}>
          {recipient.emoji} {recipient.lastTransaction}
        </Text>
      </View>
      <Text style={[styles.transactionDate, { color: theme.colors.textSecondary }]}>
        {recipient.date}
      </Text>
    </TouchableOpacity>
  );

  return (
    <Modal
      visible={visible}
      transparent
      animationType="fade"
      onRequestClose={onClose}
    >
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
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              New Transfer
            </Text>
            <View style={{ width: 24 }} />
          </View>

          {/* Search Bar */}
          <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface }]}>
            <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
            <TextInput
              style={[styles.searchInput, { color: theme.colors.text }]}
              placeholder="Search"
              placeholderTextColor={theme.colors.textSecondary}
              value={searchQuery}
              onChangeText={setSearchQuery}
            />
          </View>

          <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
            {/* Add New Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Add New
              </Text>
              <View style={styles.recipientTypesContainer}>
                {recipientTypes.map((type) => (
                  <RecipientTypeItem key={type.id} type={type} />
                ))}
              </View>
            </View>

            {/* Recent Recipients Section */}
            <View style={styles.section}>
              <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                Add new
              </Text>
              <View style={styles.recentRecipientsContainer}>
                {recentRecipients.map((recipient) => (
                  <RecentRecipientItem key={recipient.id} recipient={recipient} />
                ))}
              </View>
            </View>
          </ScrollView>
        </View>
      </View>

      {/* Add DOKO Friend Modal */}
      <AddDokoFriendModal
        visible={showAddDokoFriendModal}
        onClose={() => setShowAddDokoFriendModal(false)}
        onSelectOption={handleAddDokoFriendOption}
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
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingBottom: 20,
  },
  closeButton: {
    padding: 4,
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 12,
    borderRadius: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  content: {
    flex: 1,
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    marginBottom: 16,
    fontFamily: 'System',
  },
  recipientTypesContainer: {
    gap: 8,
  },
  recipientTypeItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 12,
  },
  typeIconContainer: {
    width: 40,
    height: 40,
    borderRadius: 8,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  iconText: {
    fontSize: 18,
    fontWeight: '600',
    fontFamily: 'System',
  },
  typeTitle: {
    fontSize: 16,
    fontWeight: '700',
    fontFamily: 'System',
  },
  recentRecipientsContainer: {
    gap: 4,
  },
  recentRecipientItem: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingVertical: 12,
    paddingHorizontal: 4,
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  recipientInfo: {
    flex: 1,
  },
  recipientName: {
    fontSize: 16,
    fontWeight: '500',
    marginBottom: 2,
    fontFamily: 'System',
  },
  lastTransaction: {
    fontSize: 14,
    fontFamily: 'System',
  },
  transactionDate: {
    fontSize: 14,
    fontFamily: 'System',
  },
});

export default TransferModal;
