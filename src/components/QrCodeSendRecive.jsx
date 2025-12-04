import React, { useState, useEffect, useRef } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  Dimensions,
  Alert,
  Modal,
  ActivityIndicator,
  Share,
  Linking,
  Clipboard,
  Platform,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import { useLanguage } from "../context/LanguageContext";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";
import QRCode from "react-native-qrcode-svg";
import QRCodeScanner from "react-native-qrcode-scanner";
import { RNCamera } from "react-native-camera";
import { PERMISSIONS, request, RESULTS } from "react-native-permissions";
import { useAppSelector } from "../hooks/redux";

const { width, height } = Dimensions.get("window");

const QrCodeSendRecive = ({ navigation }) => {
  const { theme, isDarkMode } = useTheme();
  const { t } = useLanguage();
  const [activeMode, setActiveMode] = useState(null); // 'send' or 'receive'
  const [hasPermission, setHasPermission] = useState(null);
  const [scanned, setScanned] = useState(false);
  const [qrData, setQrData] = useState(""); // Replace with actual user data
  const [isSharing, setIsSharing] = useState(false);
  const [flashMode, setFlashMode] = useState("off");
  const { currentUser, isProfileLoading, profileError } = useAppSelector(
    (state) => state.user
  );
  const qrCodeRef = useRef(null);
  const qrScannerRef = useRef(null);

  console.log("adfgadsgsa", currentUser);

  useEffect(() => {
    // Preload permission status to avoid null state on first open
    getCameraPermissions();
  }, []);

  const getCameraPermissions = async () => {
    try {
      const permission =
        Platform.OS === "ios"
          ? PERMISSIONS.IOS.CAMERA
          : PERMISSIONS.ANDROID.CAMERA;
      const result = await request(permission);
      const isGranted =
        result === RESULTS.GRANTED || result === RESULTS.LIMITED;
      setHasPermission(isGranted);

      if (!isGranted) {
        Alert.alert(
          t("permissionRequired"),
          t("cameraPermissionIsRequiredToScanQrCodes"),
          [
            { text: t("cancel"), style: "cancel" },
            { text: t("openSettings"), onPress: () => Linking.openSettings() },
          ]
        );
      }

      return isGranted;
    } catch (err) {
      console.error("Camera permission error:", err);
      setHasPermission(false);
      Alert.alert(t("error"), t("failedToRequestCameraPermission"));
      return false;
    }
  };

  const reactivateScanner = () => {
    if (qrScannerRef.current?.reactivate) {
      qrScannerRef.current.reactivate();
    }
  };

  const handleRetryScan = () => {
    setScanned(false);
    reactivateScanner();
  };

  useEffect(() => {
    if (activeMode === "send") {
      handleRetryScan();
    }
  }, [activeMode]);

  const handleSendPress = async () => {
    // Always ensure we have permission before opening scanner
    const ok = await getCameraPermissions();
    if (!ok) {
      Alert.alert(
        t("permission"),
        t("cameraPermissionIsRequiredToScanQrCodesShort")
      );
      return;
    }
    setActiveMode("send");
    setScanned(false);
  };

  const handleReceivePress = () => {
    setActiveMode("receive");
    // Generate QR data with user information
    generateQRData();
  };

  const toggleFlash = () => {
    setFlashMode(flashMode === "off" ? "on" : "off");
  };

  const generateQRData = () => {
    // Create a more user-friendly QR data format
    const userData = {
      app: "DOKO",
      action: "send_money",
      userId: currentUser?.email,
      username: currentUser?.username || currentUser?.firstName,
      timestamp: Date.now(),
      version: "1.0",
    };
    setQrData(JSON.stringify(userData));
  };

  const shareQRCode = async () => {
    if (!qrData) {
      Alert.alert(t("error"), t("qrCodeDataNotAvailable"));
      return;
    }

    setIsSharing(true);
    try {
      // Create a more user-friendly share message
      const userName =
        currentUser?.firstName || currentUser?.username || "DOKO User";
      const shareMessage = `💰 ${t("sendMeMoneyViaDoko")}\n\n${t(
        "scanThisQrCodeToSendMoneyTo"
      )} ${userName}\n\n${t("qrCodeData")}:\n${qrData}\n\n${t(
        "downloadDokoAppToSendMoneyEasily"
      )}`;

      const shareOptions = {
        message: shareMessage,
        title: t("dokoQrCodeSendMoney"),
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        console.log(t("qrCodeSharedSuccessfully"));
      } else if (result.action === Share.dismissedAction) {
        console.log(t("shareDismissed"));
      }
    } catch (error) {
      console.error("Error sharing QR code:", error);
      Alert.alert(t("error"), t("failedToShareQrCode"));
    } finally {
      setIsSharing(false);
    }
  };

  const copyQRData = async () => {
    if (!qrData) {
      Alert.alert(t("error"), t("qrCodeDataNotAvailable"));
      return;
    }

    try {
      await Clipboard.setString(qrData);
      Alert.alert(t("copied"), t("qrCodeDataCopiedToClipboard"));
    } catch (error) {
      console.error("Error copying QR data:", error);
      Alert.alert(t("error"), t("failedToCopyQrCodeData"));
    }
  };

  const shareQRCodeAsImage = async () => {
    if (!qrCodeRef.current) {
      Alert.alert(t("error"), t("qrCodeNotReady"));
      return;
    }

    setIsSharing(true);
    try {
      // Capture QR code as base64 image
      const qrCodeImage = await qrCodeRef.current.toDataURL();

      const shareOptions = {
        message: `${t("scanThisQrCodeToSendMeMoneyViaDoko")}\n\n${t("user")}: ${
          currentUser?.firstName || "DOKO User"
        }`,
        title: t("dokoQrCode"),
        url: `data:image/png;base64,${qrCodeImage}`,
      };

      const result = await Share.share(shareOptions);

      if (result.action === Share.sharedAction) {
        console.log(t("qrCodeImageSharedSuccessfully"));
      }
    } catch (error) {
      console.error("Error sharing QR code image:", error);
      Alert.alert(t("error"), t("failedToShareQrCodeImage"));
    } finally {
      setIsSharing(false);
    }
  };

  const handleBarCodeScanned = (e) => {
    if (scanned) return;

    setScanned(true);
    console.log("QR Code scanned:", e.data);

    try {
      let parsedData;
      try {
        parsedData = JSON.parse(e.data);
      } catch (parseError) {
        Alert.alert(
          t("qrCodeDetected"),
          `${t("scanned")}: ${e.data}\n\n${t(
            "thisDoesntAppearToBeDokoPaymentQrCode"
          )}`,
          [
            {
              text: t("tryAgain"),
              onPress: handleRetryScan,
            },
            {
              text: t("cancel"),
              onPress: () => setActiveMode(null),
            },
          ]
        );
        return;
      }

      if (parsedData.app === "DOKO" && parsedData.action === "send_money") {
        if (navigation && navigation.navigate) {
          navigation.navigate("AddRecieveQr", { data: parsedData });
        } else {
          Alert.alert(t("error"), t("navigationNotAvailable"));
        }
      } else {
        Alert.alert(
          t("invalidQrCode"),
          t("thisQrCodeIsNotValidDokoPaymentCode"),
          [
            {
              text: t("tryAgain"),
              onPress: handleRetryScan,
            },
            {
              text: t("cancel"),
              onPress: () => setActiveMode(null),
            },
          ]
        );
      }
    } catch (error) {
      console.error("Error processing QR data:", error);
      Alert.alert(t("error"), t("failedToProcessQrCode"), [
        {
          text: t("tryAgain"),
          onPress: handleRetryScan,
        },
        {
          text: t("cancel"),
          onPress: () => setActiveMode(null),
        },
      ]);
    }
  };

  const renderHeader = () => (
    <View style={[styles.header, { backgroundColor: theme.colors.background }]}>
      <TouchableOpacity
        style={styles.backButton}
        onPress={() => navigation?.goBack()}
      >
        <Ionicons name="arrow-back" size={24} color={theme.colors.text} />
      </TouchableOpacity>
      <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
        {t("qrCode")}
      </Text>
      <View style={styles.headerSpacer} />
    </View>
  );

  const renderMainContent = () => (
    <View style={styles.mainContent}>
      <Text style={[styles.title, { color: theme.colors.text }]}>
        {t("chooseAnOption")}
      </Text>
      <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
        {t("sendMoneyByScanning")}
      </Text>

      <View style={styles.buttonContainer}>
        {/* Send Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={handleSendPress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#169BFF", "#0D7AE8"]}
            style={styles.gradientButton}
          >
            <Ionicons name="qr-code-outline" size={32} color="#FFFFFF" />
            <Text style={styles.buttonText}>{t("sendMoney")}</Text>
            <Text style={styles.buttonSubtext}>{t("scanQrCodeToSend")}</Text>
          </LinearGradient>
        </TouchableOpacity>

        {/* Receive Button */}
        <TouchableOpacity
          style={[
            styles.actionButton,
            { backgroundColor: theme.colors.surface },
          ]}
          onPress={handleReceivePress}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#10B981", "#059669"]}
            style={styles.gradientButton}
          >
            <Ionicons name="qr-code" size={32} color="#FFFFFF" />
            <Text style={styles.buttonText}>{t("receiveMoney")}</Text>
            <Text style={styles.buttonSubtext}>{t("showQrCodeToReceive")}</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>
    </View>
  );

  const renderQRScanner = () => (
    <Modal
      visible={activeMode === "send"}
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
          <Text style={styles.scannerTitle}>{t("scanQrCode")}</Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.cameraContainer}>
          {hasPermission === null ? (
            <View style={styles.permissionContainer}>
              <ActivityIndicator size="large" color="#169BFF" />
              <Text style={styles.permissionText}>
                {t("requestingCameraPermission")}
              </Text>
            </View>
          ) : hasPermission === false ? (
            <View style={styles.permissionContainer}>
              <Ionicons name="camera-outline" size={64} color="#FF6B6B" />
              <Text style={styles.permissionText}>
                {t("cameraPermissionDenied")}
              </Text>
              <TouchableOpacity
                style={styles.permissionButton}
                onPress={getCameraPermissions}
              >
                <Text style={styles.permissionButtonText}>
                  {t("grantPermission")}
                </Text>
              </TouchableOpacity>
            </View>
          ) : (
            <View style={styles.scannerWrapper}>
              <QRCodeScanner
                ref={qrScannerRef}
                onRead={handleBarCodeScanned}
                flashMode={
                  flashMode === "off"
                    ? RNCamera.Constants.FlashMode.off
                    : RNCamera.Constants.FlashMode.torch
                }
                showMarker
                markerStyle={styles.markerStyle}
                cameraStyle={styles.camera}
                topViewStyle={styles.scannerTopView}
                bottomViewStyle={styles.scannerBottomView}
                reactivate={false}
                cameraProps={{
                  captureAudio: false,
                }}
              />

              <View style={styles.scannerOverlay}>
                <Text style={styles.scannerInstruction}>
                  {t("positionQrCodeWithinFrame")}
                </Text>
              </View>

              <View style={styles.scannerBottomContent}>
                <Text style={styles.scannerBottomText}>
                  {t("scanQrCodeToSendMoney")}
                </Text>
              </View>

              <TouchableOpacity
                style={styles.flashButton}
                onPress={toggleFlash}
              >
                <Ionicons
                  name={flashMode === "off" ? "flash-off" : "flash"}
                  size={24}
                  color="#FFFFFF"
                />
              </TouchableOpacity>
            </View>
          )}
        </View>
      </View>
    </Modal>
  );

  const renderQRGenerator = () => (
    <Modal
      visible={activeMode === "receive"}
      animationType="slide"
      onRequestClose={() => setActiveMode(null)}
    >
      <View
        style={[
          styles.qrContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <View style={styles.qrHeader}>
          <TouchableOpacity
            style={styles.closeButton}
            onPress={() => setActiveMode(null)}
          >
            <Ionicons name="close" size={24} color={theme.colors.text} />
          </TouchableOpacity>
          <Text style={[styles.qrTitle, { color: theme.colors.text }]}>
            {t("yourQrCode")}
          </Text>
          <View style={styles.headerSpacer} />
        </View>

        <View style={styles.qrContent}>
          <View
            style={[
              styles.qrCodeContainer,
              { backgroundColor: theme.colors.surface },
            ]}
          >
            <QRCode
              ref={qrCodeRef}
              value={qrData}
              size={250}
              color={theme.colors.text}
              backgroundColor={theme.colors.surface}
            />
          </View>

          <Text
            style={[
              styles.qrInstruction,
              { color: theme.colors.textSecondary },
            ]}
          >
            {t("showThisQrCodeToReceiveMoney")}
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
                  {isSharing ? t("sharing") : t("quickShare")}
                </Text>
              </LinearGradient>
            </TouchableOpacity>
          </View>
        </View>
      </View>
    </Modal>
  );

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
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
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "System",
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
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System",
  },
  subtitle: {
    fontSize: 16,
    textAlign: "center",
    lineHeight: 24,
    marginBottom: 60,
    fontFamily: "System",
  },
  buttonContainer: {
    gap: 20,
  },
  actionButton: {
    borderRadius: 16,
    overflow: "hidden",
    elevation: 4,
    shadowColor: "#000",
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
    alignItems: "center",
    justifyContent: "center",
  },
  buttonText: {
    fontSize: 20,
    fontWeight: "700",
    color: "#FFFFFF",
    marginTop: 12,
    fontFamily: "System",
  },
  buttonSubtext: {
    fontSize: 14,
    color: "#FFFFFF",
    marginTop: 4,
    opacity: 0.9,
    fontFamily: "System",
  },
  // Scanner Styles
  scannerContainer: {
    flex: 1,
    backgroundColor: "#000000",
  },
  scannerHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
    backgroundColor: "rgba(0, 0, 0, 0.8)",
  },
  closeButton: {
    padding: 8,
  },
  scannerTitle: {
    fontSize: 18,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  cameraContainer: {
    flex: 1,
  },
  scannerWrapper: {
    flex: 1,
    position: "relative",
  },
  scannerTopView: {
    flex: 0,
    height: 0,
  },
  scannerBottomView: {
    flex: 0,
    height: 0,
  },
  camera: {
    flex: 1,
    width: "100%",
    height: "100%",
  },
  flashButton: {
    position: "absolute",
    top: 20,
    right: 20,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    borderRadius: 25,
    width: 50,
    height: 50,
    alignItems: "center",
    justifyContent: "center",
  },
  scannerOverlay: {
    position: "absolute",
    top: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scannerInstruction: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    fontFamily: "System",
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  scannerBottomContent: {
    position: "absolute",
    bottom: 50,
    left: 0,
    right: 0,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 20,
  },
  scannerBottomText: {
    color: "#FFFFFF",
    fontSize: 14,
    textAlign: "center",
    fontFamily: "System",
    opacity: 0.8,
    backgroundColor: "rgba(0, 0, 0, 0.6)",
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 8,
  },
  markerStyle: {
    borderColor: "#169BFF",
    borderWidth: 2,
    borderRadius: 12,
  },
  permissionContainer: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  permissionText: {
    color: "#FFFFFF",
    fontSize: 16,
    textAlign: "center",
    marginTop: 20,
    fontFamily: "System",
  },
  permissionButton: {
    backgroundColor: "#169BFF",
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    marginTop: 20,
  },
  permissionButtonText: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  // QR Generator Styles
  qrContainer: {
    flex: 1,
  },
  qrHeader: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingTop: 50,
    paddingBottom: 20,
  },
  qrTitle: {
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "System",
  },
  qrContent: {
    flex: 1,
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 40,
  },
  qrCodeContainer: {
    padding: 20,
    borderRadius: 16,
    elevation: 4,
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 2,
    },
    shadowOpacity: 0.1,
    shadowRadius: 8,
  },
  qrInstruction: {
    fontSize: 16,
    textAlign: "center",
    marginTop: 30,
    marginBottom: 40,
    fontFamily: "System",
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    width: "100%",
  },
  shareButton: {
    borderRadius: 12,
    overflow: "hidden",
    flex: 1,
  },
  quickShareButton: {
    flex: 2,
  },
  moreOptionsButton: {
    flex: 1,
  },
  shareGradient: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    paddingHorizontal: 16,
    paddingVertical: 14,
  },
  shareButtonText: {
    color: "#FFFFFF",
    fontSize: 14,
    fontWeight: "600",
    marginLeft: 6,
    fontFamily: "System",
  },
});

export default QrCodeSendRecive;

