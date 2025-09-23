import React, { useState } from 'react';
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
    Alert,
    ActivityIndicator
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from '../components/Button';
import { useNavigation } from '@react-navigation/native';
import { chatService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const NewGroup = () => {
    const { theme, isDarkMode } = useTheme();
    const navigation = useNavigation();
    const [groupName, setGroupName] = useState('');
    const [groupDescription, setGroupDescription] = useState('');
    const [groupImage, setGroupImage] = useState(null);
    const [selectedUsers, setSelectedUsers] = useState([]);
    const [searchQuery, setSearchQuery] = useState('');
    const [isCreating, setIsCreating] = useState(false);
    const [authToken, setAuthToken] = useState(null);

    // Mock user data - replace with actual API call
    const [users] = useState([
        { id: '1', name: 'John Doe', username: '@johndoe', avatar: null, isOnline: true },
        { id: '2', name: 'Jane Smith', username: '@janesmith', avatar: null, isOnline: false },
        { id: '3', name: 'Mike Johnson', username: '@mikej', avatar: null, isOnline: true },
        { id: '4', name: 'Sarah Wilson', username: '@sarahw', avatar: null, isOnline: true },
        { id: '5', name: 'David Brown', username: '@davidb', avatar: null, isOnline: false },
        { id: '6', name: 'Lisa Davis', username: '@lisad', avatar: null, isOnline: true },
        { id: '7', name: 'Tom Anderson', username: '@toma', avatar: null, isOnline: false },
        { id: '8', name: 'Emma Taylor', username: '@emmat', avatar: null, isOnline: true },
    ]);

    const filteredUsers = users.filter(user =>
        user.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
        user.username.toLowerCase().includes(searchQuery.toLowerCase())
    );

    const handleUserSelect = (user) => {
        const isSelected = selectedUsers.find(selectedUser => selectedUser.id === user.id);
        if (isSelected) {
            setSelectedUsers(selectedUsers.filter(selectedUser => selectedUser.id !== user.id));
        } else {
            setSelectedUsers([...selectedUsers, user]);
        }
    };

    // const handleImagePicker = () => {
    //     const options = {
    //         title: 'Select Group Image',
    //         storageOptions: {
    //             skipBackup: true,
    //             path: 'images',
    //         },
    //     };

    //     ImagePicker.showImagePicker(options, (response) => {
    //         if (response.didCancel) {
    //             console.log('User cancelled image picker');
    //         } else if (response.error) {
    //             console.log('ImagePicker Error: ', response.error);
    //         } else if (response.customButton) {
    //             console.log('User tapped custom button: ', response.customButton);
    //         } else {
    //             setGroupImage(response);
    //         }
    //     });
    // };

    // Load auth token on component mount
    React.useEffect(() => {
        loadAuthToken();
    }, []);

    const loadAuthToken = async () => {
        try {
            const token = await AsyncStorage.getItem('authToken');
            setAuthToken(token);
        } catch (error) {
            console.error('Error loading auth token:', error);
        }
    };

    const handleCreateGroup = async () => {
        if (!groupName.trim()) {
            Alert.alert('Error', 'Please enter a group name');
            return;
        }
        if (selectedUsers.length < 2) {
            Alert.alert('Error', 'Please select at least 2 members for the group');
            return;
        }
        if (!authToken) {
            Alert.alert('Error', 'Authentication required. Please login again.');
            return;
        }

        setIsCreating(true);

        try {
            // Prepare group data according to API specification
            const groupData = {
                name: groupName.trim(),
                description: groupDescription.trim() || '',
                participants: selectedUsers.map(user => user.id), // Assuming user.id is the participant ID
                isPrivate: false // You can make this configurable if needed
            };

            console.log('Creating group with data:', groupData);

            const response = await chatService.createGroup(groupData, authToken);

            if (response.success) {
                Alert.alert('Success', 'Group created successfully!', [
                    {
                        text: 'OK',
                        onPress: () => navigation.goBack()
                    }
                ]);
            } else {
                Alert.alert('Error', response.error || 'Failed to create group');
            }
        } catch (error) {
            console.error('Error creating group:', error);
            Alert.alert('Error', 'An unexpected error occurred while creating the group');
        } finally {
            setIsCreating(false);
        }
    };

    const renderUserItem = ({ item }) => {
        const isSelected = selectedUsers.find(selectedUser => selectedUser.id === item.id);

        return (
            <TouchableOpacity
                style={[
                    styles.userItem,
                    { backgroundColor: theme.colors.surface },
                    isSelected && { backgroundColor: theme.colors.primary + '20' }
                ]}
                onPress={() => handleUserSelect(item)}
                activeOpacity={0.7}
            >
                <View style={styles.userInfo}>
                    <View style={[styles.avatar, { backgroundColor: theme.colors.primary }]}>
                        {item.avatar ? (
                            <Image source={{ uri: item.avatar }} style={styles.avatarImage} />
                        ) : (
                            <Text style={[styles.avatarText, { color: '#FFFFFF' }]}>
                                {item.name.charAt(0).toUpperCase()}
                            </Text>
                        )}
                    </View>
                    <View style={styles.userDetails}>
                        <Text style={[styles.userName, { color: theme.colors.text }]}>
                            {item.name}
                        </Text>
                        <Text style={[styles.userUsername, { color: theme.colors.textSecondary }]}>
                            {item.username}
                        </Text>
                    </View>
                    <View style={styles.userStatus}>
                        <View style={[
                            styles.statusIndicator,
                            { backgroundColor: item.isOnline ? '#10B981' : '#6B7280' }
                        ]} />
                        {isSelected && (
                            <Ionicons name="checkmark-circle" size={24} color={theme.colors.primary} />
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
        header: {
            flexDirection: 'row',
            alignItems: 'center',
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            borderBottomWidth: 1,
            borderBottomColor: theme.colors.border,
        },
        backButton: {
            padding: theme.spacing.sm,
            marginRight: theme.spacing.md,
        },
        headerTitle: {
            fontSize: theme.typography.sizes.xl,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            flex: 1,
        },
        createButton: {
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
        },
        createButtonText: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.primary,
        },
        scrollContainer: {
            flex: 1,
        },
        content: {
            padding: theme.spacing.lg,
        },
        groupImageSection: {
            alignItems: 'center',
            marginBottom: theme.spacing.xl,
        },
        groupImageContainer: {
            width: 100,
            height: 100,
            borderRadius: 50,
            backgroundColor: theme.colors.surface,
            justifyContent: 'center',
            alignItems: 'center',
            marginBottom: theme.spacing.md,
            borderWidth: 2,
            borderColor: theme.colors.border,
        },
        groupImage: {
            width: 96,
            height: 96,
            borderRadius: 48,
        },
        addImageButton: {
            position: 'absolute',
            bottom: 0,
            right: 0,
            width: 32,
            height: 32,
            borderRadius: 16,
            backgroundColor: theme.colors.primary,
            justifyContent: 'center',
            alignItems: 'center',
            // borderWidth: 2,
            // borderColor: theme.colors.background,
        },
        groupNameInput: {
            backgroundColor: theme.colors.surface,
            borderRadius: 10,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            fontSize: theme.typography.sizes.md,
            color: theme.colors.text,
            // borderWidth: 1,
            // borderColor: theme.colors.border,
        },
        searchContainer: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.surface,
            borderRadius: 50,
            paddingHorizontal: theme.spacing.lg,
            paddingVertical: theme.spacing.md,
            marginBottom: theme.spacing.lg,
            // borderWidth: 1,
            // borderColor: theme.colors.border,
        },
        searchInput: {
            flex: 1,
            fontSize: theme.typography.sizes.md,
            color: theme.colors.text,
            marginLeft: theme.spacing.sm,
        },
        sectionTitle: {
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.bold,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
        },
        selectedUsersContainer: {
            marginBottom: theme.spacing.lg,
        },
        selectedUsersTitle: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            color: theme.colors.text,
            marginBottom: theme.spacing.md,
        },
        selectedUsersList: {
            flexDirection: 'row',
            flexWrap: 'wrap',
            gap: theme.spacing.sm,
        },
        selectedUserChip: {
            flexDirection: 'row',
            alignItems: 'center',
            backgroundColor: theme.colors.primary + '20',
            paddingHorizontal: theme.spacing.md,
            paddingVertical: theme.spacing.sm,
            borderRadius: theme.borderRadius.full,
            borderRadius:10
        },
        selectedUserName: {
            fontSize: theme.typography.sizes.sm,
            color: theme.colors.primary,
            marginRight: theme.spacing.sm,
        },
        userItem: {
            borderRadius: theme.borderRadius.lg,
            marginBottom: theme.spacing.sm,
            padding: theme.spacing.md,
        },
        userInfo: {
            flexDirection: 'row',
            alignItems: 'center',
        },
        avatar: {
            width: 48,
            height: 48,
            borderRadius: 24,
            justifyContent: 'center',
            alignItems: 'center',
            marginRight: theme.spacing.md,
        },
        avatarImage: {
            width: 48,
            height: 48,
            borderRadius: 24,
        },
        avatarText: {
            fontSize: theme.typography.sizes.lg,
            fontWeight: theme.typography.weights.bold,
        },
        userDetails: {
            flex: 1,
        },
        userName: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            marginBottom: 2,
        },
        userUsername: {
            fontSize: theme.typography.sizes.sm,
        },
        userStatus: {
            flexDirection: 'row',
            alignItems: 'center',
            gap: theme.spacing.sm,
        },
        statusIndicator: {
            width: 8,
            height: 8,
            borderRadius: 4,
        },
        createGroupButton: {
            borderRadius: theme.borderRadius.lg,
            overflow: 'hidden',
            marginTop: theme.spacing.xl,
        },
        createGroupButtonText: {
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
            color: '#FFFFFF',
            textAlign: 'center',
            paddingVertical: theme.spacing.md,
        },
        loadingOverlay: {
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            backgroundColor: 'rgba(0, 0, 0, 0.5)',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 1000,
        },
        loadingContainer: {
            backgroundColor: theme.colors.surface,
            padding: theme.spacing.xl,
            borderRadius: theme.borderRadius.lg,
            alignItems: 'center',
            minWidth: 200,
        },
        loadingText: {
            marginTop: theme.spacing.md,
            fontSize: theme.typography.sizes.md,
            fontWeight: theme.typography.weights.medium,
        },
    });

    return (
        <SafeAreaView style={styles.container}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Header */}
            <View style={styles.header}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>
                <Text style={styles.headerTitle}>New Group</Text>
                <TouchableOpacity
                    style={styles.createButton}
                    onPress={handleCreateGroup}
                    disabled={!groupName.trim() || selectedUsers.length < 2 || isCreating}
                >
                    {isCreating ? (
                        <ActivityIndicator size="small" color={theme.colors.primary} />
                    ) : (
                        <Text style={[
                            styles.createButtonText,
                            (!groupName.trim() || selectedUsers.length < 2 || isCreating) && { opacity: 0.5 }
                        ]}>
                            Create
                        </Text>
                    )}
                </TouchableOpacity>
            </View>

            <ScrollView style={styles.scrollContainer} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {/* Group Image Section */}


                    {/* Group Name Input */}
                    <View style={{ paddingBottom: 25 }}>

                        <TextInput
                            style={styles.groupNameInput}
                            placeholder="Group name"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={groupName}
                            onChangeText={setGroupName}
                            maxLength={50}
                        />
                        <View style={{ paddingTop: 15 }}>

                            <TextInput
                                style={[styles.groupNameInput, { height: 80 }]}
                                placeholder="Enter description"
                                placeholderTextColor={theme.colors.textSecondary}
                                value={groupDescription}
                                onChangeText={setGroupDescription}
                                maxLength={50}
                                multiline={true}
                                numberOfLines={10}
                            />
                        </View>
                    </View>

                    {/* Selected Users */}
                    {selectedUsers.length > 0 && (
                        <View style={styles.selectedUsersContainer}>
                            <Text style={styles.selectedUsersTitle}>
                                Selected Members ({selectedUsers.length})
                            </Text>
                            <View style={styles.selectedUsersList}>
                                {selectedUsers.map((user) => (
                                    <View key={user.id} style={styles.selectedUserChip}>
                                        <Text style={styles.selectedUserName}>{user.name}</Text>
                                        <TouchableOpacity onPress={() => handleUserSelect(user)}>
                                            <Ionicons name="close" size={16} color={theme.colors.primary} />
                                        </TouchableOpacity>
                                    </View>
                                ))}
                            </View>
                        </View>
                    )}

                    {/* Search Users */}
                    <Text style={styles.sectionTitle}>Add Members</Text>
                    <View style={styles.searchContainer}>
                        <Ionicons name="search" size={20} color={theme.colors.textSecondary} />
                        <TextInput
                            style={styles.searchInput}
                            placeholder="Search users..."
                            placeholderTextColor={theme.colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>

                    {/* Users List */}
                    <FlatList
                        data={filteredUsers}
                        renderItem={renderUserItem}
                        keyExtractor={(item) => item.id}
                        scrollEnabled={false}
                        showsVerticalScrollIndicator={false}
                    />
                </View>
            </ScrollView>

            {/* Loading Overlay */}
            {isCreating && (
                <View style={styles.loadingOverlay}>
                    <View style={styles.loadingContainer}>
                        <ActivityIndicator size="large" color={theme.colors.primary} />
                        <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                            Creating group...
                        </Text>
                    </View>
                </View>
            )}
        </SafeAreaView>
    );
};

export default NewGroup;
