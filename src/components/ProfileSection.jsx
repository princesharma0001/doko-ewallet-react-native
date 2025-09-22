import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    Dimensions,
    Image,
    StatusBar,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import Feather from 'react-native-vector-icons/Feather';
import AntDesign from 'react-native-vector-icons/AntDesign';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';

const { width, height } = Dimensions.get('window');

const ProfileSection = ({ navigation }) => {
    const { theme } = useTheme();
    const [activeItem, setActiveItem] = useState('Dashboard');

    const menuItems = [
        { id: 'Personal Details', label: 'Personal Details', route: 'ProfileDetails', icon: <Ionicons name="person-outline" size={20} color={theme.colors.text} /> },

        { id: 'Subscription', route: "MySubscription", label: 'My Subscription', icon: <Ionicons name="ribbon-outline" size={20} color={theme.colors.text} /> },
        { id: 'notifications', label: 'Notification Settings', route: "Notification", icon: <Ionicons name="notifications-outline" size={20} color={theme.colors.text} /> },
        { id: 'Privacy', label: 'Privacy', route: "MyDocument", icon: <Ionicons name="shield-checkmark-outline" size={20} color={theme.colors.text} /> },
        { id: 'terms', label: 'Terms & Conditions', route: "MyTerms", icon: <Ionicons name="document-text-outline" size={20} color={theme.colors.text} /> },
        { id: 'referral', label: 'Referral', route: "ReferralSection", icon: <Ionicons name="grid-outline" size={20} color={theme.colors.text} /> },

    ];


    const handleMenuItemPress = (itemId, route) => {
        setActiveItem(itemId);
        navigation.navigate(route);
    };


    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <View style={styles.headerContent}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation?.goBack()}
                >
                    <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
                </TouchableOpacity>

                <View style={styles.headerSpacer} />

                <TouchableOpacity onPress={() => navigation.navigate("KYCSection")} style={[styles.proMemberButton, { backgroundColor: "#246BFD" }]}>
                    <Text style={[styles.proMemberText, { color: "#fff" }]}>Verify Identity</Text>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderProfileInfo = () => (
        <View style={styles.profileInfoContainer}>
            <View style={[styles.avatarContainer, {}]}>
                <View style={styles.avatarGradient}>
                    <Image
                        source={require('../assets/Images/Profile.png')}
                        style={styles.avatar}
                    />
                </View>
            </View>

            <Text style={[styles.userName, { color: theme.colors.text }]}>Devon Lane</Text>

            <View style={styles.usernameContainer}>
                <Text style={[styles.username, { color: theme.colors.text }]}>Faizan_231</Text>
                <Ionicons name="grid-outline" size={16} color={theme.colors.text} style={styles.usernameIcon} />
            </View>
        </View>
    );


    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                {renderProfileInfo()}
                <View style={{
                    flex: 1,
                    backgroundColor: theme.colors.surface,
                    paddingHorizontal: 15,
                    marginHorizontal: 15,
                    borderRadius: 13,
                    paddingVertical: 15
                }}>

                    {menuItems.map((item) => {
                        const isActive = activeItem === item.id;
                        return (
                            <TouchableOpacity
                                key={item.id}
                                style={[
                                    styles.menuItem,
                                    isActive && { backgroundColor: theme.colors.border },
                                ]}
                                onPress={() => handleMenuItemPress(item.id, item?.route)}
                            >
                                <View style={styles.menuContent}>
                                    {item.icon}
                                    <Text
                                        style={[
                                            styles.menuLabel,
                                            {
                                                fontFamily: theme.typography.fontFamily,
                                                color: theme.colors.text
                                            },
                                        ]}
                                    >
                                        {item.label}
                                    </Text>
                                </View>
                                <AntDesign name="right" size={14} color={theme.colors.text} />
                            </TouchableOpacity>
                        );
                    })}
                </View>
            </ScrollView>
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        paddingTop: 50,
        paddingBottom: 20,
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
    },
    headerSpacer: {
        flex: 1,
    },
    proMemberButton: {
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 20,
    },
    proMemberText: {
        fontSize: 14,
        fontWeight: '600',
    },
    scrollView: {
        flex: 1,
    },
    profileInfoContainer: {
        alignItems: 'center',
        // paddingVertical: 40,
        paddingBottom: 20,
        paddingHorizontal: 20,
    },
    avatarContainer: {
        width: 120,
        height: 120,
        borderRadius: 60,
        marginBottom: 20,
        padding: 4,
    },
    avatar: {
        width: 100,
        height: 100,
        borderRadius: 40,
        marginVertical: 10,
        resizeMode: 'contain'
    },
    avatarGradient: {
        flex: 1,
        borderRadius: 56,
        alignItems: 'center',
        justifyContent: 'center',
    },
    avatarFigure: {
        width: 80,
        height: 80,
        borderRadius: 40,
        alignItems: 'center',
        justifyContent: 'center',
        backgroundColor: '#8B5CF6', // Purple figure
    },
    menuItem: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingVertical: 14,
        paddingHorizontal: 12,
        borderRadius: 12,
        justifyContent: 'space-between',
        marginBottom: 5,
    },
    menuContent: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    menuLabel: {
        fontSize: 16,
        marginLeft: 10,
    },
    userName: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        textAlign: 'center',
    },
    usernameContainer: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    username: {
        fontSize: 16,
        color: '#9CA3AF',
        marginRight: 8,
    },
    usernameIcon: {
        marginLeft: 4,
    },
    menuContainer: {
        marginHorizontal: 20,
        borderRadius: 16,
        overflow: 'hidden',
    },

    lastMenuItem: {
        borderBottomWidth: 0,
    },
    menuItemLeft: {
        flexDirection: 'row',
        alignItems: 'center',
        flex: 1,
    },
    menuIcon: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    menuTitle: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
});

export default ProfileSection;