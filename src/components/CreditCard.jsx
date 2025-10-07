import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    TextInput,
    Image,
    KeyboardAvoidingView,
    Platform,
    Alert,
    ActivityIndicator,
    Modal,
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
import { useStripe, useConfirmPayment, CardField } from '@stripe/stripe-react-native';
import { authService } from '../services/apiService';
import AsyncStorage from '@react-native-async-storage/async-storage';
import Toast from 'react-native-toast-message';
const { width, height } = Dimensions.get('window');

const CreditCard = ({ navigation, amount = "$100.00" }) => {
    const { theme, isDarkMode } = useTheme();
    const { confirmPayment } = useConfirmPayment();
    const { createPaymentMethod } = useStripe();
    const [selectedCurrency, setSelectedCurrency] = useState('NPR');
    const [paymentAmount, setPaymentAmount] = useState('100.00');
    const [isLoading, setIsLoading] = useState(false);
    const [cardDetails, setCardDetails] = useState(null);
    const [showCurrencyPicker, setShowCurrencyPicker] = useState(false);
    const [amountFontSize, setAmountFontSize] = useState(48);

    const currencies = [
        { code: 'NPR', symbol: '₨', name: 'Nepalese Rupee', flag: require('../assets/Images/USA.png') }, // TODO: Add Nepal.png flag
        { code: 'USD', symbol: '$', name: 'US Dollar', flag: require('../assets/Images/USA.png') }
    ];

    const currentCurrency = currencies.find(currency => currency.code === selectedCurrency);

    const handleCurrencySelect = (currencyCode) => {
        setSelectedCurrency(currencyCode);
        setShowCurrencyPicker(false);
    };

    const handleAmountChange = (text) => {
        // Allow only numbers and one decimal point
        const cleaned = text.replace(/[^0-9.]/g, '');
        // Ensure only one decimal point
        const parts = cleaned.split('.');
        if (parts.length <= 2) {
            // Limit to 2 decimal places
            if (parts[1] && parts[1].length > 2) {
                setPaymentAmount(parts[0] + '.' + parts[1].substring(0, 2));
            } else {
                setPaymentAmount(cleaned);
            }
        }

        // Adjust font size based on length to avoid UI breaking
        const len = cleaned.length;
        if (len > 12) setAmountFontSize(26);
        else if (len > 10) setAmountFontSize(30);
        else if (len > 8) setAmountFontSize(34);
        else if (len > 6) setAmountFontSize(40);
        else setAmountFontSize(48);
    };

    const handlePayNow = async () => {
        if (!paymentAmount || parseFloat(paymentAmount) <= 0) {
            Alert.alert('Error', 'Please enter a valid amount');
            return;
        }

        if (!cardDetails?.complete) {
            Alert.alert('Error', 'Please enter complete card details');
            return;
        }

        setIsLoading(true);

        // Test toast to verify Toast is working
        Toast.show({
            type: 'info',
            text1: 'Processing Payment',
            text2: 'Please wait...',
            position: 'top',
            visibilityTime: 2000,
        });

        try {
            // Get user token
            const token = await AsyncStorage.getItem('dokoToken');
            if (!token) {
                Alert.alert('Error', 'User not authenticated');
                setIsLoading(false);
                return;
            }

            // Convert amount to cents (multiply by 100 for Stripe)
            const amountInCents = Math.round(parseFloat(paymentAmount));

            // Call deposit initiation API
            const result = await authService.initiateDeposit(
                amountInCents,
                "Wallet top-up",
                selectedCurrency,
                token
            );

            if (result.success && result.data?.stripePaymentDetails?.client_secret) {
                const { client_secret } = result.data.stripePaymentDetails;
                console.log("Payment Intent Client Secret:", client_secret);

                // Create payment method first
                const { error: paymentMethodError, paymentMethod } = await createPaymentMethod({
                    paymentMethodType: 'Card',
                    billingDetails: {
                        name: 'Customer',
                        email: 'customer@example.com',
                    },
                });

                if (paymentMethodError) {
                    console.error('Payment method creation failed:', paymentMethodError);
                    Toast.show({
                        type: 'error',
                        text1: 'Payment Failed',
                        text2: paymentMethodError.message,
                        position: 'top',
                        visibilityTime: 4000,
                    });
                    return;
                }

                // Confirm payment with Stripe using the payment method
                const { error, paymentIntent } = await confirmPayment(
                    client_secret,
                    {
                        paymentMethodType: 'Card',
                        paymentMethodData: {
                            billingDetails: {
                                name: 'Customer',
                                email: 'customer@example.com',
                            },
                        },
                    }
                );

                if (error) {
                    console.error('Payment failed:', error);
                    Toast.show({
                        type: 'error',
                        text1: 'Payment Failed',
                        text2: error.message,
                        position: 'top',
                        visibilityTime: 4000,
                    });
                } else if (paymentIntent) {
                    console.log('credit_card_14411', paymentIntent);

                    // Call verify deposit API after successful payment
                    try {
                        const verifyResult = await authService.verifyDeposit(
                            paymentIntent.id,
                            token
                        );

                        if (verifyResult.success) {
                            console.log('Deposit verification successful:', verifyResult.data);
                            console.log('Showing success toast...');

                            // Small delay to ensure UI is ready
                            setTimeout(() => {
                                Toast.show({
                                    type: 'success',
                                    text1: 'Deposit Successful',
                                    text2: `Successfully added ${selectedCurrency} ${paymentAmount} to your wallet`,
                                    position: 'top',
                                    visibilityTime: 4000,
                                });
                                console.log('Toast.show called for success');
                            }, 100);
                        } else {
                            console.error('Deposit verification failed:', verifyResult.error);
                            Toast.show({
                                type: 'error',
                                text1: 'Verification Failed',
                                text2: verifyResult.error || 'Failed to verify deposit',
                                position: 'top',
                                visibilityTime: 4000,
                            });
                        }
                    } catch (verifyError) {
                        console.error('Deposit verification error:', verifyError);
                        Toast.show({
                            type: 'error',
                            text1: 'Verification Error',
                            text2: 'An error occurred while verifying deposit',
                            position: 'top',
                            visibilityTime: 4000,
                        });
                    }

                    // Navigate back or to success screen
                    if (navigation) {
                        navigation.goBack();
                    }
                }
            } else {
                Alert.alert('Error', result.error || 'Failed to initiate payment');
            }
        } catch (error) {
            console.error('Payment error:', error);
            Toast.show({
                type: 'error',
                text1: 'Payment Error',
                text2: 'An unexpected error occurred during payment',
                position: 'top',
                visibilityTime: 4000,
            });
        } finally {
            setIsLoading(false);
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

    const renderAmountSection = () => (
        <View style={styles.amountSection}>
            <View style={[styles.amountInputContainer, {}]}>
                <Text style={[styles.dollarSign, { color: theme.colors.text, fontSize: 30 }]}>
                    {currentCurrency?.symbol || '₨'}
                </Text>
                <TextInput
                    style={[styles.amountInput, { color: theme.colors.text, fontSize: amountFontSize }]}
                    value={paymentAmount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="100.0"
                    placeholderTextColor={theme.colors.text}
                    maxLength={6}
                />
            </View>
            <TouchableOpacity
                style={[styles.currencySelector, { backgroundColor: theme.colors.surface }]}
                onPress={() => setShowCurrencyPicker(true)}
            >
                <Image
                    source={currentCurrency?.flag || require('../assets/Images/USA.png')}
                    style={styles.flagIcon}
                />
                <Text style={[styles.currencyText, { color: theme.colors.text }]}>
                    {selectedCurrency}
                </Text>
                <Ionicons
                    name="chevron-down"
                    size={16}
                    color={theme.colors.textSecondary}
                />
            </TouchableOpacity>
        </View>
    );

    const renderCardInputs = () => (
        <View style={styles.inputsSection}>
            <View style={[styles.inputContainer, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.cardInputLabel, { color: theme.colors.text }]}>
                    Card Details
                </Text>
                <CardField
                    postalCodeEnabled={false}
                    placeholders={{
                        number: '4242 4242 4242 4242',
                    }}
                    cardStyle={{
                        backgroundColor: theme.colors.surface,
                        textColor: theme.colors.text,
                        borderColor: theme.colors.border || 'rgba(255, 255, 255, 0.1)',
                        borderWidth: 1,
                        borderRadius: 8,
                        fontSize: 16,
                        placeholderColor: theme.colors.textSecondary,
                    }}
                    style={styles.cardField}
                    onCardChange={(cardDetails) => {
                        setCardDetails(cardDetails);
                    }}
                />
            </View>
        </View>
    );

    const renderCurrencyPicker = () => (
        <Modal
            visible={showCurrencyPicker}
            transparent={true}
            animationType="slide"
            onRequestClose={() => setShowCurrencyPicker(false)}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.backdrop}
                    activeOpacity={1}
                    onPress={() => setShowCurrencyPicker(false)}
                />
                <View style={[styles.currencyPickerContainer, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.currencyPickerTitle, { color: theme.colors.text }]}>
                        Select Currency
                    </Text>
                    {currencies.map((currency) => (
                        <TouchableOpacity
                            key={currency.code}
                            style={[
                                styles.currencyOption,
                                {
                                    backgroundColor: selectedCurrency === currency.code
                                        ? theme.colors.primary || '#1AA5FF'
                                        : 'transparent',
                                    borderColor: theme.colors.border || 'rgba(255, 255, 255, 0.1)'
                                }
                            ]}
                            onPress={() => handleCurrencySelect(currency.code)}
                        >
                            <Image source={currency.flag} style={styles.flagIcon} />
                            <View style={styles.currencyInfo}>
                                <Text style={[styles.currencyCode, { color: theme.colors.text }]}>
                                    {currency.code}
                                </Text>
                                <Text style={[styles.currencyName, { color: theme.colors.textSecondary }]}>
                                    {currency.name}
                                </Text>
                            </View>
                            {selectedCurrency === currency.code && (
                                <Ionicons name="checkmark" size={20} color="#FFFFFF" />
                            )}
                        </TouchableOpacity>
                    ))}
                </View>
            </View>
        </Modal>
    );

    const renderPayButton = () => (
        <View style={styles.buttonSection}>
            <TouchableOpacity
                style={[
                    styles.payButton,
                    {
                        opacity: (isLoading || !cardDetails?.complete) ? 0.6 : 1
                    }
                ]}
                onPress={handlePayNow}
                disabled={isLoading || !cardDetails?.complete}
            >
                <LinearGradient
                    colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.5, y: 0.5 }}
                    style={styles.gradientButton}
                >
                    {isLoading ? (
                        <ActivityIndicator color="#FFFFFF" size="small" />
                    ) : (
                        <Text style={styles.payButtonText}>Pay Now</Text>
                    )}
                </LinearGradient>
            </TouchableOpacity>
        </View>
    );

    return (
        <KeyboardAvoidingView
            style={[styles.container, { backgroundColor: theme.colors.background }]}
            behavior={Platform.OS === 'ios' ? 'padding' : 'height'}
        >
            {renderHeader()}
            <View style={{ paddingHorizontal: 25 }}>

                <Text style={[styles.headerTitle, { color: theme.colors.text, fontSize: theme.typography.sizes.xxl }]}>
                    Credit/Debit Card
                </Text>
            </View>
            <ScrollView
                style={styles.scrollView}
                showsVerticalScrollIndicator={false}
                contentContainerStyle={styles.scrollContent}
            >
                {renderAmountSection()}
                {renderCardInputs()}
                {renderPayButton()}
            </ScrollView>
            {renderCurrencyPicker()}
        </KeyboardAvoidingView>
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
        paddingBottom: 15
        // flex: 1,
        // textAlign: 'center',
    },
    headerSpacer: {
        width: 40,
    },
    scrollView: {
        flex: 1,
        paddingTop: 25
    },
    scrollContent: {
        paddingHorizontal: 20,
        paddingBottom: 40,
    },
    amountSection: {
        alignItems: 'center',
        marginBottom: 40,
        marginTop: 20,
    },
    amountInputContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        // paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        // borderWidth: 1,
        // borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
        minWidth: 200,
        maxWidth: width - 40,
    },
    dollarSign: {
        fontSize: 48,
        fontWeight: '700',
        // marginRight: 8,
    },
    amountInput: {
        fontSize: 48,
        fontWeight: '700',
        textAlign: 'center',
        flex: 1,
        minWidth: 100,
    },
    currencySelector: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 16,
        paddingVertical: 12,
        borderRadius: 12,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    flagIcon: {
        width: 20,
        height: 15,
        marginRight: 8,
        borderRadius: 2,
    },
    currencyText: {
        fontSize: 16,
        fontWeight: '600',
        marginRight: 8,
    },
    inputsSection: {
        marginBottom: 40,
    },
    inputContainer: {
        borderRadius: 12,
        paddingHorizontal: 16,
        paddingVertical: 16,
        marginBottom: 16,
        borderWidth: 1,
        borderColor: 'rgba(255, 255, 255, 0.1)',
    },
    textInput: {
        fontSize: 16,
        fontWeight: '500',
    },
    buttonSection: {
        marginTop: 20,
    },
    payButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 14,
        alignItems: 'center',
        justifyContent: 'center',
    },
    payButtonText: {
        fontSize: 18,
        fontWeight: '700',
        color: '#FFFFFF',
    },
    cardInputLabel: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 8,
    },
    cardField: {
        width: '100%',
        height: 50,
    },
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
    },
    backdrop: {
        position: 'absolute',
        top: 0,
        left: 0,
        right: 0,
        bottom: 0,
    },
    currencyPickerContainer: {
        width: width * 0.8,
        maxWidth: 350,
        borderRadius: 16,
        padding: 20,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    currencyPickerTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 20,
    },
    currencyOption: {
        flexDirection: 'row',
        alignItems: 'center',
        padding: 16,
        borderRadius: 12,
        borderWidth: 1,
        marginBottom: 8,
    },
    currencyInfo: {
        flex: 1,
        marginLeft: 12,
    },
    currencyCode: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 2,
    },
    currencyName: {
        fontSize: 14,
        fontWeight: '400',
    },
});

export default CreditCard;
