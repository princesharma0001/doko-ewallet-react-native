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
} from 'react-native';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useTheme } from '../context/ThemeContext';
const { width, height } = Dimensions.get('window');

const CreditCard = ({ navigation, amount = "$100.00" }) => {
    const { theme, isDarkMode } = useTheme();
    const [cardNumber, setCardNumber] = useState('');
    const [expiryDate, setExpiryDate] = useState('');
    const [cvv, setCvv] = useState('');
    const [selectedCurrency, setSelectedCurrency] = useState('USD');
    const [paymentAmount, setPaymentAmount] = useState('100.00');

    const formatCardNumber = (text) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add spaces every 4 digits
        const formatted = cleaned.replace(/(\d{4})(?=\d)/g, '$1 ');
        return formatted;
    };

    const formatExpiryDate = (text) => {
        // Remove all non-digits
        const cleaned = text.replace(/\D/g, '');
        // Add slash after 2 digits
        if (cleaned.length >= 2) {
            return cleaned.substring(0, 2) + '/' + cleaned.substring(2, 4);
        }
        return cleaned;
    };

    const handleCardNumberChange = (text) => {
        const formatted = formatCardNumber(text);
        if (formatted.length <= 19) { // 16 digits + 3 spaces
            setCardNumber(formatted);
        }
    };

    const handleExpiryChange = (text) => {
        const formatted = formatExpiryDate(text);
        if (formatted.length <= 5) { // MM/YY format
            setExpiryDate(formatted);
        }
    };

    const handleCvvChange = (text) => {
        const cleaned = text.replace(/\D/g, '');
        if (cleaned.length <= 3) {
            setCvv(cleaned);
        }
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
    };

    const handlePayNow = () => {
        // Handle payment logic
        console.log('Payment details:', {
            cardNumber,
            expiryDate,
            cvv,
            amount: `$${paymentAmount}`,
            currency: selectedCurrency
        });
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
                <Text style={[styles.dollarSign, { color: theme.colors.text }]}>$</Text>
                <TextInput
                    style={[styles.amountInput, { color: theme.colors.text }]}
                    value={paymentAmount}
                    onChangeText={handleAmountChange}
                    keyboardType="numeric"
                    placeholder="10.0"
                    placeholderTextColor={theme.colors.text}
                    maxLength={10}
                />
            </View>
            <TouchableOpacity style={[styles.currencySelector, { backgroundColor: theme.colors.surface }]}>
                <Image
                    source={require('../assets/Images/USA.png')}
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
                <TextInput
                    style={[styles.textInput, { color: theme.colors.text }]}
                    placeholder="Enter card number"
                    placeholderTextColor={theme.colors.textSecondary}
                    value={cardNumber}
                    onChangeText={handleCardNumberChange}
                    keyboardType="numeric"
                    maxLength={19}
                />
            </View>

            <View style={styles.rowInputs}>
                <View style={[styles.inputContainer, styles.halfInput, { backgroundColor: theme.colors.surface }]}>
                    <TextInput
                        style={[styles.textInput, { color: theme.colors.text }]}
                        placeholder="MM/YY"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={expiryDate}
                        onChangeText={handleExpiryChange}
                        keyboardType="numeric"
                        maxLength={5}
                    />
                </View>

                <View style={[styles.inputContainer, styles.halfInput, { backgroundColor: theme.colors.surface }]}>
                    <TextInput
                        style={[styles.textInput, { color: theme.colors.text }]}
                        placeholder="CVV"
                        placeholderTextColor={theme.colors.textSecondary}
                        value={cvv}
                        onChangeText={handleCvvChange}
                        keyboardType="numeric"
                        maxLength={3}
                        secureTextEntry
                    />
                </View>
            </View>
        </View>
    );

    const renderPayButton = () => (
        <View style={styles.buttonSection}>
            <TouchableOpacity style={styles.payButton} onPress={handlePayNow}>
                <LinearGradient
                    colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1.5, y: 0.5 }}
                    style={styles.gradientButton}
                >
                    <Text style={styles.payButtonText}>Pay Now</Text>
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
        paddingHorizontal: 20,
        paddingVertical: 16,
        borderRadius: 12,
        // borderWidth: 1,
        // borderColor: 'rgba(255, 255, 255, 0.1)',
        marginBottom: 16,
        minWidth: 200,
    },
    dollarSign: {
        fontSize: 48,
        fontWeight: '700',
        marginRight: 8,
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
    halfInput: {
        flex: 1,
        marginHorizontal: 4,
    },
    rowInputs: {
        flexDirection: 'row',
        justifyContent: 'space-between',
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
});

export default CreditCard;
