import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    TextInput,
    TouchableOpacity,
    FlatList,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    Dimensions,
    ScrollView,
    Platform,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const { width, height } = Dimensions.get('window');

// Country data based on the screenshot

const suggestedCountries = [
    { name: 'Poland Gold', flag: '🇵🇱', currency: 'PLN', selected: true },
    { name: 'Monaco', flag: '🇲🇨', currency: 'ZFC', selected: false },
    { name: 'Euro', flag: '🇪🇺', currency: 'EUR', selected: false },
    { name: 'Cuba', flag: '🇨🇺', currency: 'CUP', selected: false },

    // { name: 'British', flag: '🇬🇧', currency: 'GBP', selected: false },
    // { name: 'French', flag: '🇫🇷', currency: 'EUR', selected: false },
    // { name: 'Canadian', flag: '🇨🇦', currency: 'CAD', selected: false },
];

const supportedCountries = [
    { name: 'Poland Gold', flag: '🇵🇱', currency: 'PLN', selected: false },
    { name: 'Monaco', flag: '🇲🇨', currency: 'ZFC', selected: false },
    { name: 'Cuba', flag: '🇨🇺', currency: 'CUP', selected: false },
    { name: 'Euro', flag: '🇪🇺', currency: 'EUR', selected: false },
    { name: 'United Kingdom', flag: '🇬🇧', currency: 'GBP', selected: false },
    { name: 'United States', flag: '🇺🇸', currency: 'USD', selected: false },
    { name: 'Germany', flag: '🇩🇪', currency: 'EUR', selected: false },
    { name: 'France', flag: '🇫🇷', currency: 'EUR', selected: false },
    { name: 'Italy', flag: '🇮🇹', currency: 'EUR', selected: false },
    { name: 'Spain', flag: '🇪🇸', currency: 'EUR', selected: false },
    { name: 'Japan', flag: '🇯🇵', currency: 'JPY', selected: false },
    { name: 'China', flag: '🇨🇳', currency: 'CNY', selected: false },
    { name: 'India', flag: '🇮🇳', currency: 'INR', selected: false },
    { name: 'Australia', flag: '🇦🇺', currency: 'AUD', selected: false },
    { name: 'Brazil', flag: '🇧🇷', currency: 'BRL', selected: false },
];

