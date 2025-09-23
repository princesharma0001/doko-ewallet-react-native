import React, { useEffect } from 'react';
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
import { useAppSelector, useAppDispatch } from '../store';
import { getContent } from '../store/slices/contentSlice';
import Toast from 'react-native-toast-message';

const { width, height } = Dimensions.get('window');

const TermsDetails = ({ navigation }) => {
    const { theme } = useTheme();
    const dispatch = useAppDispatch();
    const { termsAndConditions, isLoading, error } = useAppSelector((state) => state.content);

    // Fetch content on component mount
    useEffect(() => {
        dispatch(getContent());
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


    const renderTermsContent = () => {
        if (!termsAndConditions) {
            return (
                <View style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}>
                    <Text style={[styles.noContentText, { color: theme.colors.textSecondary }]}>
                        No terms and conditions found
                    </Text>
                </View>
            );
        }

        return (
            <View style={[styles.contentCard, { backgroundColor: theme.colors.surface }]}>
                <Text style={[styles.contentTitle, { color: theme.colors.text }]}>
                    {termsAndConditions.title}
                </Text>
                
                <Text style={[styles.contentDescription, { color: theme.colors.textSecondary }]}>
                    {termsAndConditions.description}
                </Text>

                <View style={styles.contentBody}>
                    <Text style={[styles.contentText, { color: theme.colors.text }]}>
                        {termsAndConditions.formattedContent}
                    </Text>
                </View>

                <View style={styles.metaInfo}>
                    <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                        Last Updated: {new Date(termsAndConditions.updatedAt).toLocaleDateString()}
                    </Text>
                    <Text style={[styles.metaText, { color: theme.colors.textSecondary }]}>
                        Version: {termsAndConditions.version}
                    </Text>
                </View>
            </View>
        );
    };

    const renderContent = () => (
        <View style={styles.contentContainer}>
            <View style={styles.titleContainer}>
                <Text style={[styles.headerTitle, { color: theme.colors.text }]}>Terms & Conditions</Text>
            </View>
            {renderTermsContent()}
        </View>
    );

    const renderLoadingState = () => (
        <View style={styles.loadingContainer}>
            <ActivityIndicator size="large" color={theme.colors.primary} />
            <Text style={[styles.loadingText, { color: theme.colors.text }]}>
                Loading terms and conditions...
            </Text>
        </View>
    );

    if (isLoading) {
        return (
            <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
                {renderHeader()}
                {renderLoadingState()}
            </View>
        );
    }

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}
            <ScrollView style={styles.scrollView} showsVerticalScrollIndicator={false}>
                <View style={styles.content}>
                    {renderContent()}
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
    contentContainer: {
        gap: 16,
    },
    contentCard: {
        borderRadius: 12,
        padding: 20,
        marginBottom: 16,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 4,
        elevation: 3,
    },
    contentTitle: {
        fontSize: 24,
        fontWeight: '700',
        marginBottom: 8,
        color: '#1AA5FF',
    },
    contentDescription: {
        fontSize: 16,
        marginBottom: 16,
        lineHeight: 22,
        fontStyle: 'italic',
    },
    contentBody: {
        marginBottom: 20,
    },
    contentText: {
        fontSize: 16,
        lineHeight: 24,
        textAlign: 'justify',
    },
    metaInfo: {
        borderTopWidth: 1,
        borderTopColor: 'rgba(255, 255, 255, 0.1)',
        paddingTop: 12,
        flexDirection: 'row',
        justifyContent: 'space-between',
        flexWrap: 'wrap',
    },
    metaText: {
        fontSize: 12,
        marginBottom: 4,
    },
    noContentText: {
        fontSize: 16,
        textAlign: 'center',
        fontStyle: 'italic',
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

export default TermsDetails;
