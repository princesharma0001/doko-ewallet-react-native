import React, { useState } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    ScrollView,
    StatusBar,
    Dimensions,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const Subscription = ({ navigation }) => {
    const { theme } = useTheme();
    const [selectedPlan, setSelectedPlan] = useState('Standard');

    const planData = {
        Standard: {
            title: 'Standard',
            pricing: '1 month on us, then $4.99/mo',
            tagline: 'Best for digital day to day consumption',
            features: [
                {
                    title: 'Personalized Virtual Card',
                    description: 'Get coverage for up to $1,000 on stolen or damaged purchases, within a year of purchase'
                },
                {
                    title: 'Canceled event protection',
                    description: 'Get refunded for tickets to events you can\'t make it to, up to $1,000 per year'
                },
                {
                    title: 'Refund protection',
                    description: 'Get refund protection of up to $300 on eligible purchases, within 90 days of purchase'
                }
            ],
            buttonText: 'Start your complimentary trial'
        },
        Plus: {
            title: 'Plus',
            pricing: '1 month on us, then $9.99/mo',
            tagline: 'Perfect for frequent travelers and online shoppers',
            features: [
                {
                    title: 'Enhanced Virtual Card',
                    description: 'Get coverage for up to $2,500 on stolen or damaged purchases, within a year of purchase'
                },
                {
                    title: 'Travel protection',
                    description: 'Get refunded for canceled flights and hotels, up to $2,000 per year'
                },
                {
                    title: 'Extended refund protection',
                    description: 'Get refund protection of up to $500 on eligible purchases, within 120 days of purchase'
                },
                {
                    title: 'Priority support',
                    description: '24/7 customer support with faster response times'
                }
            ],
            buttonText: 'Start your complimentary trial'
        },
        Pro: {
            title: 'Pro',
            pricing: '1 month on us, then $19.99/mo',
            tagline: 'Ultimate protection for business and premium users',
            features: [
                {
                    title: 'Premium Virtual Card',
                    description: 'Get coverage for up to $5,000 on stolen or damaged purchases, within a year of purchase'
                },
                {
                    title: 'Comprehensive event protection',
                    description: 'Get refunded for any canceled events, up to $5,000 per year'
                },
                {
                    title: 'Maximum refund protection',
                    description: 'Get refund protection of up to $1,000 on eligible purchases, within 180 days of purchase'
                },
                {
                    title: 'Concierge service',
                    description: 'Personal concierge for all your protection needs'
                },
                {
                    title: 'Business features',
                    description: 'Advanced analytics and team management tools'
                }
            ],
            buttonText: 'Start your complimentary trial'
        }
    };

    const plans = ['Standard', 'Plus', 'Pro'];

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
                    key={plan}
                    style={[
                        styles.tab,
                        {
                            backgroundColor: selectedPlan === plan ? '#FFFFFF' : theme.colors.surface,
                        },
                    ]}
                    onPress={() => setSelectedPlan(plan)}
                >
                    <Text
                        style={[
                            styles.tabText,
                            {
                                color: selectedPlan === plan ? '#1AA5FF' : theme.colors.text,
                            },
                        ]}
                    >
                        {plan}
                    </Text>
                </TouchableOpacity>
            ))}
        </View>
    );

    const renderPlanCard = () => {
        const currentPlan = planData[selectedPlan];

        return (
            <View style={[styles.planCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.planTitle, { color: theme.colors.text }]}>{currentPlan.title}</Text>
                <Text style={[styles.planPricing, { color: theme.colors.text }]}>{currentPlan.pricing}</Text>
                <Text style={[styles.planTagline, { color: theme.colors.textSecondary }]}>{currentPlan.tagline}</Text>

                <View style={styles.featuresSection}>
                    <Text style={[styles.featuresTitle, { color: theme.colors.text }]}>Features for you</Text>

                    {currentPlan.features.map((feature, index) => (
                        <View key={index} style={styles.featureItem}>
                            <Text style={[styles.featureTitle, { color: theme.colors.text }]}>{feature.title}</Text>
                            <Text style={[styles.featureDescription, { color: theme.colors.textSecondary }]}>
                                {feature.description}
                            </Text>
                        </View>
                    ))}
                </View>

                <TouchableOpacity style={styles.trialButton} onPress={()=> navigation.navigate("SubscriptionDetails")}>
                    <LinearGradient
                        colors={['#1AA5FF', '#6B22E7']}
                        start={{ x: 0, y: 0 }}
                        end={{ x: 1, y: 0 }}
                        style={styles.gradientButton}
                    >
                        <Text style={[styles.trialButtonText, { color: "#fff" }]}>
                            {currentPlan.buttonText}
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
    planTitle: {
        fontSize: 28,
        fontWeight: '700',
        marginBottom: 8,
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
        marginBottom: 16,
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
        fontSize: 16,
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
    },
    linkText: {
        fontSize: 12,
        fontWeight: '500',
    },
});

export default Subscription;