const KYCSection = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [searchQuery, setSearchQuery] = useState('');
    const [suggestedList, setSuggestedList] = useState(suggestedCountries);
    const [supportedList, setSupportedList] = useState(supportedCountries);
    const [filteredSupported, setFilteredSupported] = useState(supportedCountries);

    useEffect(() => {
        if (searchQuery.trim() === '') {
            setFilteredSupported(supportedCountries);
        } else {
            const filtered = supportedCountries.filter(country =>
                country.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                country.currency.toLowerCase().includes(searchQuery.toLowerCase())
            );
            setFilteredSupported(filtered);
        }
    }, [searchQuery]);

    const handleCountrySelect = (country, isSuggested = false) => {
        if (isSuggested) {
            const updatedSuggested = suggestedList.map(item => ({
                ...item,
                selected: item.name === country.name
            }));
            setSuggestedList(updatedSuggested);
            navigation.navigate("PickOriginal");
        } else {
            const updatedSupported = supportedList.map(item => ({
                ...item,
                selected: item.name === country.name
            }));
            setSupportedList(updatedSupported);
            navigation.navigate("PickOriginal");

        }
    };

    const renderSuggestedCountry = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.countryItem,
                {
                    backgroundColor: item.selected
                        ? (isDarkMode ? '#3A3A5E' : '#E3F2FD')
                        : 'transparent',
                    borderRadius: 12,
                    marginHorizontal: 16,
                    marginVertical: 4,
                }
            ]}
            onPress={() => handleCountrySelect(item, true)}
            activeOpacity={0.7}
        >
            <View style={styles.countryInfo}>
                <View style={[
                    styles.flagContainer,
                    { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                ]}>
                    <Text style={styles.flagEmoji}>{item.flag}</Text>
                </View>
                <Text style={[
                    styles.countryName,
                    { color: theme.colors.text }
                ]}>
                    {item.name}
                </Text>
            </View>
        </TouchableOpacity>
    );

    const renderSupportedCountry = ({ item }) => (
        <TouchableOpacity
            style={[
                styles.countryItem,
                {
                    backgroundColor: item.selected
                        ? (isDarkMode ? '#3A3A5E' : '#E3F2FD')
                        : 'transparent',
                    borderRadius: 12,
                    marginHorizontal: 16,
                    marginVertical: 4,
                }
            ]}
            onPress={() => handleCountrySelect(item, false)}
            activeOpacity={0.7}
        >
            <View style={styles.countryInfo}>
                <View style={[
                    styles.flagContainer,
                    { backgroundColor: isDarkMode ? 'rgba(255, 255, 255, 0.1)' : 'rgba(0, 0, 0, 0.05)' }
                ]}>
                    <Text style={styles.flagEmoji}>{item.flag}</Text>
                </View>
                <View style={styles.countryDetails}>
                    <Text style={[
                        styles.countryName,
                        { color: theme.colors.text }
                    ]}>
                        {item.name}
                    </Text>
                    <Text style={[
                        styles.currencyCode,
                        { color: theme.colors.textSecondary }
                    ]}>
                        {item.currency}
                    </Text>
                </View>
            </View>
        </TouchableOpacity>
    );

    return (
        <SafeAreaView style={[
            styles.container,
            { backgroundColor: theme.colors.background }
        ]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />

            {/* Fixed Header with Back Button */}
            <View style={styles.fixedHeader}>
                {/* <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
                </TouchableOpacity> */}
                <TouchableOpacity onPress={() => navigation.goBack()}>

                    <Text style={[styles.backIcon, { color: theme.colors.textSecondary }]}>Later</Text>
                </TouchableOpacity>

            </View>

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {/* Title */}
                <View style={styles.titleContainer}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: theme.colors.text, fontSize: theme.typography.sizes.xxl, }
                    ]}>
                        Select Citizenship
                    </Text>
                </View>
                {/* Search Bar */}
                <View style={styles.searchContainer}>
                    <View style={[
                        styles.searchBar,
                        {
                            backgroundColor: isDarkMode ? '#2A2A3E' : '#F5F5F5',
                            borderColor: theme.colors.border
                        }
                    ]}>
                        <Ionicons
                            name="search"
                            size={22}
                            color={theme.colors.text}
                        />
                        <TextInput
                            style={[
                                styles.searchInput,
                                {
                                    color: theme.colors.text,
                                    fontFamily: theme.typography.fontFamily,
                                    fontSize: theme.typography.sizes.md,
                                    paddingLeft: 8
                                }
                            ]}
                            placeholder="Search"
                            placeholderTextColor={theme.colors.textSecondary}
                            value={searchQuery}
                            onChangeText={setSearchQuery}
                        />
                    </View>
                </View>

                {/* Suggested Countries */}
                <View style={styles.sectionContainer}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: theme.colors.text }
                    ]}>
                        Suggested countries
                    </Text>
                    <FlatList
                        data={suggestedList}
                        renderItem={renderSuggestedCountry}
                        keyExtractor={(item) => item.name}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                </View>

                {/* Supported Countries */}
                <View style={styles.sectionContainer}>
                    <Text style={[
                        styles.sectionTitle,
                        { color: theme.colors.text }
                    ]}>
                        Supported countries
                    </Text>
                    <FlatList
                        data={filteredSupported}
                        renderItem={renderSupportedCountry}
                        keyExtractor={(item) => item.name}
                        showsVerticalScrollIndicator={false}
                        scrollEnabled={false}
                    />
                </View>
            </ScrollView>
        </SafeAreaView>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
        paddingTop: Platform.OS === 'android' ? StatusBar.currentHeight : 0,

    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        flexGrow: 1,
        paddingBottom: 20,
    },
    fixedHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
        justifyContent: 'flex-end',
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    titleContainer: {
        // paddingHorizontal: 5,
        paddingTop: 10,
        paddingBottom: 20,
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    backIcon: {
        fontSize: 16,
        // fontWeight: 'bold',
    },
    title: {
        fontSize: 24,
        fontWeight: 'bold',
        flex: 1,
        lineHeight: 28,
    },
    searchContainer: {
        paddingHorizontal: 20,
        marginBottom: 24,
    },
    searchBar: {
        flexDirection: 'row',
        alignItems: 'center',
        borderRadius: 22,
        paddingHorizontal: 16,
        paddingVertical: Platform.OS === 'android' ? 0 : 12,
        // borderWidth: 1,
    },
    searchIcon: {
        fontSize: 16,
        marginRight: 12,
    },
    searchInput: {
        flex: 1,
        fontSize: 16,
    },
    sectionContainer: {
        marginBottom: 24,
    },
    sectionTitle: {
        fontSize: 18,
        fontWeight: '700',
        marginBottom: 12,
        paddingHorizontal: 20,
    },
    countryItem: {
        paddingVertical: 12,
        paddingHorizontal: 16,
    },
    countryInfo: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    flagContainer: {
        width: 40,
        height: 40,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    flagEmoji: {
        fontSize: 20,
    },
    countryDetails: {
        flex: 1,
    },
    countryName: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    currencyCode: {
        fontSize: 14,
        opacity: 0.7,
    },
    supportedList: {
        // Removed maxHeight to allow full scrolling
    },
});

export default KYCSection;
