import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    Alert,
    Clipboard,
    ActivityIndicator,
    Share,
} from 'react-native';
import { useTheme } from '../../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { bankService } from '../../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';

const { width, height } = Dimensions.get('window');

const BankTransfer = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [selectedTransferType, setSelectedTransferType] = useState('swift');
    const [bankDetails, setBankDetails] = useState({
        swift: null,
        sepa: null
    });
    const [isLoading, setIsLoading] = useState(false);
    const [error, setError] = useState(null);

    // Default fallback data
    const defaultBankDetails = {
        swift: {
            beneficiary: 'DOKO',
            bankName: '12345676565',
            ibanNumber: 'Sort Code',
            swiftCode: 'DOKO',
            accountNumber: 'DOKO',
            address: '1234567898525',
            note: 'Swati Sri #5657'
        },
        sepa: {
            beneficiary: 'DOKO SEPA',
            bankName: 'SEPA Bank Ltd',
            ibanNumber: 'GB29 NWBK 6016 1331 9268 19',
            swiftCode: 'SEPA',
            accountNumber: 'SEPA123456',
            address: 'London, UK',
            note: 'SEPA Transfer #5657'
        }
    };

    // Load bank details when transfer type changes
    useEffect(() => {
        loadBankDetails(selectedTransferType);
    }, [selectedTransferType]);

    const loadBankDetails = async (bankType) => {
        console.log("bankTypebankType", bankType);

        const token = await AsyncStorage.getItem('dokoToken');

        setIsLoading(true);
        setError(null);

        try {
            const response = await bankService.getBankDetails(bankType, token);
            console.log("adFGADFGADS",response);


            if (response.success && response.data && response.data.length > 0) {
                const bankData = response.data[0]; // Get first bank detail
console.log("sdagasdfgs",bankData);

                // Map API response to component structure
                const mappedData = {
                    beneficiary: bankData.accountHolderName || 'N/A',
                    bankName: bankData.bankName || 'N/A',
                    ibanNumber: bankData.iban || bankData.maskedIban || 'N/A',
                    swiftCode: bankData.swiftCode || 'N/A',
                    accountNumber: bankData.accountNumber || bankData.accountNumber || 'N/A',
                    address: bankData.bankAddress || 'N/A',
                    note: `${bankData.description || 'Bank Transfer'}`
                };

                setBankDetails(prev => ({
                    ...prev,
                    [bankType]: mappedData
                }));
            } else {
                // Use default data if API fails or returns empty
                // setBankDetails(prev => ({
                //     ...prev,
                //     [bankType]: defaultBankDetails[bankType]
                // }));
            }
        } catch (error) {
            console.error('Error loading bank details:', error);
            setError('Failed to load bank details');
            // Use default data on error
            setBankDetails(prev => ({
                ...prev,
                [bankType]: defaultBankDetails[bankType]
            }));
        } finally {
            setIsLoading(false);
        }
    };

    const copyToClipboard = async (text, label) => {
        try {
            await Clipboard.setString(text);
            Alert.alert('Copied', `${label} copied to clipboard`);
        } catch (error) {
            Alert.alert('Error', 'Failed to copy to clipboard');
        }
    };

    const handleShareDetails = async () => {
        const currentDetails = bankDetails[selectedTransferType] || defaultBankDetails[selectedTransferType];
        
        if (!currentDetails) {
            Alert.alert('Error', 'Bank details not available');
            return;
        }

        const shareText = `🏦 Bank Transfer Details (${selectedTransferType.toUpperCase()})

👤 Beneficiary: ${currentDetails.beneficiary}
🏛️ Bank Name: ${currentDetails.bankName}
${selectedTransferType === 'sepa' ? '💳 IBAN Number' : '🔢 Sort Code'}: ${currentDetails.ibanNumber}
🌐 SWIFT Code: ${currentDetails.swiftCode}
📋 Account Number: ${currentDetails.accountNumber}
📍 Address: ${currentDetails.address}
📝 Note: ${currentDetails.note}

⚠️ Important: Please include the note with your transfer to ensure proper processing.

Powered by DOKO E-Wallet`;

        try {
            const result = await Share.share({
                message: shareText,
                title: `DOKO Bank Transfer Details - ${selectedTransferType.toUpperCase()}`,
            });

            if (result.action === Share.sharedAction) {
                console.log('Bank details shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing bank details:', error);
            Alert.alert('Error', 'Failed to share bank details');
        }
    };

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <View style={styles.headerContent}>
                <TouchableOpacity
                    style={styles.backButton}
                    onPress={() => navigation?.goBack()}
                >
                    <Ionicons
                        name="arrow-back"
                        size={24}
                        color={theme.colors.text}
                    />
                </TouchableOpacity>

                <View style={styles.headerSpacer} />
            </View>
        </View>
    );

    const renderTransferTypeSelector = () => (
        <View style={styles.transferTypeContainer}>
            <TouchableOpacity
                style={[
                    styles.transferTypeButton,
                    {
                        backgroundColor: selectedTransferType === 'swift'
                            ? '#FFFFFF'
                            : theme.colors.surface,
                    }
                ]}
                onPress={() => setSelectedTransferType('swift')}
            >
                <Text style={[
                    styles.transferTypeText,
                    {
                        color: selectedTransferType === 'swift'
                            ? '#169BFF'
                            : theme.colors.text,
                    }
                ]}>
                    SWIFT
                </Text>
            </TouchableOpacity>

            <TouchableOpacity
                style={[
                    styles.transferTypeButton,
                    {
                        backgroundColor: selectedTransferType === 'sepa'
                            ? '#FFFFFF'
                            : theme.colors.surface,
                    }
                ]}
                onPress={() => setSelectedTransferType('sepa')}
            >
                <Text style={[
                    styles.transferTypeText,
                    {
                        color: selectedTransferType === 'sepa'
                            ? '#169BFF'
                            : theme.colors.text,
                    }
                ]}>
                    SEPA
                </Text>
            </TouchableOpacity>
        </View>
    );

    const renderBankDetails = () => {
        const currentDetails = bankDetails[selectedTransferType] || defaultBankDetails[selectedTransferType];

        if (isLoading) {
            return (
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color="#169BFF" />
                    <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                        Loading bank details...
                    </Text>
                </View>
            );
        }

        if (error) {
            return (
                <View style={styles.errorContainer}>
                    <Ionicons name="warning-outline" size={24} color="#FF6B6B" />
                    <Text style={[styles.errorText, { color: theme.colors.text }]}>
                        {error}
                    </Text>
                    <TouchableOpacity
                        style={styles.retryButton}
                        onPress={() => loadBankDetails(selectedTransferType)}
                    >
                        <Text style={styles.retryButtonText}>Retry</Text>
                    </TouchableOpacity>
                </View>
            );
        }

        const detailItems = [
            { label: 'Beneficiary', value: currentDetails?.beneficiary },
            { label: 'Bank Name', value: currentDetails?.bankName },
            { label: selectedTransferType === 'sepa' ? 'IBAN Number' : 'Sort Code', value: currentDetails?.ibanNumber },
            { label: 'SWIFT Code', value: currentDetails?.swiftCode },
            { label: 'Account Number', value: currentDetails?.accountNumber },
            { label: 'Address', value: currentDetails?.address },
            { label: 'Note', value: currentDetails?.note },
        ];

        return (
            <View style={[styles.detailsContainer,]}>
                {detailItems.map((item, index) => (
                    <View key={index} style={styles.detailItem}>
                        <View style={styles.detailContent}>
                            <Text style={[styles.detailLabel, { color: theme.colors.textSecondary }]}>
                                {item.label}
                            </Text>
                            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
                                {item.value}
                            </Text>
                        </View>
                        <TouchableOpacity
                            style={styles.copyButton}
                            onPress={() => copyToClipboard(item.value, item.label)}
                        >
                            <Ionicons
                                name="copy-outline"
                                size={16}
                                color="#169BFF"
                            />
                        </TouchableOpacity>
                    </View>
                ))}
            </View>
        );
    };

    const renderWarningMessage = () => (
        <View style={styles.warningContainer}>
            <Text style={styles.warningTitle}>Be Aware</Text>
            <Text style={styles.warningText}>
                Any transfer without adding the note of the "Users ID Number and Name" will possibly lose all their money.
            </Text>
        </View>
    );

    const renderShareButton = () => (
        <View style={styles.buttonContainer}>
            <TouchableOpacity style={styles.shareButton} onPress={handleShareDetails}>
                <LinearGradient
                    colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.5, y: 0.5 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.shareButtonText}>Share Bank Details</Text>
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}

            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                <View style={{ paddingHorizontal: 10 }}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: 35 }]}>
                        Regular Bank Transfer
                    </Text>
                </View>
                {renderTransferTypeSelector()}
                <View style={{ backgroundColor: theme.colors.surface, paddingHorizontal: 20, paddingVertical: 10, borderRadius: 15 }}>

                    {renderBankDetails()}
                    {renderWarningMessage()}
                </View>
            </ScrollView>
            {renderShareButton()}
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
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        flex: 1,
        // textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 100,
    },
    transferTypeContainer: {
        flexDirection: 'row',
        marginBottom: 20,
        marginTop: 20,
        gap: 8,
        // justifyContent: 'center',
    },
    transferTypeButton: {
        paddingVertical: 8,
        paddingHorizontal: 20,
        borderRadius: 20,
        alignItems: 'center',
        justifyContent: 'center',
        minWidth: 80,
        maxWidth: 120,
    },
    transferTypeText: {
        fontSize: 14,
        fontWeight: '600',
    },
    detailsContainer: {
        marginBottom: 30,
    },
    detailItem: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingVertical: 12,
        // borderBottomWidth: 1,
        // borderBottomColor: 'rgba(255, 255, 255, 0.1)',
    },
    detailContent: {
        flex: 1,
    },
    detailLabel: {
        fontSize: 14,
        fontWeight: '500',
        marginBottom: 4,
    },
    detailValue: {
        fontSize: 15,
        fontWeight: '600',
    },
    copyButton: {
        padding: 8,
        marginLeft: 12,
    },
    warningContainer: {
        backgroundColor: '#D80027',
        borderRadius: 12,
        padding: 20,
        marginBottom: 10,
    },
    warningTitle: {
        fontSize: 15,
        fontWeight: '700',
        color: '#FFFFFF',
        marginBottom: 4,
    },
    warningText: {
        fontSize: 12,
        color: '#FFFFFF',
        // lineHeight: 20,
    },
    buttonContainer: {
        position: 'absolute',
        bottom: 0,
        left: 0,
        right: 0,
        paddingHorizontal: 20,
        paddingBottom: 40,
        paddingTop: 20,
        // backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    shareButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    shareButtonText: {
        fontSize: 16,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    loadingContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 40,
    },
    loadingText: {
        fontSize: 16,
        marginTop: 12,
        textAlign: 'center',
    },
    errorContainer: {
        alignItems: 'center',
        justifyContent: 'center',
        paddingVertical: 20,
        paddingHorizontal: 20,
    },
    errorText: {
        fontSize: 14,
        marginTop: 8,
        marginBottom: 16,
        textAlign: 'center',
    },
    retryButton: {
        backgroundColor: '#169BFF',
        paddingHorizontal: 20,
        paddingVertical: 10,
        borderRadius: 8,
    },
    retryButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
    },
});

export default BankTransfer;
