import ExpoFoundationModelsModule from "@/modules/expo-foundation-models";
import { FoundationModelsAvailability } from "@/modules/expo-foundation-models/src/ExpoFoundationModels.types";
import React, { useEffect, useState } from "react";
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
    checkAvailability();
  }, []);

  const checkAvailability = async () => {
    try {
      setLoading(true);
      setError(null);
      const result = await ExpoFoundationModelsModule.checkAvailability();
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
        <Text style={styles.title}>Foundation Models Availability</Text>

        <View style={styles.card}>
          {loading ? (
            <View style={styles.loadingContainer}>
              <ActivityIndicator size="large" color="#007AFF" />
              <Text style={styles.loadingText}>Checking availability...</Text>
            </View>
          ) : error ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Error: {error}</Text>
              <Button title="Retry" onPress={checkAvailability} />
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

        <View style={styles.actionCard}>
          <Button title="Refresh Status" onPress={checkAvailability} />
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
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 30,
  },
  card: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  actionCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
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
});
