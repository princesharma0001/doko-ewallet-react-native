import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  TextInput,
  StatusBar,
  KeyboardAvoidingView,
  Platform,
  Alert,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const PayoutDetailsForm = ({ navigation, route }) => {
  const { theme } = useTheme();

  // State
  const [amount, setAmount] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [notes, setNotes] = useState("");

  // Validation errors
  const [errors, setErrors] = useState({
    amount: "",
    walletAddress: "",
    notes: "",
  });

  // Validate amount
  const validateAmount = (value) => {
    if (!value.trim()) return "Amount is required";
    const numValue = parseFloat(value);
    if (isNaN(numValue)) return "Amount must be a valid number";
    if (numValue <= 0) return "Amount must be greater than 0";
    if (numValue > 1000000) return "Amount cannot exceed 1,000,000";
    return "";
  };

  // Validate wallet address
  const validateWalletAddress = (address) => {
    if (!address.trim()) return "Wallet address is required";
    if (address.trim().length < 10)
      return "Wallet address must be at least 10 characters";
    if (address.trim().length > 100)
      return "Wallet address cannot exceed 100 characters";
    // Basic validation for wallet address format (alphanumeric and some special chars)
    if (!/^[a-zA-Z0-9]+$/.test(address.trim())) {
      return "Wallet address must contain only alphanumeric characters";
    }
    return "";
  };

  // Validate notes
  const validateNotes = (note) => {
    if (!note.trim()) return "Notes are required";
    if (note.trim().length < 5) return "Notes must be at least 5 characters";
    if (note.trim().length > 500) return "Notes cannot exceed 500 characters";
    return "";
  };

  // Handle input changes with validation
  const handleAmountChange = (text) => {
    // Allow only numbers and one decimal point
    const cleaned = text.replace(/[^0-9.]/g, "");
    // Ensure only one decimal point
    const parts = cleaned.split(".");
    const formatted =
      parts.length > 2 ? parts[0] + "." + parts.slice(1).join("") : cleaned;

    setAmount(formatted);
    setErrors({ ...errors, amount: validateAmount(formatted) });
  };

  const handleWalletAddressChange = (text) => {
    setWalletAddress(text);
    setErrors({ ...errors, walletAddress: validateWalletAddress(text) });
  };

  const handleNotesChange = (text) => {
    setNotes(text);
    setErrors({ ...errors, notes: validateNotes(text) });
  };

  // Validate all fields
  const validateAll = () => {
    const newErrors = {
      amount: validateAmount(amount),
      walletAddress: validateWalletAddress(walletAddress),
      notes: validateNotes(notes),
    };
    setErrors(newErrors);
    return !Object.values(newErrors).some((error) => error !== "");
  };

  // Handle submit button press
  const handleSubmit = () => {
    if (validateAll()) {
      // Handle payout submission
      console.log("Payout details submitted:", {
        amount,
        walletAddress,
        notes,
      });
      // You can navigate to confirmation screen or handle success
      // navigation.navigate('PayoutConfirmation', { amount, walletAddress, notes });
      Alert.alert("Success", "Payout request submitted successfully!");
    }
  };

  return (
    <View
      style={[styles.container, { backgroundColor: theme.colors.background }]}
    >
      <StatusBar
        barStyle={theme.isDarkMode ? "light-content" : "dark-content"}
        backgroundColor={theme.colors.background}
      />

      {/* Header with Back Icon */}
      <View style={styles.header}>
        <TouchableOpacity
          onPress={() => navigation.goBack()}
          style={styles.backButton}
          activeOpacity={0.7}
        >
          <AntDesign name="arrowleft" size={24} color={theme.colors.text} />
        </TouchableOpacity>
        <Text style={[styles.headerTitle, { color: theme.colors.text }]}>
          Payout Details
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <KeyboardAvoidingView
        style={styles.keyboardAvoidView}
        behavior={Platform.OS === "ios" ? "padding" : "height"}
        keyboardVerticalOffset={Platform.OS === "ios" ? 0 : 20}
      >
        <ScrollView
          style={styles.scrollView}
          showsVerticalScrollIndicator={false}
          contentContainerStyle={styles.scrollContent}
          keyboardShouldPersistTaps="handled"
        >
          {/* Form Inputs */}
          <View style={styles.formContainer}>
            {/* Amount Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Amount <Text style={styles.required}>*</Text>
              </Text>
              {/* <TextInput
                  style={[
                    styles.input,
                    {
                      backgroundColor: theme.colors.surface,
                      color: theme.colors.text,
                      borderColor: errors.amount
                        ? theme.colors.error || "#FF1A1A"
                        : theme.colors.border,
                    },
                  ]}
                  placeholder="0.00"
                  placeholderTextColor={theme.colors.textSecondary}
                  value={amount}
                  onChangeText={handleAmountChange}
                  keyboardType="decimal-pad"
                /> */}
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    borderColor: errors.amount
                      ? theme.colors.error || "#FF1A1A"
                      : theme.colors.border,
                  },
                ]}
                placeholder="Enter amount"
                placeholderTextColor={theme.colors.textSecondary}
                value={amount}
                onChangeText={handleAmountChange}
                keyboardType="decimal-pad"
              />
              {errors.amount ? (
                <Text style={styles.errorText}>{errors.amount}</Text>
              ) : null}
            </View>

            {/* Wallet Address Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Wallet Address <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    borderColor: errors.walletAddress
                      ? theme.colors.error || "#FF1A1A"
                      : theme.colors.border,
                  },
                ]}
                placeholder="Enter wallet address"
                placeholderTextColor={theme.colors.textSecondary}
                value={walletAddress}
                onChangeText={handleWalletAddressChange}
                autoCapitalize="none"
                autoCorrect={false}
              />
              {errors.walletAddress ? (
                <Text style={styles.errorText}>{errors.walletAddress}</Text>
              ) : null}
            </View>

            {/* Notes Input */}
            <View style={styles.inputGroup}>
              <Text style={[styles.inputLabel, { color: theme.colors.text }]}>
                Notes <Text style={styles.required}>*</Text>
              </Text>
              <TextInput
                style={[
                  styles.input,
                  styles.textArea,
                  {
                    backgroundColor: theme.colors.surface,
                    color: theme.colors.text,
                    borderColor: errors.notes
                      ? theme.colors.error || "#FF1A1A"
                      : theme.colors.border,
                  },
                ]}
                placeholder="Enter notes (minimum 5 characters)"
                placeholderTextColor={theme.colors.textSecondary}
                value={notes}
                onChangeText={handleNotesChange}
                multiline
                numberOfLines={4}
                textAlignVertical="top"
              />
              <Text
                style={[
                  styles.characterCount,
                  { color: theme.colors.textSecondary },
                ]}
              >
                {notes.length}/500
              </Text>
              {errors.notes ? (
                <Text style={styles.errorText}>{errors.notes}</Text>
              ) : null}
            </View>
          </View>
        </ScrollView>

        {/* Submit Button */}
        <View
          style={[
            styles.buttonContainer,
            { backgroundColor: theme.colors.background },
          ]}
        >
          <TouchableOpacity
            style={styles.submitButton}
            onPress={handleSubmit}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.5, y: 0.5 }}
              style={styles.gradientButton}
            >
              <Text style={styles.submitButtonText}>Submit Payout</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </KeyboardAvoidingView>
    </View>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    paddingTop: 40,
  },
  header: {
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "space-between",
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  backButton: {
    padding: 8,
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "System",
  },
  keyboardAvoidView: {
    flex: 1,
  },
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  formContainer: {
    paddingHorizontal: 20,
    paddingTop: 20,
  },
  inputGroup: {
    marginBottom: 24,
  },
  inputLabel: {
    fontSize: 16,
    fontWeight: "600",
    marginBottom: 8,
    fontFamily: "System",
  },
  required: {
    color: "#FF1A1A",
  },
  amountInputContainer: {
    flexDirection: "row",
    alignItems: "center",
    borderWidth: 1,
    borderRadius: 12,
    overflow: "hidden",
  },
  currencySymbol: {
    fontSize: 18,
    fontWeight: "700",
    paddingHorizontal: 16,
    paddingVertical: 14,
    backgroundColor: "rgba(0, 0, 0, 0.05)",
    fontFamily: "System",
  },
  amountInput: {
    flex: 1,
    borderWidth: 0,
    borderRadius: 0,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 18,
    fontWeight: "600",
    fontFamily: "System",
  },
  input: {
    borderWidth: 1,
    borderRadius: 12,
    paddingHorizontal: 16,
    paddingVertical: 14,
    fontSize: 16,
    fontFamily: "System",
  },
  textArea: {
    minHeight: 100,
    paddingTop: 14,
    paddingBottom: 14,
  },
  characterCount: {
    fontSize: 12,
    marginTop: 4,
    textAlign: "right",
    fontFamily: "System",
  },
  errorText: {
    color: "#FF1A1A",
    fontSize: 12,
    marginTop: 4,
    fontFamily: "System",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    // borderTopWidth: 1,
    // borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  submitButton: {
    width: "100%",
    marginBottom:20
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  submitButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
});

export default PayoutDetailsForm;
