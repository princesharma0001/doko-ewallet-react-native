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
  StatusBar,
  Image,
  TouchableHighlight,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserProfileModal from './UserProfileModal';

const { width, height } = Dimensions.get('window');

const SearchUsernameModal = ({ visible, onClose, onSelectUser }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);

  const mockUsers = [
    {
      id: 'sami343',
      username: 'sami343',
      avatar: 'D',
      avatarColor: '#169BFF',
      isSelected: true,
    },
    {
      id: 'housen',
      username: 'Housen',
      avatar: 'H',
      avatarColor: '#E91E63',
    },
    {
      id: 'khaled32',
      username: 'Khaled32',
      avatar: 'K',
      avatarColor: '#4CAF50',
    },
    {
      id: 'david234',
      username: 'David234',
      avatar: 'D',
      avatarColor: '#FF9800',
    },
    {
      id: 'ali34adf',
      username: 'Ali34adf',
      avatar: 'A',
      avatarColor: '#9C27B0',
    },
    {
      id: 'chantale33',
      username: 'Chantale33',
      avatar: 'C',
      avatarColor: '#F44336',
    },
    {
      id: 'javed345',
      username: 'Javed345',
      avatar: 'J',
      avatarColor: '#00BCD4',
    },
    {
      id: 'chantal78',
      username: 'Chantal78',
      avatar: 'C',
      avatarColor: '#795548',
    },
  ];

  const filteredUsers = mockUsers.filter(user =>
    user.username.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const handleUserSelect = (user) => {
    console.log('Selected user:', user.username);
    setSelectedUser(user);
    setShowUserProfileModal(true);
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setShowUserProfileModal(false);
    onSelectUser({ ...selectedUser, action });
  };

  const UserItem = ({ user }) => (
    <TouchableHighlight
      style={[
        styles.userItem,

      ]}
      onPress={() => handleUserSelect(user)}
      underlayColor={theme.colors.surface} // highlight color when pressed
    >
      <View style={styles.userContent}>
        <View style={[styles.avatar, { backgroundColor: user.avatarColor }]}>
          <Text style={styles.avatarText}>{user.avatar}</Text>
         
        </View>
        <Text style={[styles.username, { color: theme.colors.text }]}>
          @{user.username}
        </Text>
      </View>
    </TouchableHighlight>
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
              style={styles.closeButton}
              onPress={onClose}
              activeOpacity={0.7}
            >
              <AntDesign name="close" size={24} color={theme.colors.text} />
            </TouchableOpacity>
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
              New Transfer
            </Text>
            <View style={styles.headerRight}>
              {/* <TouchableOpacity style={styles.qrButton} activeOpacity={0.7}>
                <Ionicons name="qr-code" size={20} color="#169BFF" />
              </TouchableOpacity> */}
              {/* <TouchableOpacity onPress={onClose} activeOpacity={0.7}>
                <Text style={[styles.cancelText, { color: theme.colors.text }]}>
                  Cancel
                </Text>
              </TouchableOpacity> */}
            </View>
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
            <TouchableOpacity style={styles.searchQrButton} activeOpacity={0.7}>
              <Ionicons name="qr-code" size={20} color="#169BFF" />
            </TouchableOpacity>
          </View>

          {/* Users List */}
          <ScrollView style={styles.usersList} showsVerticalScrollIndicator={false}>
            {filteredUsers.map((user) => (
              <UserItem key={user.id} user={user} />
            ))}
          </ScrollView>
        </View>
      </View>

      {/* User Profile Modal */}
      <UserProfileModal
        visible={showUserProfileModal}
        onClose={() => setShowUserProfileModal(false)}
        user={selectedUser}
        onActionPress={handleProfileAction}
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
  headerRight: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 16,
  },
  qrButton: {
    padding: 4,
  },
  cancelText: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginHorizontal: 20,
    marginBottom: 20,
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 50,
  },
  searchInput: {
    flex: 1,
    marginLeft: 12,
    fontSize: 16,
    fontFamily: 'System',
  },
  searchQrButton: {
    padding: 4,
  },
  usersList: {
    flex: 1,
    paddingHorizontal: 20,
  },
  userItem: {
    paddingVertical: 12,
    paddingHorizontal: 4,
    borderRadius: 13,
  },
  userContent: {
    flexDirection: 'row',
    alignItems: 'center',
    marginLeft:5
  },
  avatar: {
    width: 40,
    height: 40,
    borderRadius: 20,
    alignItems: 'center',
    justifyContent: 'center',
    marginRight: 16,
    position: 'relative',
  },
  avatarText: {
    color: 'white',
    fontSize: 16,
    fontWeight: '600',
    fontFamily: 'System',
  },
  selectionIndicator: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 16,
    height: 16,
    borderRadius: 8,
    backgroundColor: 'white',
    alignItems: 'center',
    justifyContent: 'center',
  },
  username: {
    fontSize: 16,
    fontWeight: '500',
    fontFamily: 'System',
  },
});

export default SearchUsernameModal;
