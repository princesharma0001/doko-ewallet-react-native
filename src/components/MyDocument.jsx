import React from 'react';
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

const { width, height } = Dimensions.get('window');

const MyDocument = ({ navigation }) => {
    const { theme } = useTheme();

    const subscriptionFeatures = [
        {
            id: 'card-issued',
            title: 'Card issued',
            type: 'number',
            value: '3',
        },

    ];

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
            </View>
        </View>
    );


    const renderFeatureCard = (feature) => (
        <View
            key={feature.id}
            style={[styles.featureCard, { backgroundColor: theme.colors.surface }]}
        >
            <View>
                <Ionicons name="document-text-outline" size={24} color={theme.colors.text} />

            </View>
            <View>
                <Text style={[styles.featureTitle, { color: theme.colors.text }]}>
                    Privacy Policy
                </Text>
                <Text style={[styles.featureTitle, { color: theme.colors.text, fontSize: 12, lineHeight: 22 }]}>
                    12/12/2023
                </Text>
            </View>




        </View>
    );

    const renderSubscriptionFeatures = () => (
        <View style={styles.featuresContainer}>
            <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Privacy</Text>
            </View>
            {subscriptionFeatures.map(renderFeatureCard)}
        </View>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {renderSubscriptionFeatures()}
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
    },
    headerContent: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    backButton: {
        padding: 8,
        marginRight: 16,
    },
    headerTitle: {
        fontSize: 38,
        fontWeight: '700',
    },
    headerSpacer: {
        flex: 1,
    },
    titleContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        marginBottom: 10,
    },
    scrollView: {
        flex: 1,
    },
    content: {
        paddingHorizontal: 20,
        paddingVertical: 20,
    },
    featuresContainer: {
        gap: 16,
    },
    featureCard: {
        borderRadius: 12,
        paddingHorizontal: 15,
        paddingVertical: 16,
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12
        // justifyContent: 'space-between',
    },
    featureTitle: {
        fontSize: 16,
        fontWeight: '500',
        flex: 1,
    },
    featureValue: {
        fontSize: 18,
        fontWeight: '600',
    },
    sliderContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        gap: 12,
    },
    sliderTrack: {
        width: 80,
        height: 6,
        borderRadius: 3,
        position: 'relative',
    },
    sliderFill: {
        height: '100%',
        borderRadius: 3,
    },
    sliderThumb: {
        position: 'absolute',
        top: -4,
        width: 14,
        height: 14,
        borderRadius: 7,
        marginLeft: -7,
    },
    sliderText: {
        fontSize: 14,
        fontWeight: '500',
        minWidth: 30,
        textAlign: 'right',
    },
});

export default MyDocument;
