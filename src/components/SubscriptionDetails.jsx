import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    Modal,
    Animated,
    PanResponder,
    Image,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store';
import { setSelectedPlan } from '../store/slices/subscriptionSlice';
import StripePaymentModal from './StripePaymentModal';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const SubscriptionDetails = ({ navigation, route }) => {
    const { theme, isDarkMode } = useTheme();
    const dispatch = useAppDispatch();
    const { selectedPlan } = useAppSelector((state) => state.subscription);
    const [isModalVisible, setIsModalVisible] = useState(false);
    const [isStripeModalVisible, setIsStripeModalVisible] = useState(false);
    const [modalAnimation] = useState(new Animated.Value(0));

    // Get plan from route params or Redux state
    const planData = route?.params?.plan || selectedPlan;

    // Update Redux state when plan data changes
    useEffect(() => {
        if (route?.params?.plan) {
            dispatch(setSelectedPlan(route.params.plan));
        }
    }, [route?.params?.plan, dispatch]);

    const openModal = () => {
        setIsModalVisible(true);
        Animated.timing(modalAnimation, {
            toValue: 1,
            duration: 300,
            useNativeDriver: true,
        }).start();
    };

    const closeModal = () => {
        Animated.timing(modalAnimation, {
            toValue: 0,
            duration: 300,
            useNativeDriver: true,
        }).start(() => {
            setIsModalVisible(false);
        });
    };

    const handlePayWithPickup = () => {
        closeModal();
        // Handle payment with pickup logic
        console.log('Pay with pickup or card pressed');
    };

    const handlePayWithCard = () => {
        closeModal();
        setIsStripeModalVisible(true);
    };

    const handlePaymentSuccess = (subscriptionData) => {
        console.log('Payment successful:', subscriptionData);
        Toast.show({
            type: 'success',
            text1: 'Subscription Activated',
            text2: 'Your subscription has been successfully activated!',
            position: 'top',
            visibilityTime: 4000,
        });

        // Navigate back or to a success screen
        if (navigation) {
            navigation.goBack();
        }
    };



    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
            <StatusBar
                barStyle={theme.isDarkMode ? 'light-content' : 'dark-content'}
                backgroundColor={theme.colors.background}
            />
            <View style={styles.headerContent}>
                <TouchableOpacity
                    style={styles.laterButton}
                    onPress={() => navigation?.goBack()}
                >
                    <Text style={[styles.laterText, { color: theme.colors.textSecondary }]}>Later</Text>
                </TouchableOpacity>


            </View>
        </View>
    );


    const renderPlanCard = () => {
        if (!planData) {
            return (
                <View style={[styles.planCard, {
                    backgroundColor: theme.colors.surface,
                    shadowColor: theme.colors.shadow,
                    shadowOffset: {
                        width: 0,
                        height: 2,
                    },
                    shadowOpacity: 0.1,
                    shadowRadius: 8,
                    elevation: 4,
                }]}>
                    <Text style={[styles.planTitle, { color: theme.colors.text }]}>No plan selected</Text>
                </View>
            );
        }

        return (
            <View style={[styles.planCard, {
                backgroundColor: theme.colors.surface,
                shadowColor: theme.colors.shadow,
                shadowOffset: {
                    width: 0,
                    height: 2,
                },
                shadowOpacity: 0.1,
                shadowRadius: 8,
                elevation: 4,
            }]}>
                <View style={styles.planHeader}>
                    <Text style={[styles.planTitle, { color: theme.colors.text }]}>{planData.name}</Text>
                    {planData.isPopular && (
                        <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>Most Popular</Text>
                        </View>
                    )}
                </View>

                <Text style={[styles.planPricing, { color: theme.colors.text }]}>
                    {planData.formattedPrice} / {planData.durationText}
                </Text>
                <Text style={[styles.planTagline, { color: theme.colors.textSecondary }]}>
                    {planData.description}
                </Text>

                <View style={styles.featuresSection}>
                    <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>Features for you</Text>

                    {planData.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <View style={styles.featureIcon}>
                                <Ionicons name="checkmark-circle" size={20} color="#4CAF50" />
                            </View>
                            <Text style={[styles.featureText, { color: theme.colors.text }]}>
                                {feature}
                            </Text>
                        </View>
                    ))}
                </View>
            </View>
        );
    };

    const renderBottomSheet = () => (
        <Modal
            visible={isModalVisible}
            transparent={true}
            animationType="none"
            onRequestClose={closeModal}
        >
            <View style={styles.modalOverlay}>
                <TouchableOpacity
                    style={styles.modalBackdrop}
                    activeOpacity={1}
                    onPress={closeModal}
                />
                <Animated.View
                    style={[
                        styles.bottomSheet,
                        {
                            backgroundColor: theme.colors.surface,
                            transform: [{
                                translateY: modalAnimation.interpolate({
                                    inputRange: [0, 1],
                                    outputRange: [height, 0],
                                })
                            }]
                        }
                    ]}
                >
                    {/* Drag Handle */}
                    <View style={styles.dragHandle} />

                    {/* Close Icon */}
                    <View style={styles.closeIconContainer}>
                        <Image source={require('../assets/Images/Cross.png')} style={{ width: 60, height: 60, resizeMode: 'contain' }} />
                        {/* <View style={[styles.closeIcon, { backgroundColor: '#FF3B30' }]}>
                             <Ionicons name="close" size={24} color="#FFFFFF" />
                         </View> */}
                    </View>

                    {/* Title */}
                    <Text style={[styles.modalTitle, { color: theme.colors.text }]}>
                        Add Money To Your Account
                    </Text>

                    {/* Description */}
                    <Text style={[styles.modalDescription, { color: theme.colors.textSecondary }]}>
                        You need to deposit money to your account to subscribe :)
                    </Text>

                    {/* Action Buttons */}
                    <TouchableOpacity
                        style={styles.modalActionButton}
                        onPress={handlePayWithPickup}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.modalActionText, { color: '#169BFF' }]}>
                            Pay With Pickup
                        </Text>
                    </TouchableOpacity>

                    <TouchableOpacity
                        style={[styles.modalActionButton, { marginTop: 12 }]}
                        onPress={handlePayWithCard}
                        activeOpacity={0.7}
                    >
                        <Text style={[styles.modalActionText, { color: '#169BFF' }]}>
                            Pay With Card
                        </Text>
                    </TouchableOpacity>
                </Animated.View>
            </View>
        </Modal>
    );

    const renderFooter = () => (
        <View style={styles.footer}>
            {/* <TouchableOpacity style={styles.trialButton} onPress={openModal}> */}
            <TouchableOpacity style={styles.trialButton} onPress={handlePayWithCard}>
                <LinearGradient
                    colors={['#1AA5FF', '#6B22E7']}
                    start={{ x: 0, y: 0 }}
                    end={{ x: 1, y: 0 }}
                    style={styles.gradientButton}
                >
                    <Text style={[styles.trialButtonText, { color: "#fff" }]}>
                        Pay {planData?.formattedPrice || '$0.00'}/Month and Open Account
                    </Text>
                </LinearGradient>
            </TouchableOpacity>

            {/* <View style={styles.linksContainer}>
                 <TouchableOpacity
                     onPress={handlePayWithCard}
                     style={{ flexDirection: 'row', justifyContent: 'center', alignItems: 'center', paddingTop: 20,paddingBottom:15 }}
                     activeOpacity={0.7}
                 >
                     <Text style={[styles.trialButtonText, { color: "#169BFF" }]}>Pay With Card</Text>
                 </TouchableOpacity>
             </View> */}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, paddingBottom: 18 }]}>Subscribe Now</Text>

                    {renderPlanCard()}
                </View>
                <View style={styles.content}>
                    <View style={[styles.paymentCard, {
                        backgroundColor: theme.colors.surface,
                        borderRadius: theme.borderRadius.lg,
                        padding: theme.spacing.lg,
                        marginBottom: theme.spacing.xl,
                        shadowColor: theme.colors.shadow,
                        shadowOffset: {
                            width: 0,
                            height: 2,
                        },
                        shadowOpacity: 0.1,
                        shadowRadius: 8,
                        elevation: 4,
                    }]}>
                        <View style={styles.paymentHeader}>
                            <Ionicons
                                name="cart-outline"
                                size={20}
                                color={theme.colors.text}
                                style={styles.cartIcon}
                            />
                            <Text style={[styles.paymentTitle, { color: theme.colors.text }]}>Issuance Fee</Text>
                        </View>

                        <View style={styles.paymentItem}>
                            <Text style={[styles.paymentItemText, { color: theme.colors.text }]}>
                                {planData?.name || 'Plan'} Subscription
                            </Text>
                            <Text style={[styles.paymentItemAmount, { color: theme.colors.text }]}>
                                {planData?.formattedPrice || '$0.00'}
                            </Text>
                        </View>

                        <View style={styles.paymentItem}>
                            <Text style={[styles.paymentItemText, { color: theme.colors.text }]}>Opening Account Deposit</Text>
                            <Text style={[styles.paymentItemAmount, { color: theme.colors.text }]}>30.00$</Text>
                        </View>

                        <View style={[styles.divider, { backgroundColor: theme.colors.border }]} />

                        <View style={styles.totalPayment}>
                            <Text style={[styles.totalText, { color: theme.colors.text }]}>Total Payment</Text>
                            <Text style={[styles.totalAmount, { color: theme.colors.text }]}>
                                ${(planData?.price || 0 + 30).toFixed(2)}
                            </Text>
                        </View>
                    </View>
                </View>
                {renderFooter()}
            </ScrollView>
            {renderBottomSheet()}
            <StripePaymentModal
                visible={isStripeModalVisible}
                onClose={() => setIsStripeModalVisible(false)}
                planData={planData}
                onPaymentSuccess={handlePaymentSuccess}
            />
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
    paymentCard: {
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
        elevation: 4,
    },
    paymentHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 20,
    },
    cartIcon: {
        marginRight: 12,
    },
    paymentTitle: {
        fontSize: 16,
        fontWeight: '600',
    },
    paymentItem: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        marginBottom: 5,
        paddingVertical: 4,
    },
    paymentItemText: {
        fontSize: 15,
        fontWeight: '500',
        flex: 1,
    },
    paymentItemAmount: {
        fontSize: 16,
        fontWeight: '500',
        textAlign: 'right',
    },
    divider: {
        height: 1,
        marginVertical: 12,
    },
    totalPayment: {
        flexDirection: 'row',
        justifyContent: 'space-between',
        alignItems: 'center',
        // paddingVertical: 8,
    },
    totalText: {
        fontSize: 16,
        fontWeight: '600',
    },
    totalAmount: {
        fontSize: 16,
        fontWeight: '600',
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    laterButton: {
        // padding: 8,
    },
    laterText: {
        fontSize: 16,
        fontWeight: '500',
    },
    headerTitle: {
        fontSize: 32,
        fontWeight: '700',
        flex: 1,
    },
    headerSpacer: {
        width: 60, // Same width as Later button for centering
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        // paddingVertical: 20,
    },
    tabsContainer: {
        flexDirection: 'row',
        marginBottom: 24,
        gap: 8,
    },
    tab: {
        flex: 1,
        paddingVertical: 9,
        paddingHorizontal: 16,
        borderRadius: 20,
        alignItems: 'center',
    },
    tabText: {
        fontSize: 16,
        fontWeight: '600',
    },
    planCard: {
        borderRadius: 16,
        padding: 24,
        marginBottom: 20,
    },
    planHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 8,
    },
    planTitle: {
        fontSize: 28,
        fontWeight: '700',
        flex: 1,
    },
    popularBadge: {
        backgroundColor: '#FF6B6B',
        paddingHorizontal: 12,
        paddingVertical: 4,
        borderRadius: 12,
        marginLeft: 12,
    },
    popularText: {
        color: '#FFFFFF',
        fontSize: 12,
        fontWeight: '600',
    },
    planPricing: {
        fontSize: 18,
        fontWeight: '600',
        marginBottom: 8,
    },
    planTagline: {
        fontSize: 16,
        marginBottom: 24,
    },
    featuresSection: {
        // marginBottom: 24,
    },

    featuresTitle: {
        fontSize: 20,
        fontWeight: '700',
        marginBottom: 16,
    },

    featureItem: {
        flexDirection: 'row',
        alignItems: 'center',
        marginBottom: 12,
    },
    featureIcon: {
        marginRight: 12,
    },
    featureText: {
        fontSize: 16,
        flex: 1,
        lineHeight: 22,
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '600',
        marginBottom: 4,
    },
    featureDescription: {
        fontSize: 14,
        lineHeight: 20,
    },
    trialButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    gradientButton: {
        paddingVertical: 16,
        alignItems: 'center',
        justifyContent: 'center',
    },
    trialButtonText: {
        fontSize: 14,
        fontWeight: '700',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
    },
    footerText: {
        fontSize: 12,
        lineHeight: 16,
    },
    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center'
    },
    linkText: {
        fontSize: 12,
        fontWeight: '500',
    },
    // Bottom Sheet Modal Styles
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'flex-end',
    },
    modalBackdrop: {
        flex: 1,
    },
    bottomSheet: {
        borderTopLeftRadius: 24,
        borderTopRightRadius: 24,
        borderBottomLeftRadius: 24,
        borderBottomRightRadius: 24,
        paddingTop: 12,
        //  paddingBottom: 40,
        paddingHorizontal: 20,
        alignItems: 'center',
        minHeight: 280,
        marginHorizontal: 16,
        marginBottom: 40,
    },
    dragHandle: {
        width: 40,
        height: 4,
        backgroundColor: 'rgba(255, 255, 255, 0.3)',
        borderRadius: 2,
        marginBottom: 20,
    },
    closeIconContainer: {
        marginBottom: 24,
    },
    closeIcon: {
        width: 60,
        height: 60,
        borderRadius: 30,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalTitle: {
        fontSize: 20,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 16,
    },
    modalDescription: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 22,
        marginBottom: 15,
        paddingHorizontal: 8,
    },
    modalActionButton: {
        paddingVertical: 16,
        paddingHorizontal: 32,
        alignItems: 'center',
        justifyContent: 'center',
    },
    modalActionText: {
        fontSize: 16,
        fontWeight: '600',
    },
});

export default SubscriptionDetails;
