import React, { useState, useEffect, useRef } from 'react';
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
    Share,
    Linking,
    Clipboard,
} from 'react-native';
import { useTheme } from '../context/ThemeContext';
import Ionicons from 'react-native-vector-icons/Ionicons';
import LinearGradient from 'react-native-linear-gradient';
import { Camera, useCameraDevices, useCodeScanner } from 'react-native-vision-camera';
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
    const [isSharing, setIsSharing] = useState(false);
    const [flashMode, setFlashMode] = useState('off');
    const { currentUser, isProfileLoading, profileError } = useAppSelector((state) => state.user);
    const qrCodeRef = useRef(null);
    const cameraRef = useRef(null);
    
    // Get camera devices
    const devices = useCameraDevices();
    const device = devices.back;
    
    console.log("adfgadsgsa", currentUser);

    useEffect(() => {
        // Preload permission status to avoid null state on first open
        getCameraPermissions();
    }, []);

    const getCameraPermissions = async () => {
        try {
            const permission = await Camera.requestCameraPermission();
            const isGranted = permission === 'authorized';
            setHasPermission(isGranted);
            
            if (!isGranted) {
                Alert.alert(
                    'Permission Required',
                    'Camera permission is required to scan QR codes. Please enable it in your device settings.',
                    [
                        { text: 'Cancel', style: 'cancel' },
                        { text: 'Open Settings', onPress: () => Linking.openSettings() }
                    ]
                );
            }
            
            return isGranted;
        } catch (err) {
            console.error('Camera permission error:', err);
            setHasPermission(false);
            Alert.alert('Error', 'Failed to request camera permission');
            return false;
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

    const toggleFlash = () => {
        setFlashMode(flashMode === 'off' ? 'on' : 'off');
    };

    // Configure code scanner
    const codeScanner = useCodeScanner({
        codeTypes: ['qr', 'ean-13'],
        onCodeScanned: (codes) => {
            if (scanned) return; // Prevent multiple scans
            const code = codes[0];
            if (code) {
                handleBarCodeScanned({ data: code.value });
            }
        }
    });

    const generateQRData = () => {
        // Create a more user-friendly QR data format
        const userData = {
            app: 'DOKO',
            action: 'send_money',
            userId: currentUser?.email,
            username: currentUser?.username || currentUser?.firstName,
            timestamp: Date.now(),
            version: '1.0'
        };
        setQrData(JSON.stringify(userData));
    };

    const shareQRCode = async () => {
        if (!qrData) {
            Alert.alert('Error', 'QR code data not available');
            return;
        }

        setIsSharing(true);
        try {
            // Create a more user-friendly share message
            const userName = currentUser?.firstName || currentUser?.username || 'DOKO User';
            const shareMessage = `💰 Send me money via DOKO!\n\nScan this QR code to send money to ${userName}\n\nQR Code Data:\n${qrData}\n\nDownload DOKO app to send money easily!`;

            const shareOptions = {
                message: shareMessage,
                title: 'DOKO QR Code - Send Money',
            };

            const result = await Share.share(shareOptions);

            if (result.action === Share.sharedAction) {
                console.log('QR code shared successfully');
            } else if (result.action === Share.dismissedAction) {
                console.log('Share dismissed');
            }
        } catch (error) {
            console.error('Error sharing QR code:', error);
            Alert.alert('Error', 'Failed to share QR code');
        } finally {
            setIsSharing(false);
        }
    };

    const copyQRData = async () => {
        if (!qrData) {
            Alert.alert('Error', 'QR code data not available');
            return;
        }

        try {
            await Clipboard.setString(qrData);
            Alert.alert('Copied', 'QR code data copied to clipboard');
        } catch (error) {
            console.error('Error copying QR data:', error);
            Alert.alert('Error', 'Failed to copy QR code data');
        }
    };

    const shareQRCodeAsImage = async () => {
        if (!qrCodeRef.current) {
            Alert.alert('Error', 'QR code not ready');
            return;
        }

        setIsSharing(true);
        try {
            // Capture QR code as base64 image
            const qrCodeImage = await qrCodeRef.current.toDataURL();

            const shareOptions = {
                message: `Scan this QR code to send me money via DOKO!\n\nUser: ${currentUser?.firstName || 'DOKO User'}`,
                title: 'DOKO QR Code',
                url: `data:image/png;base64,${qrCodeImage}`,
            };

            const result = await Share.share(shareOptions);

            if (result.action === Share.sharedAction) {
                console.log('QR code image shared successfully');
            }
        } catch (error) {
            console.error('Error sharing QR code image:', error);
            Alert.alert('Error', 'Failed to share QR code image');
        } finally {
            setIsSharing(false);
        }
    };



    const handleBarCodeScanned = (e) => {
        if (scanned) return; // Prevent multiple scans
        
        setScanned(true);
        console.log('QR Code scanned:', e.data);

        try {
            // Check if the scanned data is valid JSON
            let parsedData;
            try {
                parsedData = JSON.parse(e.data);
            } catch (parseError) {
                console.log("QR data is not JSON, treating as plain text:", e.data);
                // Handle non-JSON QR codes
                Alert.alert(
                    'QR Code Detected',
                    `Scanned: ${e.data}\n\nThis doesn't appear to be a DOKO payment QR code.`,
                    [
                        {
                            text: 'Try Again',
                            onPress: () => setScanned(false),
                        },
                        {
                            text: 'Cancel',
                            onPress: () => setActiveMode(null),
                        },
                    ]
                );
                return;
            }

            console.log("Parsed data:", parsedData);

            // Check if it's a DOKO QR code
            if (parsedData.app === 'DOKO' && parsedData.action === 'send_money') {
                // Navigate to the next screen with the parsed data
                if (navigation && navigation.navigate) {
                    navigation.navigate("AddRecieveQr", { data: parsedData });
                } else {
                    console.error("Navigation not available");
                    Alert.alert('Error', 'Navigation not available');
                }
            } else {
                // Handle other QR codes or show error
                Alert.alert(
                    'Invalid QR Code',
                    'This QR code is not a valid DOKO payment code. Please scan a DOKO QR code.',
                    [
                        {
                            text: 'Try Again',
                            onPress: () => setScanned(false),
                        },
                        {
                            text: 'Cancel',
                            onPress: () => setActiveMode(null),
                        },
                    ]
                );
            }
        } catch (error) {
            console.error("Error processing QR data:", error);
            Alert.alert(
                'Error',
                'Failed to process QR code. Please try again.',
                [
                    {
                        text: 'Try Again',
                        onPress: () => setScanned(false),
                    },
                    {
                        text: 'Cancel',
                        onPress: () => setActiveMode(null),
                    },
                ]
            );
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
                    ) : device ? (
                        <View style={styles.scannerWrapper}>
                            <Camera
                                ref={cameraRef}
                                style={styles.camera}
                                device={device}
                                isActive={activeMode === 'send'}
                                codeScanner={codeScanner}
                                torch={flashMode}
                            />
                            
                            {/* Scanner Overlay */}
                            <View style={styles.scannerOverlay}>
                                <Text style={styles.scannerInstruction}>
                                    Position the QR code within the frame
                                </Text>
                            </View>
                            
                            {/* Scanner Bottom Content */}
                            <View style={styles.scannerBottomContent}>
                                <Text style={styles.scannerBottomText}>
                                    Scan a QR code to send money
                                </Text>
                            </View>
                            
                            {/* Flash Toggle Button */}
                            <TouchableOpacity
                                style={styles.flashButton}
                                onPress={toggleFlash}
                            >
                                <Ionicons
                                    name={flashMode === 'off' ? "flash-off" : "flash"}
                                    size={24}
                                    color="#FFFFFF"
                                />
                            </TouchableOpacity>
                        </View>
                    ) : (
                        <View style={styles.permissionContainer}>
                            <Ionicons name="camera-outline" size={64} color="#FF6B6B" />
                            <Text style={styles.permissionText}>Camera not available</Text>
                        </View>
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
                            ref={qrCodeRef}
                            value={qrData}
                            size={250}
                            color={theme.colors.text}
                            backgroundColor={theme.colors.surface}
                        />
                    </View>

                    <Text style={[styles.qrInstruction, { color: theme.colors.textSecondary }]}>
                        Show this QR code to receive money
                    </Text>

                    <View style={styles.buttonRow}>
                        <TouchableOpacity
                            style={[styles.shareButton, styles.quickShareButton]}
                            onPress={shareQRCode}
                            disabled={isSharing}
                        >
                            <LinearGradient
                                colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
                                start={{ x: 0, y: 0 }}
                                end={{ x: 1.5, y: 0.5 }}
                                style={[styles.shareGradient, { opacity: isSharing ? 0.7 : 1 }]}
                            >
                                {isSharing ? (
                                    <ActivityIndicator size="small" color="#FFFFFF" />
                                ) : (
                                    <Ionicons name="send-outline" size={18} color="#FFFFFF" />
                                )}
                                <Text style={styles.shareButtonText}>
                                    {isSharing ? 'Sharing...' : 'Quick Share'}
                                </Text>
                            </LinearGradient>
                        </TouchableOpacity>


                    </View>
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
    scannerWrapper: {
        flex: 1,
        position: 'relative',
    },
    camera: {
        flex: 1,
        width: '100%',
        height: '100%',
    },
    flashButton: {
        position: 'absolute',
        top: 20,
        right: 20,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        borderRadius: 25,
        width: 50,
        height: 50,
        alignItems: 'center',
        justifyContent: 'center',
    },
    scannerOverlay: {
        position: 'absolute',
        top: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    scannerInstruction: {
        color: '#FFFFFF',
        fontSize: 16,
        textAlign: 'center',
        fontFamily: 'System',
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    scannerBottomContent: {
        position: 'absolute',
        bottom: 50,
        left: 0,
        right: 0,
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 20,
    },
    scannerBottomText: {
        color: '#FFFFFF',
        fontSize: 14,
        textAlign: 'center',
        fontFamily: 'System',
        opacity: 0.8,
        backgroundColor: 'rgba(0, 0, 0, 0.6)',
        paddingHorizontal: 16,
        paddingVertical: 8,
        borderRadius: 8,
    },
    markerStyle: {
        borderColor: '#169BFF',
        borderWidth: 2,
        borderRadius: 12,
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
    buttonRow: {
        flexDirection: 'row',
        gap: 12,
        width: '100%',
    },
    shareButton: {
        borderRadius: 12,
        overflow: 'hidden',
        flex: 1,
    },
    quickShareButton: {
        flex: 2,
    },
    moreOptionsButton: {
        flex: 1,
    },
    shareGradient: {
        flexDirection: 'row',
        alignItems: 'center',
        justifyContent: 'center',
        paddingHorizontal: 16,
        paddingVertical: 14,
    },
    shareButtonText: {
        color: '#FFFFFF',
        fontSize: 14,
        fontWeight: '600',
        marginLeft: 6,
        fontFamily: 'System',
    },
});

export default QrCodeSendRecive;
