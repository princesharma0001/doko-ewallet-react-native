import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { useAppSelector, useAppDispatch } from '../store';
import { getPlans, setSelectedPlan } from '../store/slices/subscriptionSlice';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const Subscription = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { plans, selectedPlan, isLoading, error } = useAppSelector((state) => state.subscription);

    // Fetch plans on component mount
    useEffect(() => {
        dispatch(getPlans());
    }, [dispatch]);

    // Handle error display
    useEffect(() => {
        if (error) {
            Toast.show({
                type: 'error',
                text1: 'Error',
                text2: error,
                position: 'top',
                visibilityTime: 4000,
            });
        }
    }, [error]);

    const handlePlanSelect = (plan) => {
        dispatch(setSelectedPlan(plan));
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

    const renderPlanTabs = () => (
        <View style={styles.tabsContainer}>
            {plans.map((plan) => (
                <TouchableOpacity
                    key={plan.id}
                    style={[
                        styles.tab,
                        {
                            backgroundColor: selectedPlan?.id === plan.id ? '#FFFFFF' : theme.colors.surface,
                        },
                    ]}
                    onPress={() => handlePlanSelect(plan)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            {
                                color: selectedPlan?.id === plan.id ? '#1AA5FF' : theme.colors.text,
                            },
                        ]}
                    >
                        {plan.name}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderPlanCard = () => {
        if (!selectedPlan) {
            return (
                <View style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.planTitle, { color: theme.colors.text }]}>No plan selected</Text>
                </View>
            );
        }

        return (
            <View style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
                <View style={styles.planHeader}>
                    <Text style={[styles.planTitle, { color: theme.colors.text }]}>{selectedPlan.name}</Text>
                    {selectedPlan.isPopular && (
                        <View style={styles.popularBadge}>
                            <Text style={styles.popularText}>Most Popular</Text>
                        </View>
                    )}
                </View>
                
                <Text style={[styles.planPricing, { color: theme.colors.text }]}>
                    {selectedPlan.formattedPrice} / {selectedPlan.durationText}
                </Text>
                <Text style={[styles.planTagline, { color: theme.colors.textSecondary }]}>
                    {selectedPlan.description}
                </Text>

                <View style={styles.featuresSection}>
                    <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>Features for you</Text>

                    {selectedPlan.features.map((feature, index) => (
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

                <TouchableOpacity 
                    style={styles.trialButton} 
                    onPress={() => navigation.navigate("SubscriptionDetails", { plan: selectedPlan })}
                >
                    <LinearGradient
                        colors={['#1AA5FF', '#6B22E7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={[styles.trialButtonText, { color: "#fff" }]}>
                            Choose {selectedPlan.name} Plan
                        </Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        );
    };

    const renderFooter = () => (
        <View style={styles.footer}>
            <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>
                This is a 12 month plan. By proceeding, you agree to the{' '}
            </Text>
            <View style={styles.linksContainer}>
                <TouchableOpacity>
                    <Text style={[styles.linkText, { color: theme.colors.primary }]}>Promotion Terms</Text>
                </TouchableOpacity>
                <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>, </Text>
                <TouchableOpacity>
                    <Text style={[styles.linkText, { color: theme.colors.primary }]}>Plan Terms</Text>
                </TouchableOpacity>
                <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}> and </Text>
                <TouchableOpacity>
                    <Text style={[styles.linkText, { color: theme.colors.primary }]}>Insurance Documents</Text>
                </TouchableOpacity>
                <Text style={[styles.footerText, { color: theme.colors.textSecondary }]}>.</Text>
            </View>
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {renderHeader()}
                <View style={styles.loadingContainer}>
                    <ActivityIndicator size="large" color={theme.colors.primary} />
                    <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                        Loading subscription plans...
                    </Text>
                </View>
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    <Text style={[styles.headerTitle, { color: theme.colors.text, paddingBottom: 18 }]}>Select Plan</Text>

                    {renderPlanTabs()}
                    {renderPlanCard()}
                </View>
                {renderFooter()}
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
        justifyContent: 'flex-end',
        paddingHorizontal: 20,
    },
    laterButton: {
        padding: 8,
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
        marginBottom: 24,
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
    loadingContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    loadingText: {
        marginTop: 16,
        fontSize: 16,
        textAlign: 'center',
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
        fontSize: 16,
        fontWeight: '700',
    },
    footer: {
        paddingHorizontal: 20,
        paddingBottom: 20,
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
        justifyContent: 'center',
        gap: 4,
    },
    footerText: {
        fontSize: 12,
        lineHeight: 16,
    },
    linksContainer: {
        flexDirection: 'row',
        flexWrap: 'wrap',
        alignItems: 'center',
    },
    linkText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default Subscription;
