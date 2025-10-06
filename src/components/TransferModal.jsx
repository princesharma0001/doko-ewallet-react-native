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
  TouchableHighlight,
  ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import AntDesign from 'react-native-vector-icons/AntDesign';
import Ionicons from 'react-native-vector-icons/Ionicons';
import AddDokoFriendModal from './AddDokoFriendModal';
import { useNavigation } from '@react-navigation/native';
import { authService, chatService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const TransferModal = ({ visible, onClose, onSelectRecipient }) => {
  const { theme } = useTheme();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAddDokoFriendModal, setShowAddDokoFriendModal] = useState(false);
  const [searchResults, setSearchResults] = useState([]);
  const [isSearching, setIsSearching] = useState(false);
  const [authToken, setAuthToken] = useState(null);
  const [creatingChatForUser, setCreatingChatForUser] = useState(null);
  const searchTimeoutRef = useRef(null);
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

  // Load auth token on component mount
  useEffect(() => {
    const loadAuthToken = async () => {
      try {
        const token = await AsyncStorage.getItem('dokoToken');
        setAuthToken(token);
      } catch (error) {
        console.error('Error loading auth token:', error);
      }
    };
    loadAuthToken();
  }, []);

  // Search users with debouncing
  useEffect(() => {
    if (searchTimeoutRef.current) {
      clearTimeout(searchTimeoutRef.current);
    }

    if (searchQuery.trim().length >= 2) {
      searchTimeoutRef.current = setTimeout(() => {
        searchUsers(searchQuery.trim());
      }, 500); // 500ms debounce
    } else {
      setSearchResults([]);
    }

    return () => {
      if (searchTimeoutRef.current) {
        clearTimeout(searchTimeoutRef.current);
      }
    };
  }, [searchQuery]);

  const searchUsers = async (query) => {
    if (!authToken) {
      console.log('No auth token available');
      return;
    }

    setIsSearching(true);
    try {
      const response = await authService.searchUsers(query, authToken);
      if (response.success) {
        setSearchResults(response.data || []);
      } else {
        console.error('Search failed:', response.error);
        setSearchResults([]);
      }
    } catch (error) {
      console.error('Search error:', error);
      setSearchResults([]);
    } finally {
      setIsSearching(false);
    }
  };


  const handleRecipientTypePress = (type) => {
    console.log('Selected recipient type:', type.title);
    if (type.id === 'doko-user') {
      setShowAddDokoFriendModal(true);
    } else if (type.id === "send-international") {
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

  const handleRecentRecipientPress = async (recipient) => {
    console.log('Selected recent recipient:', recipient.name);

    // If it's a search result type, create individual chat
    if (recipient.type === 'search-result') {
      await createIndividualChat(recipient.id, recipient.id);
    } else {
      // For hardcoded recent recipients, just call onSelectRecipient
      onSelectRecipient(recipient);
    }
  };

  const handleSearchResultPress = async (user) => {
    console.log('Selected search result:', user);
    const userId = user._id || user.id;
    const userName = user.firstName || user.firstName;

    // Transform API user data to match expected recipient format
    const recipient = {
      id: userId,
      name: `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User',
      initials: `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() || 'U',
      avatarColor: '#169BFF', // Default DOKO blue
      email: user.email,
      phone: user.phone,
      username: user.username,
      type: 'search-result'
    };

    await createIndividualChat(userId, userId,userName);
  };

  const createIndividualChat = async (participantId, userId,userName) => {
    if (!authToken) {
      Toast.show({
        type: 'error',
        text1: 'Error',
        text2: 'Authentication required',
        position: 'top',
        visibilityTime: 3000,
      });
      return;
    }

    setCreatingChatForUser(userId);

    try {
      const response = await chatService.createIndividualChat(participantId, authToken);

      if (response.success) {
        const data = response?.data;

        navigation.navigate('InvidusalGroup', {
          groupData: {
            id: data.chatId || data.chatId,
            name: userName ?? "",
            recipientId: data?.id || data._id,
            chatType: data.chatType
          }
        });
        // Toast.show({
        //   type: 'success',
        //   text1: 'Success',
        //   text2: response?.message ?? 'Individual chat created successfully!',
        //   position: 'top',
        //   visibilityTime: 3000,
        // });

        // Close the modal
        onClose();

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

  const getIconComponent = (iconName) => {
    switch (iconName) {
      case 'R':
        return <Text style={[styles.iconText, { color: "#169BFF", fontSize: 32, fontWeight: '700' }]}>R</Text>;
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

  const SearchResultItem = ({ user }) => {
    const fullName = `${user.firstName || ''} ${user.lastName || ''}`.trim() || user.email || 'Unknown User';
    const initials = `${(user.firstName || '').charAt(0)}${(user.lastName || '').charAt(0)}`.toUpperCase() || 'U';
    const userId = user._id || user.id;
    const isThisUserCreating = creatingChatForUser === userId;

    return (
      <TouchableOpacity
        style={[styles.recentRecipientItem, isThisUserCreating && styles.disabledItem]}
        onPress={() => handleSearchResultPress(user)}
        activeOpacity={0.7}
        disabled={isThisUserCreating}
      >
        <View style={[styles.avatar, { backgroundColor: '#169BFF' }]}>
          <Text style={styles.avatarText}>{initials}</Text>
        </View>
        <View style={styles.recipientInfo}>
          <Text style={[styles.recipientName, { color: theme.colors.text }]}>
            {fullName}
          </Text>
          <Text style={[styles.lastTransaction, { color: theme.colors.textSecondary }]}>
            {user.email}
          </Text>

        </View>
        {isThisUserCreating ? (
          <ActivityIndicator size="small" color={theme.colors.primary} />
        ) : (
          <Ionicons name="chatbubble-outline" size={20} color={theme.colors.textSecondary} />
        )}
      </TouchableOpacity>
    );
  };

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
              placeholder="Search users"
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
                {recipientTypes?.map((type) => (
                  <RecipientTypeItem key={type.id} type={type} />
                ))}
              </View>
            </View>

            {/* Search Results Section - Only show when actively searching */}
            {searchQuery.trim().length >= 2 && (
              <View style={styles.section}>
                <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
                  Search Results
                </Text>
                <View style={styles.recentRecipientsContainer}>
                  {isSearching ? (
                    <View style={styles.loadingContainer}>
                      <ActivityIndicator size="small" color={theme.colors.primary} />
                      <Text style={[styles.loadingText, { color: theme.colors.textSecondary }]}>
                        Searching users...
                      </Text>
                    </View>
                  ) : searchResults.length > 0 ? (
                    searchResults.map((user) => (
                      <SearchResultItem key={user._id || user.id} user={user} />
                    ))
                  ) : (
                    <View style={styles.emptyContainer}>
                      <Text style={[styles.emptyText, { color: theme.colors.textSecondary }]}>
                        No users found for "{searchQuery}"
                      </Text>
                    </View>
                  )}
                </View>
              </View>
            )}
          </ScrollView>
        </View>
      </View>

      {/* Add DOKO Friend Modal */}
      <AddDokoFriendModal
        visible={showAddDokoFriendModal}
        onClose={() => setShowAddDokoFriendModal(false)}
        onSelectOption={handleAddDokoFriendOption}
        onClose1={onClose}

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
  loadingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    paddingVertical: 20,
  },
  loadingText: {
    marginLeft: 8,
    fontSize: 14,
  },
  emptyContainer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  emptyText: {
    fontSize: 14,
    textAlign: 'center',
  },
  disabledItem: {
    opacity: 0.6,
  },
});

export default TransferModal;
