import React, { useState, useEffect } from 'react';
import {
    View,
    Text,
    StyleSheet,
    TouchableOpacity,
    Dimensions,
    Alert,
    PermissionsAndroid,
    Platform,
    Modal,
    ActivityIndicator,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { RNCamera } from 'react-native-camera';
import QRCode from 'react-native-qrcode-svg';
import { useAppSelector } from '../hooks/redux';

const { width, height } = Dimensions.get('window');

const QrCodeSendRecive = ({ navigation }) => {
    const { theme, isDarkMode } = useTheme();
    const [activeMode, setActiveMode] = useState(null); // 'send' or 'receive'
    const [hasPermission, setHasPermission] = useState(null);
    const [scanned, setScanned] = useState(false);
    const [qrData, setQrData] = useState(''); // Replace with actual user data
    const [isLoading, setIsLoading] = useState(false);
    const { currentUser, isProfileLoading, profileError } = useAppSelector((state) => state.user);
    console.log("adfgadsgsa", currentUser);

    useEffect(() => {
        // Preload permission status to avoid null state on first open
        getCameraPermissions();
    }, []);

    const getCameraPermissions = async () => {
        if (Platform.OS === 'android') {
            try {
                const has = await PermissionsAndroid.check(PermissionsAndroid.PERMISSIONS.CAMERA);
                if (has) {
                    setHasPermission(true);
                    return true;
                }

                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: 'Camera Permission',
                        message: 'DOKO needs access to your camera to scan QR codes',
                        buttonNeutral: 'Ask Me Later',
                        buttonNegative: 'Cancel',
                        buttonPositive: 'OK',
                    }
                );
                const isGranted = granted === PermissionsAndroid.RESULTS.GRANTED;
                setHasPermission(isGranted);
                return isGranted;
            } catch (err) {
                console.warn(err);
                setHasPermission(false);
                return false;
            }
        } else {
            setHasPermission(true);
            return true;
        }
    };

    const handleSendPress = async () => {
        // Always ensure we have permission before opening scanner
        const ok = await getCameraPermissions();
        if (!ok) {
            Alert.alert('Permission', 'Camera permission is required to scan QR codes');
            return;
        }
        setActiveMode('send');
        setScanned(false);
    };

    const handleReceivePress = () => {
        setActiveMode('receive');
        // Generate QR data with user information
        generateQRData();
    };

    const generateQRData = () => {
        // Replace with actual user data from your app state/API
        const userData = {
            userId: currentUser?.email, // Get from your user state
            timestamp: Date.now(),
            type: 'receive',
            name: currentUser?.firstName
        };
        setQrData(JSON.stringify(userData));
    };

    const handleBarCodeScanned = ({ type, data }) => {
        setScanned(true);
        console.log('QR Code scanned:', data);

        try {
            const parsedData = JSON.parse(data);
            console.log("Parsed data:", parsedData);

            // Assuming userID is available in parsedData.userID or parsedData.userId
            const userID = parsedData.userId || parsedData.userId;

            if (parsedData) {
                navigation.navigate("AddRecieveQr", { data: parsedData });
            } else {
                console.warn("userID not found in parsed data");
            }
        } catch (error) {
            console.error("Error parsing data:", error);
        }
    };

    const renderHeader = () => (
        <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
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
            <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
                QR Code
            </Text>
            <View style={styles.headerSpacer} />
        </View>
    );

    const renderMainContent = () => (
        <View style={styles.mainContent}>
            <Text style={[styles.title, { color: theme.colors.text }]}>
                Choose an option
            </Text>
            <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
                Send money by scanning a QR code or receive money by showing your QR code
            </Text>

            <View style={styles.buttonContainer}>
                {/* Send Button */}
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
                    onPress={handleSendPress}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#169BFF', '#0D7AE8']}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="qr-code-outline" size={32} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Send Money</Text>
                        <Text style={styles.buttonSubtext}>Scan QR code to send</Text>
                    </LinearGradient>
                </TouchableOpacity>

                {/* Receive Button */}
                <TouchableOpacity
                    style={[styles.actionButton, { backgroundColor: theme.colors.surface }]}
                    onPress={handleReceivePress}
                    activeOpacity={0.8}
                >
                    <LinearGradient
                        colors={['#10B981', '#059669']}
                        style={styles.gradientButton}
                    >
                        <Ionicons name="qr-code" size={32} color="#FFFFFF" />
                        <Text style={styles.buttonText}>Receive Money</Text>
                        <Text style={styles.buttonSubtext}>Show QR code to receive</Text>
                    </LinearGradient>
                </TouchableOpacity>
            </View>
        </View>
    );

    const renderQRScanner = () => (
        <Modal
            visible={activeMode === 'send'}
            animationType="slide"
            onRequestClose={() => setActiveMode(null)}
        >
            <View style={styles.scannerContainer}>
                <View style={styles.scannerHeader}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setActiveMode(null)}
                    >
                        <Ionicons name="close" size={24} color="#FFFFFF" />
                    </TouchableOpacity>
                    <Text style={styles.scannerTitle}>Scan QR Code</Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.cameraContainer}>
                    {hasPermission === null ? (
                        <View style={styles.permissionContainer}>
                            <ActivityIndicator size="large" color="#169BFF" />
                            <Text style={styles.permissionText}>Requesting camera permission...</Text>
                        </View>
                    ) : hasPermission === false ? (
                        <View style={styles.permissionContainer}>
                            <Ionicons name="camera-outline" size={64} color="#FF6B6B" />
                            <Text style={styles.permissionText}>Camera permission denied</Text>
                            <TouchableOpacity
                                style={styles.permissionButton}
                                onPress={getCameraPermissions}
                            >
                                <Text style={styles.permissionButtonText}>Grant Permission</Text>
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <RNCamera
                            style={styles.camera}
                            type={RNCamera.Constants.Type.back}
                            captureAudio={false}
                            onBarCodeRead={scanned ? undefined : handleBarCodeScanned}
                            barCodeTypes={[RNCamera.Constants.BarCodeType.qr]}
                        >
                            <View style={styles.scannerOverlay}>
                                <View style={styles.scannerFrame} />
                                <Text style={styles.scannerInstruction}>
                                    Position the QR code within the frame
                                </Text>
                            </View>
                        </RNCamera>
                    )}
                </View>
            </View>
        </Modal>
    );

    const renderQRGenerator = () => (
        <Modal
            visible={activeMode === 'receive'}
            animationType="slide"
            onRequestClose={() => setActiveMode(null)}
        >
            <View style={[styles.qrContainer, { backgroundColor: theme.colors.background }]}>
                <View style={styles.qrHeader}>
                    <TouchableOpacity
                        style={styles.closeButton}
                        onPress={() => setActiveMode(null)}
                    >
                        <Ionicons name="close" size={24} color={theme.colors.text} />
                    </TouchableOpacity>
                    <Text style={[styles.qrTitle, { color: theme.colors.text }]}>
                        Your QR Code
                    </Text>
                    <View style={styles.headerSpacer} />
                </View>

                <View style={styles.qrContent}>
                    <View style={[styles.qrCodeContainer, { backgroundColor: theme.colors.surface }]}>
                        <QRCode
                            value={qrData}
                            size={250}
                            color={theme.colors.text}
                            backgroundColor={theme.colors.surface}
                        />
                    </View>

                    <Text style={[styles.qrInstruction, { color: theme.colors.textSecondary }]}>
                        Show this QR code to receive money
                    </Text>

                    <TouchableOpacity
                        style={styles.shareButton}
                        onPress={() => {
                            // Implement share functionality
                            Alert.alert('Share', 'QR code sharing functionality');
                        }}
                    >
                        <LinearGradient
                            colors={['#169BFF', '#0D7AE8']}
                            style={styles.shareGradient}
                        >
                            <Ionicons name="share-outline" size={20} color="#FFFFFF" />
                            <Text style={styles.shareButtonText}>Share QR Code</Text>
                        </LinearGradient>
                    </TouchableOpacity>
                </View>
            </View>
        </Modal>
    );

    return (
        <View style={[styles.container, { backgroundColor: theme.colors.background }]}>
            {renderHeader()}
            {renderMainContent()}
            {renderQRScanner()}
            {renderQRGenerator()}
        </View>
    );
};

