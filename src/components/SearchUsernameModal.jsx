import React, { useState, useEffect, useRef } from 'react';
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
  ActivityIndicator,
  Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import UserProfileModal from './UserProfileModal';
import { authService, chatService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
import { useNavigation } from '@react-navigation/native';

const { width, height } = Dimensions.get('window');

const SearchUsernameModal = ({ visible, onClose, onClose1, onClose2, onSelectUser }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showUserProfileModal, setShowUserProfileModal] = useState(false);
  const [selectedUser, setSelectedUser] = useState(null);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [creatingChatForUser, setCreatingChatForUser] = useState(null);

  const [searchError, setSearchError] = useState(null);
  const searchTimeoutRef = useRef(null);
  const navigation = useNavigation();
  // Search function
  const searchUsers = async (query) => {
    // if (!query.trim()) {
    //   setSearchResults([]);
    //   setSearchError(null);
    //   return;
    // }

    try {
      setIsSearching(true);
      setSearchError(null);

      const token = await AsyncStorage.getItem('dokoToken');
      if (!token) {
        setSearchError('Authentication required');
        return;
      }

      const result = await authService.searchUsers(query, token);

      if (result.success) {
        setSearchResults(result.data || []);
      } else {
        setSearchError(result.error || 'Search failed');
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchError('An error occurred while searching');
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };

  // Debounced search effect
  useEffect(() => {
    // Clear previous timeout
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    // Set new timeout for search
    searchTimeoutRef.current = setTimeout(() => {
      searchUsers(searchQuery);
    }, 500); // 500ms delay

    // Cleanup timeout on unmount
    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  // Clear search results when modal closes
  useEffect(() => {
    if (!visible) {
      setSearchQuery('');
      setSearchResults([]);
      setSearchError(null);
      setIsSearching(false);
    }
  }, [visible]);

  // Generate avatar color based on user data
  const getAvatarColor = (user) => {
    const colors = ['#169BFF', '#E91E63', '#4CAF50', '#FF9800', '#9C27B0', '#F44336', '#00BCD4', '#795548'];
    const index = (user.firstName?.charCodeAt(0) || 0) % colors.length;
    return colors[index];
  };

  // Get avatar text from user data
  const getAvatarText = (user) => {
    if (user.firstName) {
      return user.firstName.charAt(0).toUpperCase();
    }
    return 'U';
  };

  const handleUserSelect = async (user) => {
    console.log("sdagasdgasdg", user);
// setShowUserProfileModal(true)
    const userId = user?._id || user?.id;
    const userName = user?.firstName || user?.username;
    setSelectedUser(user);

    await createIndividualChat(userId, userName);

    console.log('Selected user:', user.username);
    // setShowUserProfileModal(true);
  };

  const createIndividualChat = async (participantId, userName) => {
    console.log("dgasdgasdg", userName);

    const token = await AsyncStorage.getItem('dokoToken');
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication required',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setCreatingChatForUser(participantId);

    try {
      const response = await chatService.createIndividualChat(participantId, token);
      console.log("asfsdaf", response);

      if (response.success) {
        console.log("asdgsdgsadg", response);
        const data = response?.data;
        // Close all local modals before navigating
        setShowUserProfileModal(false);
        onClose && onClose();
        onClose1();
        onClose2();
        navigation.navigate('InvidusalGroup', {
          groupData: {
            id: data.chatId || data.chatId,
            name: userName ?? "",
            recipientId: data?.id || data._id,
            chatType: data.chatType
          }
        });

        // Navigate to the chat or handle the response
        // You can add navigation logic here if needed
        console.log('Chat created:', response.data);

      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error ?? 'Failed to create individual chat',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating individual chat:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create individual chat',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setCreatingChatForUser(null);
    }
  };
  const sendFriendRequestHandleer = async (participantId) => {

    const token = await AsyncStorage.getItem('dokoToken');
    if (!token) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication required',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setCreatingChatForUser(participantId);

    try {

      const response = await authService.sendFriendRequest(participantId, token);
      console.log("asfsdaf", response);

      if (response.success) {
        setShowUserProfileModal(false);
        onClose && onClose();
        onClose1();
        onClose2();
        console.log("adfsadgasdgsdagsdagsda", response);
        Toast.show({
          type: 'success',
          text1: 'success',
          text2: response?.message,
          position: 'top',
          visibilityTime: 3000,
        });

        console.log('Chat created:', response.data);

      } else {
        Toast.show({
          type: 'error',
          text1: 'Error',
          text2: response.error ?? 'Failed to create individual chat',
          position: 'top',
          visibilityTime: 3000,
        });
      }
    } catch (error) {
      console.error('Error creating individual chat:', error);
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Failed to create individual chat',
        position: 'top',
        visibilityTime: 3000,
      });
    } finally {
      setCreatingChatForUser(null);
    }
  };

  const handleProfileAction = (action) => {
    console.log('Profile action:', action);
    setShowUserProfileModal(false);
    onSelectUser({ ...selectedUser, action });
  };

  // const UserItem = ({ user }) => (
  const UserItem = ({ user }) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User';
    const initials = `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() || 'U';
    const userId = user._id || user.id;
    const isThisUserCreating = creatingChatForUser === userId;
    console.log("sdagasdgasd", user);


    return (
      <TouchableHighlight
        // style={[styles.userItem]}
        style={[styles.userItem, isThisUserCreating && styles.disabledItem]}

        onPress={() => handleUserSelect(user)}
        underlayColor={theme.colors.surface}
        disabled={isThisUserCreating}

      >
        <View style={styles.userContent}>
          <View style={[styles.avatar, { backgroundColor: getAvatarColor(user) }]}>
            <Text style={styles.avatarText}>{getAvatarText(user)}</Text>
          </View>
          <View style={styles.userInfo}>
            <Text style={[styles.username, { color: theme.colors.text }]}>
              {user.firstName} {user.lastName}
            </Text>
            <Text style={[styles.userPhone, { color: theme.colors.textSecondary }]}>
              {user.countryCode} {user.phone}
            </Text>
          </View>
          {user?.isFriend ? null :
            <TouchableOpacity onPress={() => sendFriendRequestHandleer(user?._id)
            }>

              {isThisUserCreating ? (
                <ActivityIndicator size="small" color={theme.colors.primary} />
              ) : (
                <Ionicons name="person-add" size={20} color={theme.colors.textSecondary} />
              )}
            </TouchableOpacity>}
        </View>
      </TouchableHighlight>
    );
  };

  // Skeleton loading component
  const SkeletonItem = () => (
    <View style={styles.userItem}>
      <View style={styles.userContent}>
        <View style={[styles.avatar, styles.skeletonAvatar]} />
        <View style={styles.userInfo}>
          <View style={[styles.skeletonText, { width: 120, height: 16, marginBottom: 4 }]} />
          <View style={[styles.skeletonText, { width: 80, height: 14 }]} />
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
            {isSearching ? (
              // Show skeleton loading
              Array.from({ length: 3 }).map((_, index) => (
                <SkeletonItem key={index} />
              ))
            ) : searchError ? (
              // Show error message
              <View style={styles.errorContainer}>
                <Text style={[styles.errorText, { color: theme.colors.textSecondary }]}>
                  {searchError}
                </Text>
              </View>
            ) : searchResults.length > 0 ? (
              // Show search results
              searchResults?.map((user) => (
                <UserItem key={user._id || user.id} user={user} />
              ))
            ) : searchQuery.trim() ? (
              // Show no results message
              <View style={styles.noResultsContainer}>
                <Text style={[styles.noResultsText, { color: theme.colors.textSecondary }]}>
                  No users found for "{searchQuery}"
                </Text>
              </View>
            ) : (
              // Show initial message
              <View style={styles.initialContainer}>
                <Text style={[styles.initialText, { color: theme.colors.textSecondary }]}>
                  Search for users by phone number or name
                </Text>
              </View>
            )}
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
    paddingVertical: Platform.OS === 'ios' ? 8 : 0,
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
    marginLeft: 5
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
  userInfo: {
    flex: 1,
  },
  disabledItem: {
    opacity: 0.6,
  },
  userPhone: {
    fontSize: 14,
    fontWeight: '400',
    fontFamily: 'System',
    marginTop: 2,
  },
  // Skeleton loading styles
  skeletonAvatar: {
    backgroundColor: '#E0E0E0',
  },
  skeletonText: {
    backgroundColor: '#E0E0E0',
    borderRadius: 4,
  },
  // Container styles
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  errorText: {
    fontSize: 16,
    textAlign: 'center',
  },
  noResultsContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  noResultsText: {
    fontSize: 16,
    textAlign: 'center',
  },
  initialContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    paddingVertical: 40,
  },
  initialText: {
    fontSize: 16,
    textAlign: 'center',
  },
});

export default SearchUsernameModal;
