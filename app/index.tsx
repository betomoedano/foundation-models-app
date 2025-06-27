import ExpoFoundationModelsModule from "@/modules/expo-foundation-models";
import { FoundationModelsAvailability } from "@/modules/expo-foundation-models/src/ExpoFoundationModels.types";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  View,
} from "react-native";

export default function Index() {
  const [availability, setAvailability] =
    useState<FoundationModelsAvailability | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    checkFoundationModelsAvailability();
  }, []);

  const checkFoundationModelsAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ExpoFoundationModelsModule.checkAvailability();
      console.log("Availability", JSON.stringify(result, null, 2));
      setAvailability(result);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to check availability"
      );
    } finally {
      setLoading(false);
    }
  };

  const getStatusColor = () => {
    if (!availability) return "#666";
    return availability.isAvailable ? "#28a745" : "#dc3545";
  };

  const getStatusText = () => {
    if (!availability) return "Unknown";
    return availability.isAvailable ? "Available" : "Not Available";
  };

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        {/* Header */}
        <View style={styles.header}>
          <Text style={styles.title}>Foundation Models Demo App</Text>
          <Text style={styles.subtitle}>
            Demonstrating Apple&apos;s Foundation Models integration with Expo
          </Text>
        </View>

        {/* Availability Status */}
        <View style={styles.statusCard}>
          <Text style={styles.cardTitle}>Foundation Models Status</Text>

          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Checking availability...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
              <Button
                title="Retry"
                onPress={checkFoundationModelsAvailability}
              />
            </View>
          ) : availability ? (
            <View style={styles.statusDetails}>
              <View style={styles.statusRow}>
                <Text style={styles.label}>Status:</Text>
                <Text style={[styles.status, { color: getStatusColor() }]}>
                  {getStatusText()}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.label}>Device Supported:</Text>
                <Text style={styles.value}>
                  {availability.deviceSupported ? "Yes" : "No"}
                </Text>
              </View>

              <View style={styles.statusRow}>
                <Text style={styles.label}>OS Version:</Text>
                <Text style={styles.value}>{availability.osVersion}</Text>
              </View>

              {availability.frameworkVersion && (
                <View style={styles.statusRow}>
                  <Text style={styles.label}>Framework Version:</Text>
                  <Text style={styles.value}>
                    {availability.frameworkVersion}
                  </Text>
                </View>
              )}

              {availability.reason && (
                <View style={styles.reasonContainer}>
                  <Text style={styles.reasonLabel}>Details:</Text>
                  <Text style={styles.reasonText}>{availability.reason}</Text>
                </View>
              )}
            </View>
          ) : null}
        </View>

        {/* Developer Information */}
        <View style={styles.infoCard}>
          <Text style={styles.cardTitle}>Developer Information</Text>
          <Text style={styles.infoText}>
            This demo app showcases the integration of Apple&apos;s Foundation
            Models framework with React Native through Expo Modules API.
          </Text>
          <Text style={styles.infoText}>
            • Primary Focus: iOS 26+ with Apple Intelligence
          </Text>
          <Text style={styles.infoText}>
            • Android/Web: Returns &quot;not implemented&quot; messages
          </Text>
          <Text style={styles.infoText}>
            • Built with Expo Modules API for cross-platform compatibility
          </Text>
        </View>

        {/* Quick Actions */}
        <View style={styles.actionsCard}>
          <Text style={styles.cardTitle}>Quick Actions</Text>
          <View style={styles.buttonContainer}>
            <Button
              title="Refresh Status"
              onPress={checkFoundationModelsAvailability}
            />
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  content: {
    padding: 20,
  },
  header: {
    alignItems: "center",
    marginBottom: 30,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginTop: 8,
  },
  statusCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  actionsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.1,
    shadowRadius: 4,
    elevation: 3,
  },
  cardTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 15,
  },
  loadingContainer: {
    alignItems: "center",
    padding: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorContainer: {
    alignItems: "center",
    padding: 20,
  },
  errorText: {
    color: "#dc3545",
    marginBottom: 15,
    textAlign: "center",
  },
  statusDetails: {
    gap: 12,
  },
  statusRow: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
  },
  label: {
    fontSize: 16,
    fontWeight: "500",
    color: "#333",
    flex: 1,
  },
  status: {
    fontSize: 16,
    fontWeight: "bold",
    flex: 1,
    textAlign: "right",
  },
  value: {
    fontSize: 16,
    color: "#666",
    flex: 1,
    textAlign: "right",
  },
  reasonContainer: {
    marginTop: 15,
    padding: 15,
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
  },
  reasonLabel: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 5,
  },
  reasonText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginBottom: 8,
  },
  buttonContainer: {
    marginBottom: 10,
  },
});