const styles = StyleSheet.create({
    container: {
        flex: 1,
    },
    header: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    backButton: {
        padding: 8,
    },
    headerTitle: {
        fontSize: 20,
        fontWeight: '700',
        fontFamily: 'System',
    },
    headerSpacer: {
        width: 40,
    },
    mainContent: {
        flex: 1,
        paddingHorizontal: 20,
        paddingTop: 40,
    },
    title: {
        fontSize: 28,
        fontWeight: '700',
        textAlign: 'center',
        marginBottom: 12,
        fontFamily: 'System',
    },
    subtitle: {
        fontSize: 16,
        textAlign: 'center',
        lineHeight: 24,
        marginBottom: 60,
        fontFamily: 'System',
    },
    buttonContainer: {
        gap: 20,
    },
    actionButton: {
        borderRadius: 16,
        overflow: 'hidden',
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    gradientButton: {
        paddingVertical: 30,
        paddingHorizontal: 20,
        alignItems: 'center',
        justifyContent: 'center',
    },
    buttonText: {
        fontSize: 20,
        fontWeight: '700',
        color: '#FFFFFF',
        marginTop: 12,
        fontFamily: 'System',
    },
    buttonSubtext: {
        fontSize: 14,
        color: '#FFFFFF',
        marginTop: 4,
        opacity: 0.9,
        fontFamily: 'System',
    },
    // Scanner Styles
    scannerContainer: {
        flex: 1,
        backgroundColor: '#000000',
    },
    scannerHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.8)',
    },
    closeButton: {
        padding: 8,
    },
    scannerTitle: {
        fontSize: 18,
        fontWeight: '600',
        color: '#FFFFFF',
        fontFamily: 'System',
    },
    cameraContainer: {
        flex: 1,
    },
    camera: {
        flex: 1,
    },
    scannerOverlay: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerFrame: {
        width: 250,
        height: 250,
        borderWidth: 2,
        borderColor: '#169BFF',
        borderRadius: 12,
        backgroundColor: 'transparent',
    },
    scannerInstruction: {
        color: '#FFFFFF',
        fontSize: 16,
        marginTop: 30,
        textAlign: 'center',
        fontFamily: 'System',
    },
    permissionContainer: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    permissionText: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        marginTop: 20,
        fontFamily: 'System',
    },
    permissionButton: {
        backgroundColor: '#169BFF',
        paddingHorizontal: 20,
        paddingVertical: 12,
        borderRadius: 8,
        marginTop: 20,
    },
    permissionButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        fontFamily: 'System',
    },
    // QR Generator Styles
    qrContainer: {
        flex: 1,
    },
    qrHeader: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'space-between',
        paddingHorizontal: 20,
        paddingTop: 50,
        paddingBottom: 20,
    },
    qrTitle: {
        fontSize: 18,
        fontWeight: '600',
        fontFamily: 'System',
    },
    qrContent: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 40,
    },
    qrCodeContainer: {
        padding: 20,
        borderRadius: 16,
        elevation: 4,
        shadowColor: '#000',
        shadowOffset: {
            width: 0,
            height: 2,
        },
        shadowOpacity: 0.1,
        shadowRadius: 8,
    },
    qrInstruction: {
        fontSize: 16,
        textAlign: 'center',
        marginTop: 30,
        marginBottom: 40,
        fontFamily: 'System',
    },
    shareButton: {
        borderRadius: 12,
        overflow: 'hidden',
    },
    shareGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        paddingHorizontal: 24,
        paddingVertical: 16,
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 16,
        fontWeight: '600',
        marginLeft: 8,
        fontFamily: 'System',
    },
});

export default QrCodeSendRecive;
