import React, { useState } from "react";
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
  Dimensions,
  StatusBar,
  Modal,
} from "react-native";
import { useTheme } from "../context/ThemeContext";
import AntDesign from "react-native-vector-icons/AntDesign";
import Ionicons from "react-native-vector-icons/Ionicons";
import LinearGradient from "react-native-linear-gradient";

const { width, height } = Dimensions.get("window");

const ApplyCardView = ({ navigation, route }) => {
  const { theme } = useTheme();
  const [showSuccessModal, setShowSuccessModal] = useState(false);

  // Get data from navigation params
  const selectedColor = route?.params?.selectedColor || {
    id: 2,
    name: "Green",
    gradient: ["#10B981", "#059669"],
  };
  const cardType = route?.params?.cardType || "Physical";
  const cardTitle = route?.params?.cardTitle || "Card Title";
  const cardPlaceholder =
    route?.params?.cardPlaceholder || "Card Placeholder Text";

  // Card pricing
  const cardPrice = "$25.00";
  const cardFee = "$5.00";
  const totalAmount = "$30.00";

  // Render card preview
  const renderCardPreview = () => (
    <View style={styles.cardPreviewContainer}>
      <LinearGradient
        colors={selectedColor.gradient}
        start={{ x: 0, y: 0 }}
        end={{ x: 1, y: 1 }}
        style={styles.cardPreview}
      >
        {/* Card Chip */}
        <View style={styles.cardChip}>
          <View style={styles.chipLines} />
        </View>

        {/* Card Title */}
        <View style={styles.cardTitleContainer}>
          <Text style={styles.cardTitleText}>{cardTitle}</Text>
        </View>

        {/* Card Number */}
        <View style={styles.cardNumberContainer}>
          <Text style={styles.cardNumberText}>1234 5678 9012 3456</Text>
        </View>

        {/* Card Details Row */}
        <View style={styles.cardDetailsRow}>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>CARD HOLDER</Text>
            <Text style={styles.cardDetailValue}>
              {cardPlaceholder ?? "JOHN DOE"}
            </Text>
          </View>
          <View style={styles.cardDetailItem}>
            <Text style={styles.cardDetailLabel}>EXPIRES</Text>
            <Text style={styles.cardDetailValue}>12/25</Text>
          </View>
        </View>

        {/* Card Placeholder Text */}
        {/* <View style={styles.cardPlaceholderContainer}>
          <Text style={styles.cardPlaceholderText}>{cardPlaceholder}</Text>
        </View> */}
      </LinearGradient>
    </View>
  );

  // Handle apply button press
  const handleApply = () => {
    // Handle card application submission
    console.log("Card application submitted:", {
      selectedColor: selectedColor.name,
      cardTitle,
      cardPlaceholder,
      cardPrice,
      cardFee,
      totalAmount,
    });
    // Show success modal
    setShowSuccessModal(true);
  };

  // Handle success modal close
  const handleCloseSuccessModal = () => {
    setShowSuccessModal(false);
    // Navigate back after closing modal
    navigation.goBack();
  };

  // Render Success Modal
  const renderSuccessModal = () => (
    <Modal
      visible={showSuccessModal}
      transparent
      animationType="fade"
      onRequestClose={handleCloseSuccessModal}
    >
      <View style={styles.modalOverlay}>
        <TouchableOpacity
          style={styles.modalBackdrop}
          activeOpacity={1}
          onPress={handleCloseSuccessModal}
        />
        <View style={[styles.modalContainer, { backgroundColor: theme.colors.surface }]}>
          {/* Drag Handle */}
          {/* <View style={[styles.dragHandle, { backgroundColor: theme.colors.border }]} /> */}
          
          {/* Success Icon */}
          <View style={[styles.successIconContainer, { backgroundColor: theme.colors.success || '#10B981' }]}>
            <Ionicons name="checkmark" size={44} color="#FFFFFF" />
          </View>

          {/* Success Title */}
          <Text style={[styles.successTitle, { color: theme.colors.text }]}>
            Card Applied Successfully!
          </Text>

          {/* Success Message */}
          <Text style={[styles.successMessage, { color: theme.colors.textSecondary }]}>
            Your card application has been submitted successfully. You will receive a confirmation email shortly.
          </Text>

          {/* Close Button */}
          <TouchableOpacity
            style={styles.closeButton}
            onPress={handleCloseSuccessModal}
            activeOpacity={0.8}
          >
            <LinearGradient
              colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
              start={{ x: 0, y: 0 }}
              end={{ x: 1.5, y: 0.5 }}
              style={styles.gradientButton}
            >
              <Text style={styles.closeButtonText}>Done</Text>
            </LinearGradient>
          </TouchableOpacity>
        </View>
      </View>
    </Modal>
  );

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
          Review Card
        </Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView
        style={styles.scrollView}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.scrollContent}
      >
        {/* Card Preview */}
        {renderCardPreview()}

        {/* Card Details Section */}
        <View
          style={[
            styles.detailsSection,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Card Details
          </Text>

          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Card Color
            </Text>
            <View style={styles.colorBadge}>
              <LinearGradient
                colors={selectedColor.gradient}
                start={{ x: 0, y: 0 }}
                end={{ x: 1, y: 1 }}
                style={styles.colorBadgeGradient}
              >
                <Text style={styles.colorBadgeText}>{selectedColor.name}</Text>
              </LinearGradient>
            </View>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Card Type
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {cardType} Card
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Card Title
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {cardTitle}
            </Text>
          </View>

          <View style={styles.detailRow}>
            <Text
              style={[
                styles.detailLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Placeholder Text
            </Text>
            <Text style={[styles.detailValue, { color: theme.colors.text }]}>
              {cardPlaceholder}
            </Text>
          </View>
        </View>

        {/* Pricing Section */}
        <View
          style={[
            styles.pricingSection,
            {
              backgroundColor: theme.colors.surface,
              shadowColor: "#000",
              shadowOffset: {
                width: 0,
                height: 2,
              },
              shadowOpacity: 0.2,
              shadowRadius: 2,
              elevation: 2,
            },
          ]}
        >
          <Text style={[styles.sectionTitle, { color: theme.colors.text }]}>
            Pricing
          </Text>

          <View style={styles.pricingRow}>
            <Text
              style={[
                styles.pricingLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Card Price
            </Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>
              {cardPrice}
            </Text>
          </View>

          <View style={styles.pricingRow}>
            <Text
              style={[
                styles.pricingLabel,
                { color: theme.colors.textSecondary },
              ]}
            >
              Card Fee
            </Text>
            <Text style={[styles.pricingValue, { color: theme.colors.text }]}>
              {cardFee}
            </Text>
          </View>

          <View
            style={[styles.divider, { backgroundColor: theme.colors.border }]}
          />

          <View style={styles.totalRow}>
            <Text style={[styles.totalLabel, { color: theme.colors.text }]}>
              Total Amount
            </Text>
            <Text
              style={[
                styles.totalValue,
                { color: theme.colors.primary || "#1AA5FF" },
              ]}
            >
              {totalAmount}
            </Text>
          </View>
        </View>
      </ScrollView>

      {/* Apply Button */}
      <View
        style={[
          styles.buttonContainer,
          { backgroundColor: theme.colors.background },
        ]}
      >
        <TouchableOpacity
          style={styles.applyButton}
          onPress={handleApply}
          activeOpacity={0.8}
        >
          <LinearGradient
            colors={["#1AA5FF", "#6B22E7", "#6B22E7", "#6B22E7"]}
            start={{ x: 0, y: 0 }}
            end={{ x: 1.5, y: 0.5 }}
            style={styles.gradientButton}
          >
            <Text style={styles.applyButtonText}>Apply Card</Text>
          </LinearGradient>
        </TouchableOpacity>
      </View>

      {/* Success Modal */}
      {renderSuccessModal()}
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
  scrollView: {
    flex: 1,
  },
  scrollContent: {
    paddingBottom: 100,
  },
  cardPreviewContainer: {
    paddingHorizontal: 20,
    marginTop: 20,
    marginBottom: 30,
  },
  cardPreview: {
    width: "100%",
    height: 220,
    borderRadius: 16,
    padding: 20,
    justifyContent: "space-between",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: 4,
    },
    shadowOpacity: 0.3,
    shadowRadius: 8,
    elevation: 8,
  },
  cardChip: {
    width: 50,
    height: 35,
    backgroundColor: "rgba(255, 255, 255, 0.3)",
    borderRadius: 6,
    justifyContent: "center",
    alignItems: "center",
  },
  chipLines: {
    width: 30,
    height: 4,
    backgroundColor: "rgba(255, 255, 255, 0.5)",
    borderRadius: 2,
  },
  cardTitleContainer: {
    marginTop: 10,
  },
  cardTitleText: {
    fontSize: 18,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  cardNumberContainer: {
    marginTop: 15,
  },
  cardNumberText: {
    fontSize: 24,
    fontWeight: "700",
    color: "#FFFFFF",
    letterSpacing: 2,
    fontFamily: "System",
  },
  cardDetailsRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    marginTop: 20,
  },
  cardDetailItem: {
    flex: 1,
  },
  cardDetailLabel: {
    fontSize: 10,
    fontWeight: "600",
    color: "rgba(255, 255, 255, 0.7)",
    marginBottom: 4,
    fontFamily: "System",
  },
  cardDetailValue: {
    fontSize: 14,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  cardPlaceholderContainer: {
    marginTop: 15,
    paddingTop: 10,
    borderTopWidth: 1,
    borderTopColor: "rgba(255, 255, 255, 0.2)",
  },
  cardPlaceholderText: {
    fontSize: 12,
    fontWeight: "500",
    color: "rgba(255, 255, 255, 0.9)",
    fontFamily: "System",
    lineHeight: 18,
  },
  detailsSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: "700",
    marginBottom: 20,
    fontFamily: "System",
  },
  detailRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  detailLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "System",
  },
  detailValue: {
    fontSize: 16,
    fontWeight: "600",
    flex: 1,
    textAlign: "right",
    fontFamily: "System",
  },
  colorBadge: {
    borderRadius: 20,
    overflow: "hidden",
  },
  colorBadgeGradient: {
    paddingHorizontal: 16,
    paddingVertical: 6,
    borderRadius: 20,
    alignItems: "center",
    justifyContent: "center",
  },
  colorBadgeText: {
    fontSize: 12,
    fontWeight: "600",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  pricingSection: {
    marginHorizontal: 20,
    marginBottom: 20,
    borderRadius: 16,
    padding: 20,
  },
  pricingRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 12,
  },
  pricingLabel: {
    fontSize: 16,
    fontWeight: "500",
    fontFamily: "System",
  },
  pricingValue: {
    fontSize: 16,
    fontWeight: "600",
    fontFamily: "System",
  },
  divider: {
    height: 1,
    marginVertical: 16,
  },
  totalRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  totalLabel: {
    fontSize: 16,
    fontWeight: "700",
    fontFamily: "System",
  },
  totalValue: {
    fontSize: 20,
    fontWeight: "700",
    fontFamily: "System",
  },
  buttonContainer: {
    paddingHorizontal: 20,
    paddingVertical: 16,
    // borderTopWidth: 1,
    // borderTopColor: "rgba(0, 0, 0, 0.1)",
  },
  applyButton: {
    width: "100%",
    marginBottom:20
  },
  gradientButton: {
    paddingVertical: 16,
    borderRadius: 12,
    alignItems: "center",
    justifyContent: "center",
  },
  applyButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
  // Success Modal Styles
  modalOverlay: {
    flex: 1,
    justifyContent: "flex-end",
    backgroundColor: "rgba(0, 0, 0, 0.5)",
  },
  modalBackdrop: {
    position: "absolute",
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
  },
  modalContainer: {
    width: "100%",
    borderTopLeftRadius: 35,
    borderTopRightRadius: 35,
    padding: 30,
    paddingBottom: 40,
    alignItems: "center",
    shadowColor: "#000",
    shadowOffset: {
      width: 0,
      height: -2,
    },
    shadowOpacity: 0.3,
    shadowRadius: 20,
    elevation: 10,
  },
  dragHandle: {
    width: 40,
    height: 4,
    borderRadius: 2,
    alignSelf: "center",
    marginTop: 8,
    marginBottom: 20,
  },
  successIconContainer: {
    width: 70,
    height: 70,
    borderRadius: 60,
    justifyContent: "center",
    alignItems: "center",
    marginBottom: 24,
  },
  successTitle: {
    fontSize: 24,
    fontWeight: "700",
    textAlign: "center",
    marginBottom: 12,
    fontFamily: "System",
  },
  successMessage: {
    fontSize: 16,
    textAlign: "center",
    marginBottom: 30,
    lineHeight: 24,
    paddingHorizontal: 10,
    fontFamily: "System",
  },
  closeButton: {
    width: "100%",
  },
  closeButtonText: {
    fontSize: 16,
    fontWeight: "700",
    color: "#FFFFFF",
    fontFamily: "System",
  },
});

export default ApplyCardView;
