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
    TextInput
} from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import Icon from 'react-native-vector-icons/MaterialIcons';
const { width, height } = Dimensions.get('window');
import Ionicons from 'react-native-vector-icons/Ionicons';
import Button from './Button';
import { useNavigation } from '@react-navigation/native';
import TransferModal from "./TransferModal";

const NewChat = ({ onBackPress, onCreateChannel }) => {
    const { theme, isDarkMode } = useTheme();
    const [activeTab, setActiveTab] = useState('guide');
    const [show, setShow] = useState(false);
    const navigation = useNavigation();
    const [searchQuery, setSearchQuery] = useState('');
    const [showTransferModal, setShowTransferModal] = useState(false);


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
                        placeholder="Search"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={searchQuery}
                        onChangeText={setSearchQuery}
                    />
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
