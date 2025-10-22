import React from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Modal,
    Dimensions,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import { useLanguage } from '../context/LanguageContext';
import MaterialIcons from 'react-native-vector-icons/MaterialIcons';
import LinearGradient from 'react-native-linear-gradient';

const { width, height } = Dimensions.get('window');

const DeleteAccountConfirmationModal = ({ 
    visible, 
    onClose, 
    onConfirm, 
    isLoading = false 
}) => {
    const { theme } = useTheme();
    const { t } = useLanguage();

    return (
        <Modal
            visible={visible}
            transparent={true}
            animationType="fade"
            onRequestClose={onClose}
        >
            <View style={styles.modalOverlay}>
                <View style={[
                    styles.modalContainer,
                    {
                        backgroundColor: theme.colors.surface,
                        borderColor: theme.colors.border,
                    }
                ]}>
                    {/* Header */}
                    <View style={styles.header}>
                        <View style={[
                            styles.iconContainer,
                            { backgroundColor: 'rgba(255, 59, 48, 0.1)' }
                        ]}>
                            <MaterialIcons 
                                name="delete-outline" 
                                size={32} 
                                color="#FF3B30" 
                            />
                        </View>
                        <Text style={[
                            styles.title,
                            { 
                                color: theme.colors.text,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.sizes.xl,
                                fontWeight: theme.typography.weights.bold,
                            }
                        ]}>
                            {t('deleteAccount')}
                        </Text>
                        <Text style={[
                            styles.description,
                            { 
                                color: theme.colors.textSecondary,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.sizes.md,
                                fontWeight: theme.typography.weights.regular,
                            }
                        ]}>
                            {t('areYouSureYouWantToDeleteYourAccount')}
                        </Text>
                    </View>

                    {/* Warning Message */}
                    <View style={[
                        styles.warningContainer,
                        { backgroundColor: 'rgba(255, 193, 7, 0.1)' }
                    ]}>
                        <MaterialIcons 
                            name="folder-delete" 
                            size={20} 
                            color="#FFC107" 
                        />
                        <Text style={[
                            styles.warningText,
                            { 
                                color: theme.colors.text,
                                fontFamily: theme.typography.fontFamily,
                                fontSize: theme.typography.sizes.sm,
                                fontWeight: theme.typography.weights.medium,
                            }
                        ]}>
                            {t('thisWillPermanentlyDeleteAllYourData')}
                        </Text>
                    </View>

                    {/* Buttons */}
                    <View style={styles.buttonContainer}>
                        <TouchableOpacity
                            style={[
                                styles.cancelButton,
                                {
                                    backgroundColor: theme.colors.border,
                                    borderColor: theme.colors.border,
                                }
                            ]}
                            onPress={onClose}
                            disabled={isLoading}
                            activeOpacity={0.7}
                        >
                            <Text style={[
                                styles.cancelButtonText,
                                {
                                    color: theme.colors.text,
                                    fontFamily: theme.typography.fontFamily,
                                    fontSize: theme.typography.sizes.md,
                                    fontWeight: theme.typography.weights.medium,
                                }
                            ]}>
                                {t('cancel')}
                            </Text>
                        </TouchableOpacity>

                        <TouchableOpacity
                            style={[
                                styles.deleteButton,
                                isLoading && styles.deleteButtonDisabled
                            ]}
                            onPress={onConfirm}
                            disabled={isLoading}
                            activeOpacity={isLoading ? 1 : 0.8}
                        >
                            <LinearGradient
                                colors={isLoading ? ["#666666", "#888888"] : ["#FF3B30", "#FF6B6B"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1, y: 0 }}
                                style={styles.gradientButton}
                            >
                                {isLoading ? (
                                    <View style={styles.loadingContainer}>
                                        <ActivityIndicator color="#FFFFFF" size="small" />
                                        <Text style={[
                                            styles.deleteButtonText,
                                            {
                                                fontFamily: theme.typography.fontFamily,
                                                fontSize: theme.typography.sizes.md,
                                                fontWeight: theme.typography.weights.medium,
                                                marginLeft: 8,
                                            }
                                        ]}>
                                            {t('deleting')}
                                        </Text>
                                    </View>
                                ) : (
                                    <Text style={[
                                        styles.deleteButtonText,
                                        {
                                            fontFamily: theme.typography.fontFamily,
                                            fontSize: theme.typography.sizes.md,
                                            fontWeight: theme.typography.weights.medium,
                                        }
                                    ]}>
                                        {t('deleteAccount')}
                                    </Text>
                                )}
                            </LinearGradient>
                        </TouchableOpacity>
                    </View>
                </View>
            </View>
        </Modal>
    );
};

const styles = StyleSheet.create({
    modalOverlay: {
        flex: 1,
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
        justifyContent: 'center',
        alignItems: 'center',
        paddingHorizontal: 20,
    },
    modalContainer: {
        width: '100%',
        maxWidth: 400,
        borderRadius: 20,
        borderWidth: 1,
        padding: 24,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 10,
        },
        shadowOpacity: 0.25,
        shadowRadius: 20,
        elevation: 10,
    },
    header: {
        alignItems: 'center',
        marginBottom: 20,
    },
    iconContainer: {
        width: 64,
        height: 64,
        borderRadius: 32,
        alignItems: 'center',
        justifyContent: 'center',
        marginBottom: 16,
    },
    title: {
        textAlign: 'center',
        marginBottom: 12,
    },
    description: {
        textAlign: 'center',
        lineHeight: 22,
    },
    warningContainer: {
        flexDirection: 'row',
        alignItems: 'flex-start',
        padding: 16,
        borderRadius: 12,
        marginBottom: 24,
    },
    warningText: {
        flex: 1,
        marginLeft: 12,
        lineHeight: 20,
    },
    buttonContainer: {
        flexDirection: 'row',
        gap: 12,
    },
    cancelButton: {
        flex: 1,
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
        borderWidth: 1,
    },
    cancelButtonText: {
        textAlign: 'center',
    },
    deleteButton: {
        flex: 1,
        borderRadius: 12,
        overflow: 'hidden',
    },
    deleteButtonDisabled: {
        opacity: 0.6,
    },
    gradientButton: {
        paddingVertical: 14,
        borderRadius: 12,
        alignItems: 'center',
        justifyContent: 'center',
    },
    deleteButtonText: {
        color: '#FFFFFF',
        textAlign: 'center',
    },
    loadingContainer: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
    },
});

export default DeleteAccountConfirmationModal;
