import React, { useState, useEffect, useCallback } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    ScrollView,
    StatusBar,
    SafeAreaView,
    Image,
    Dimensions,
    TextInput,
    FlatList,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import TransferModal from "./TransferModal";
import { chatService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const NewChat = ({ onBackPress, onCreateChannel }) => {
    const { theme, isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('all'); // Changed to 'all' for chat tabs
    const [show, setShow] = useState(false);
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showTransferModal, setShowTransferModal] = useState(false);
    
    // Chat list states
    const [chatList, setChatList] = useState([]);
    const [isLoading, setIsLoading] = useState(false);
    const [authToken, setAuthToken] = useState(null);
    const [error, setError] = useState(null);
    const [isSearching, setIsSearching] = useState(false);
    const [searchResults, setSearchResults] = useState([]);


    const handleSelectRecipient = (recipient) => {
        // setSelectedRecipient(recipient);
        console.log('Selected recipient:', recipient);
        // Here you can navigate to the next screen or perform other actions
        setShowTransferModal(false);
    };

    const handleTransferPress = () => {
        // setShowBottomSheet(false);
        setShowTransferModal(true);
    };
    const handleCloseBottomSheet = () => {
        setShowBottomSheet(false);
    };

    const handleCloseTransferModal = () => {
        setShowTransferModal(false);
    };

    // Load auth token on component mount
    useEffect(() => {
        loadAuthToken();
    }, []);

    // Load chat list when tab changes
    useEffect(() => {
        if (authToken) {
            if (searchQuery.trim()) {
                searchChats(searchQuery);
            } else {
                loadChatList();
            }
        }
    }, [activeTab, authToken]);

    // Clear search results when search query is empty
    useEffect(() => {
        if (!searchQuery.trim()) {
            setSearchResults([]);
            // Reload all chats when search is cleared
            if (authToken) {
                loadChatList();
            }
        }
    }, [searchQuery, authToken]);

    const loadAuthToken = async () => {
        try {
            const token = await AsyncStorage.getItem('dokoToken');
            setAuthToken(token);
        } catch (error) {
            console.error('Error loading auth token:', error);
        }
    };

    const loadChatList = async (searchQuery = null) => {
        if (!authToken) return;
        
        setIsLoading(true);
        setError(null);

        try {
            const chatType = activeTab === 'all' ? null : activeTab;
            const response = await chatService.getChatList(chatType, authToken, searchQuery);
            
            if (response.success) {
                if (searchQuery) {
                    setSearchResults(response.data || []);
                } else {
                    setChatList(response.data || []);
                }
            } else {
                setError(response.error || 'Failed to load chat list');
            }
        } catch (error) {
            console.error('Error loading chat list:', error);
            setError('Failed to load chat list');
        } finally {
            setIsLoading(false);
        }
    };

    const searchChats = async (query) => {
        if (!authToken || !query.trim()) {
            setSearchResults([]);
            return;
        }
        
        setIsSearching(true);
        setError(null);

        try {
            await loadChatList(query.trim());
        } catch (error) {
            console.error('Error searching chats:', error);
            setError('Search failed');
            setSearchResults([]);
        } finally {
            setIsSearching(false);
        }
    };

    // Debounced search function
    const debouncedSearch = useCallback(
        (() => {
            let timeoutId;
            return (query) => {
                clearTimeout(timeoutId);
                // Only search if query is not empty
                if (query.trim()) {
                    timeoutId = setTimeout(() => {
                        searchChats(query);
                    }, 500); // 500ms delay
                }
            };
        })(),
        [authToken, activeTab]
    );

    const handleTabChange = (tab) => {
        setActiveTab(tab);
    };

    const handleSearchChange = (text) => {
        setSearchQuery(text);
        if (text.trim()) {
            debouncedSearch(text);
        } else {
            // Clear search results and load all chats when search is cleared
            setSearchResults([]);
            loadChatList();
        }
    };

    const handleChatPress = (chat) => {
        console.log('Chat pressed:', chat);
        
        // Check if it's a group chat
        if (chat.chatType === 'group') {
            navigation.navigate('GroupSeperateChat', { 
                groupData: {
                    id: chat.chatId || chat.chatId,
                    name: chat.name,
                    participants: chat.participants || [],
                    chatType: chat.chatType
                }
            });
        } else {
            // Handle individual chat navigation
            // navigation.navigate('IndividualChat', { chatData: chat });
            console.log('Individual chat navigation not implemented yet');
        }
    };

    const renderChatItem = ({ item }) => {
        const isGroup = item.chatType === 'group';
        const participantCount = item.participantCount || item.participants?.length || 0;
        console.log("sdagasdg",item);
        
        return (
            <TouchableOpacity
                style={[styles.chatItem, { backgroundColor: theme.colors.surface }]}
                onPress={() => handleChatPress(item)}
                activeOpacity={0.7}
            >
                <View style={styles.chatItemContent}>
                    <View style={[styles.chatAvatar, { backgroundColor: theme.colors.primary }]}>
                        <Text style={[styles.chatAvatarText, { color: '#FFFFFF' }]}>
                            {isGroup ? 'G' : item.name?.charAt(0)?.toUpperCase() || '?'}
                        </Text>
                    </View>
                    <View style={styles.chatDetails}>
                        <Text style={[styles.chatName, { color: theme.colors.text }]}>
                            {item.name || 'Unknown Chat'}
                        </Text>
                        <Text style={[styles.chatDescription, { color: theme.colors.textSecondary }]}>
                            {isGroup 
                                ? `${participantCount} members` 
                                : item.description || 'No description'
                            }
                        </Text>
                    </View>
                    <View style={styles.chatStatus}>
                        {isGroup && (
                            <Ionicons name="people" size={16} color={theme.colors.textSecondary} />
                        )}
                    </View>
                </View>
            </TouchableOpacity>
        );
    };


    const styles = StyleSheet.create({
        container: {
            flex: 1,
            backgroundColor: theme.colors.background,
        },
        statusBar: {
            backgroundColor: theme.colors.background,
        },
        scrollContainer: {
            flex: 1,
        },
        scrollContent: {
            flexGrow: 1,
            paddingBottom: 100
        },
        header: {
            paddingTop: 10,
            paddingBottom: theme.spacing.lg,
            paddingHorizontal: theme.spacing.lg,
            position: 'relative',
        },
        headerContent: {
            flexDirection: 'row',
            alignItems: 'center',
            // paddingHorizontal: 20,

            // marginTop: theme.spacing.md,
        },
        backButton: {
            padding: theme.spacing.sm,
            marginRight: theme.spacing.md,
        },
        headerTitle: {
            fontSize: theme.typography.sizes.xxl,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            // textAlign: 'center',
            flex: 1,
        },
        noChannelSection: {
            backgroundColor: theme.colors.surface,
            marginHorizontal: 20,
            marginBottom: 20,
            // margin:,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xl,
            alignItems: 'center',
            position: 'relative',
            height: height * 0.37,
            marginTop: 20
        },
        bookmarkIcon: {
            // width: 60,
            // height: 60,
            // borderRadius: 30,
            // backgroundColor: isDarkMode ? '#374151' : '#F3F4F6',
            // justifyContent: 'center',
            // alignItems: 'center',
            // marginBottom: theme.spacing.lg,
            position: 'absolute',
            top: -20
        },
        noChannelTitle: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
            textAlign: 'center',
        },
        noChannelDescription: {
            fontSize: theme.typography.sizes.md,
            color: theme.colors.textSecondary,
            textAlign: 'center',
            marginBottom: theme.spacing.xl,
            lineHeight: 22,
        },
        createChannelButton: {
            borderRadius: theme.borderRadius.md,
            overflow: 'hidden',
            width: '100%',
        },
        createChannelButtonText: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            color: '#FFFFFF',
            textAlign: 'center',
            paddingVertical: 14,
        },
        tabsContainer: {
            flexDirection: 'row',
            marginHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.xs,
        },
        tab: {
            flex: 1,
            paddingVertical: theme.spacing.sm,
            paddingHorizontal: theme.spacing.md,
            borderRadius: theme.borderRadius.md,
            alignItems: 'center',
        },
        activeTab: {
            backgroundColor: theme.colors.background,
        },
        tabText: {
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
        },
        activeTabText: {
            color: theme.colors.primary,
        },
        inactiveTabText: {
            color: theme.colors.textSecondary,
        },
        contentContainer: {
            paddingHorizontal: theme.spacing.lg,
            paddingBottom: theme.spacing.xl,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: 16,
            paddingVertical: 12,
            borderRadius: 50,
            marginBottom: 16,
            marginHorizontal: 20
        },
        searchInput: {
            flex: 1,
            fontSize: 16,
            marginLeft: 8,
        },
        guideContainer: {
            backgroundColor: theme.colors.surface,
            borderRadius: theme.borderRadius.lg,
            padding: theme.spacing.lg,
        },
        guideStep: {
            marginBottom: theme.spacing.md,
        },
        guideStepNumber: {
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
        },
        guideStepTitle: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.sm,
        },
        guideStepDescription: {
            fontSize: theme.typography.sizes.sm,
            color: theme.colors.textSecondary,
            lineHeight: 20,
        },
        lastStep: {
            marginBottom: 0,
        },
        chatListContainer: {
            marginHorizontal: theme.spacing.lg,
            marginBottom: theme.spacing.lg,
            maxHeight: 400,
        },
        chatList: {
            maxHeight: 400,
        },
        chatItem: {
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.md,
            backgroundColor: theme.colors.surface,
        },
        chatItemContent: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        chatAvatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme.spacing.md,
        },
        chatAvatarText: {
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.bold,
        },
        chatDetails: {
            flex: 1,
        },
        chatName: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            marginBottom: 2,
        },
        chatDescription: {
            fontSize: theme.typography.sizes.sm,
        },
        chatStatus: {
            alignItems: 'center',
        },
        loadingContainer: {
            padding: theme.spacing.md,
            alignItems: 'center',
        },
        loadingText: {
            marginTop: theme.spacing.sm,
            fontSize: theme.typography.sizes.sm,
        },
        errorContainer: {
            padding: theme.spacing.md,
            alignItems: 'center',
        },
        errorText: {
            fontSize: theme.typography.sizes.sm,
            textAlign: 'center',
            marginBottom: theme.spacing.sm,
        },
        retryButton: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.xs,
            borderRadius: theme.borderRadius.sm,
            borderWidth: 1,
            borderColor: theme.colors.primary,
        },
        retryButtonText: {
            fontSize: theme.typography.sizes.sm,
            fontWeight: theme.typography.weights.medium,
        },
        emptyChatContainer: {
            padding: theme.spacing.md,
            alignItems: 'center',
        },
        emptyChatText: {
            fontSize: theme.typography.sizes.sm,
            textAlign: 'center',
        },
    });


    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <View style={[styles.headerContent, { paddingHorizontal: 18 }]}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation?.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.headerSpacer} />
            </View>
            <ScrollView
                style={styles.scrollContainer}
                contentContainerStyle={styles.scrollContent}
                showsVerticalScrollIndicator={false}
                bounces={true}
            >
                {/* Header */}

                <View style={styles.header}>
                    <View style={styles.headerContent}>

                        <Text style={styles.headerTitle}>Private Chat</Text>
                    </View>
                </View>

                <View style={[styles.searchContainer, { backgroundColor: theme.colors.surface, gap: 5 }]}>
                    <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                    <TextInput
                        style={[styles.searchInput, { color: theme.colors.text }]}
                        placeholder="Search chats..."
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={handleSearchChange}
                    />
                </View>

                {/* Tabs outside the card */}
                <View style={styles.tabsContainer}>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'all' && styles.activeTab]}
                        onPress={() => handleTabChange('all')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'all' ? styles.activeTabText : styles.inactiveTabText
                        ]}>
                            All
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'individual' && styles.activeTab]}
                        onPress={() => handleTabChange('individual')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'individual' ? styles.activeTabText : styles.inactiveTabText
                        ]}>
                            Chat
                        </Text>
                    </TouchableOpacity>
                    <TouchableOpacity
                        style={[styles.tab, activeTab === 'group' && styles.activeTab]}
                        onPress={() => handleTabChange('group')}
                    >
                        <Text style={[
                            styles.tabText,
                            activeTab === 'group' ? styles.activeTabText : styles.inactiveTabText
                        ]}>
                            Group
                        </Text>
                    </TouchableOpacity>
                </View>

                {/* Chat List outside the card */}
                <View style={styles.chatListContainer}>
                    {isLoading || isSearching ? (
                        <View style={styles.loadingContainer}>
                            <ActivityIndicator size="small" color={theme.colors.primary} />
                            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                                {isSearching ? 'Searching...' : 'Loading chats...'}
                            </Text>
                        </View>
                    ) : error ? (
                        <View style={styles.errorContainer}>
                            <Text style={[styles.errorText, { color: theme.colors.error }]}>
                                {error}
                            </Text>
                            {/* <TouchableOpacity
                                style={styles.retryButton}
                                onPress={loadChatList}
                            >
                                <Text style={[styles.retryButtonText, { color: theme.colors.primary }]}>
                                    Retry
                                </Text>
                            </TouchableOpacity> */}
                        </View>
                    ) : (() => {
                        const displayData = searchQuery.trim() ? searchResults : chatList;
                        const isEmpty = displayData.length === 0;
                        const emptyMessage = searchQuery.trim() 
                            ? `No chats found for "${searchQuery}"` 
                            : 'No chats found';
                        
                        return isEmpty ? (
                            <View style={styles.emptyChatContainer}>
                                <Text style={[styles.emptyChatText, { color: theme.colors.textSecondary }]}>
                                    {emptyMessage}
                                </Text>
                            </View>
                        ) : (
                            <FlatList
                                data={displayData}
                                renderItem={renderChatItem}
                                keyExtractor={(item) => item.id || item._id}
                                showsVerticalScrollIndicator={false}
                                scrollEnabled={true}
                                style={styles.chatList}
                                nestedScrollEnabled={true}
                                bounces={true}
                                alwaysBounceVertical={false}
                            />
                        );
                    })()}
                </View>

                {/* No Channel Selected Section */}
                <View style={styles.noChannelSection}>
                    <View style={styles.bookmarkIcon}>
                        <Image source={require("../assets/Images/Bookmark.png")} style={{ width: 65, height: 65, resizeMode: 'contain' }} />
                    </View>
                    <View style={{ flex: 1, width: "100%", paddingTop: 35 }}>
                        <Text style={styles.noChannelTitle}>No conversation selected</Text>
                        <Text style={styles.noChannelDescription}>
                            Choose a conversation from the sidebar or start a new one
                        </Text>
                        <TouchableOpacity
                            style={styles.createChannelButton}
                            onPress={()=> handleTransferPress()}
                            activeOpacity={0.8}
                        >
                            <LinearGradient
                                colors={['#4F46E5', '#7C3AED']}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.createChannelButton}
                            >
                                <Text style={styles.createChannelButtonText}>New Chat</Text>
                            </LinearGradient>
                        </TouchableOpacity>
                        <View style={{ paddingVertical: 15 }}>
                            <Button
                                title={"New Group"}
                                variant="outline"
                                onPress={() => navigation.navigate('NewGroup')}
                            />
                        </View>
                    </View>
                </View>



            </ScrollView>
            <TransferModal
                visible={showTransferModal}
                onClose={handleCloseTransferModal}
                onSelectRecipient={handleSelectRecipient}
            />

        </SafeAreaView>
    );
};

export default NewChat;
