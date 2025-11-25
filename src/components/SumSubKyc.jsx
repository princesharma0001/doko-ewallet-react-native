import React, { useCallback, useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ActivityIndicator,
  Image,
} from "react-native";
import SNSMobileSDK from "@sumsub/react-native-mobilesdk-module";
import Toast from "react-native-toast-message";
import { useTheme } from "../context/ThemeContext";
import { authService } from "../services/apiService";
import ApiConfig from "../context/Endpoint";
import AsyncStorage from "@react-native-async-storage/async-storage";
import { SafeAreaView } from "react-native-safe-area-context";
import { useNavigation } from "@react-navigation/native";

/**
 * SumSubKyc provides a ready-to-use launcher for the SumSub Mobile SDK.
 *
 * Props:
 * - fetchAccessToken: () => Promise<string>
 *       A function that must return a valid SumSub applicant token.
 *       It is called once before launch and whenever SumSub requests a refresh.
 * - onComplete: (result) => void
 *       Called when the SDK resolves successfully.
 * - onError: (error) => void
 *       Called when the SDK rejects or setup fails.
 * - onStatusChanged: (event) => void
 *       Optional callback for SDK status updates.
 * - buttonText: optional CTA label.
 * - style: optional container styles.
 */
const SumSubKyc = ({
  fetchAccessToken,
  onComplete,
  onError,
  onStatusChanged,
  buttonText = "Verify Identity",
  style,
}) => {
  const { theme } = useTheme();
  const [isLaunching, setIsLaunching] = useState(false);
const navigation = useNavigation();
  const requestTokenFromApi = useCallback(async () => {
    let response;

    if (authService?.startKyc) {
      response = await authService.startKyc();
      console.log("Asdgasfgas", response);
    } else {
      const storedToken = await AsyncStorage.getItem("dokoToken");

      const fallback = await fetch(ApiConfig.startKyc, {
        method: "POST",
        headers: {
          accept: "application/json",
          "Content-Type": "application/json",
          Authorization: `Bearer ${storedToken}`,
        },
      });
      const payload = await fallback.json();
      console.log("payloadpayloadpayload", payload);

      response = {
        success: payload?.error === false || payload?.error === "false",
        data: payload?.data,
        message: payload?.message,
        error: payload?.error,
      };
    }

    if (!response?.success) {
      throw new Error(
        response?.error || response?.message || "Unable to start KYC"
      );
    }

    const token = response.data?.accessToken;
    if (!token) {
      throw new Error("KYC token not returned by server");
    }
    return token;
  }, []);

  const resolveAccessToken = useCallback(async () => {
    if (typeof fetchAccessToken === "function") {
      const token = await fetchAccessToken();
      if (!token || typeof token !== "string") {
        throw new Error(
          "fetchAccessToken must resolve to a non-empty token string"
        );
      }
      return token;
    }
    return requestTokenFromApi();
  }, [fetchAccessToken, requestTokenFromApi]);

  const buildSdk = useCallback(
    async (token) =>
      SNSMobileSDK.init(token, resolveAccessToken)
        .withHandlers({
          onStatusChanged: (event) => {
            if (onStatusChanged) {
              
              onStatusChanged(event);
            }
            console.log("adfsdfsdf",event.newStatus);
            if(event.newStatus ==="Approved"){
              // navigation.navigate("HomeScreen")
              navigation.reset({
                index: 0,
                routes: [{ name: "HomeScreen" }],
              });
              
            }
            
            console.log(
              `[SumSub] status: ${event.prevStatus || "unknown"} -> ${
                event.newStatus
              }`
            );
          },
          onLog: (event) => console.log(`[SumSub] ${event.message}`),
        })
        .withDebug(__DEV__)
        .build(),
    [onStatusChanged, resolveAccessToken]
  );

  const launchSdk = useCallback(async () => {
    try {
      setIsLaunching(true);
      const token = await resolveAccessToken();
      const sdk = await buildSdk(token);
      const result = await sdk.launch();

      if (onComplete) {
        onComplete(result);
      }
    } catch (err) {
      console.error("SumSub SDK error", err);
      Toast.show({
        type: "error",
        text1: "Verification failed",
        text2: err?.message || "Unable to launch identity verification",
      });
      if (onError) {
        onError(err);
      }
    } finally {
      setIsLaunching(false);
    }
  }, [buildSdk, onComplete, onError, resolveAccessToken]);

  return (
    <SafeAreaView style={{flex:1}}>
      <View style={[styles.container, style]}>
        <View style={{paddingVertical:20,flexDirection:'row',justifyContent:'center'}}>
        <Image source={require("../assets/Images/sumsub.png")} style={{width:120,height:130}} />

        </View>
        <Text style={[styles.title, { color: theme.colors.text }]}>
          Complete your identity verification
        </Text>
        <Text style={[styles.subtitle, { color: theme.colors.textSecondary }]}>
          We use SumSub to keep your account secure.
        </Text>

        <TouchableOpacity
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          activeOpacity={0.85}
          onPress={launchSdk}
          disabled={isLaunching}
        >
          {isLaunching ? (
            <ActivityIndicator color="#fff" />
          ) : (
            <Text style={styles.buttonLabel}>{buttonText}</Text>
          )}
        </TouchableOpacity>
      </View>
    </SafeAreaView>
  );
};

const styles = StyleSheet.create({
  container: {
    padding: 24,
    borderRadius: 16,
    backgroundColor: "rgba(255,255,255,0.04)",
    flex:1,
    justifyContent:'center'
  },
  title: {
    fontSize: 18,
    fontWeight: "600",
    marginBottom: 6,
    textAlign:'center',

  },
  subtitle: {
    fontSize: 14,
    marginBottom: 16,
    textAlign:'center',
  },
  button: {
    height: 48,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
    marginTop:30
  },
  buttonLabel: {
    color: "#FFFFFF",
    fontSize: 16,
    fontWeight: "600",
  },
});

export default SumSubKyc;
