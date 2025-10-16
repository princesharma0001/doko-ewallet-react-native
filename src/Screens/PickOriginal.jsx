import React, { useState } from 'react';
import {
    View,
    Text,
    TouchableOpacity,
    StyleSheet,
    SafeAreaView,
    StatusBar,
    ScrollView,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';

const PickOriginal = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [selectedMethod, setSelectedMethod] = useState('Bank Transfer');

    const transferMethods = [
        {
            id: 'Passport',
            name: 'Passport',
            icon: 'business',
            flag: '🇨🇺',
        },
        {
            id: 'License',
            name: 'License',
            icon: 'shield',
            flag: '🇨🇺',
        },
        // {
        //     id: 'Western Union 2',
        //     name: 'Western Union',
        //     icon: 'car',
        //     flag: '🇨🇺',
        // },
        // {
        //     id: 'Western Union 3',
        //     name: 'Western Union',
        //     icon: 'car',
        //     flag: '🇨🇺',
        // },
    ];

    const handleMethodSelect = (methodId) => {
        setSelectedMethod(methodId);
        console.log("Sdgasdgsa", methodId);
        if (methodId === "Bank Transfer") {
            console.log("adgasd");

            // navigation.navigate("BankTransferSendInternational")
        } else {
            console.log("adgasd");

            // navigation.navigate("WesternUnion")
        }


    };

    const renderTransferMethod = (method) => (
        <TouchableOpacity
            key={method.id}
            style={[
                styles.methodItem,
                {
                    backgroundColor: selectedMethod === method.id
                        ? (isDarkMode ? '#3A3A5E' : '#E3F2FD')
                        : 'transparent',
                    borderRadius: 13,
                    marginHorizontal: 10,
                    //   marginVertical: 4,
                }
            ]}
            onPress={() => handleMethodSelect(method.id)}
            activeOpacity={0.7}
        >
            <View style={styles.methodContent}>
                {/* Radio Button */}
                <View style={[
                    styles.radioButton,
                    {
                        borderColor: selectedMethod === method.id
                            ? theme.colors.primary
                            : theme.colors.textSecondary,
                        backgroundColor: selectedMethod === method.id
                            ? theme.colors.primary
                            : 'transparent',
                    }
                ]}>
                    {selectedMethod === method.id && (
                        <View style={styles.radioInner} />
                    )}
                </View>

                {/* Icon */}
                <View style={[
                    styles.iconContainer,
                    { backgroundColor: theme.colors.primary }
                ]}>
                    <Ionicons
                        name={method.icon}
                        size={20}
                        color="white"
                    />
                </View>
                <Text style={styles.flagEmoji}>{method.flag}</Text>

                {/* Method Name */}
                <Text style={[
                    styles.methodName,
                    {
                        color: theme.colors.text,

                    }
                ]}>
                    {method.name}
                </Text>

                {/* Flag */}
                {/* <Text style={styles.flagEmoji}>{method.flag}</Text> */}
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
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation.goBack()}
                    activeOpacity={0.7}
                >
                    <Text style={[styles.backIcon, { color: theme.colors.text }]}>←</Text>
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
                        styles.title,
                        { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }
                    ]}>
                        Pick an original Document
                    </Text>
                </View>

                {/* Disclaimer Text */}
                <View style={styles.disclaimerContainer}>
                    <Text style={[
                        styles.disclaimerText,
                        { color: theme.colors.text }
                    ]}>
                        We need an official document to complete your account. All data in encrypted and secure.
                    </Text>
                </View>

                {/* Transfer Methods Container */}
                <View style={[
                    styles.methodsContainer,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border
                    }
                ]}>
                    {transferMethods.map(renderTransferMethod)}
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
        paddingTop: 10,
        paddingBottom: 10,
        backgroundColor: 'transparent',
    },
    backButton: {
        width: 40,
        height: 40,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    backIcon: {
        fontSize: 24,
        fontWeight: 'bold',
    },
    titleContainer: {
        paddingHorizontal: 20,
        paddingTop: 20,
        paddingBottom: 10,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        // textAlign: 'center',
    },
    disclaimerContainer: {
        paddingHorizontal: 20,
        paddingTop: 10,
        paddingBottom: 20,
    },
    disclaimerText: {
        fontSize: 15,
        // fontStyle: 'italic',
        // textAlign: 'center',
        lineHeight: 20,
    },
    methodsContainer: {
        marginHorizontal: 20,
        borderRadius: 16,
        paddingVertical: 8,
        borderWidth: 1,
    },
    methodItem: {
        paddingVertical: 9,
        paddingHorizontal: 20,
        marginBottom: 5
    },
    methodContent: {
        flexDirection: 'row',
        alignItems: 'center',
    },
    radioButton: {
        width: 20,
        height: 20,
        borderRadius: 10,
        borderWidth: 2,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    radioInner: {
        width: 8,
        height: 8,
        borderRadius: 4,
        backgroundColor: 'white',
    },
    iconContainer: {
        width: 30,
        height: 30,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        marginRight: 16,
    },
    methodName: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    flagEmoji: {
        fontSize: 20,
        paddingRight: 10
    },
});

export default PickOriginal;