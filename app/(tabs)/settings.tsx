import { useEffect, useState } from "react";
import { ScrollView, View, StyleSheet } from "react-native";
import { Text } from "@/components/ThemedText";
import ExpoFoundationModelsModule, {
  FoundationModelsAvailability,
} from "@/modules/expo-foundation-models";

export default function Settings() {
  const [availability, setAvailability] =
    useState<FoundationModelsAvailability | null>(null);

  useEffect(() => {
    ExpoFoundationModelsModule.checkAvailability().then(setAvailability);
  }, []);

  return (
    <ScrollView 
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.content}>
        <Text size="header" style={styles.title}>Settings</Text>
        
        <View style={styles.section}>
          <Text size="caption" style={styles.sectionTitle}>MODEL STATUS</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Available</Text>
            <Text style={styles.value}>
              {availability?.isAvailable ? "Yes" : "No"}
            </Text>
          </View>
          
          {availability?.reason && (
            <View style={styles.row}>
              <Text style={styles.label}>Status</Text>
              <Text style={styles.value}>{availability.reason}</Text>
            </View>
          )}
        </View>

        <View style={styles.section}>
          <Text size="caption" style={styles.sectionTitle}>SYSTEM INFO</Text>
          <View style={styles.row}>
            <Text style={styles.label}>Device</Text>
            <Text style={styles.value}>
              {availability?.deviceSupported ? "Supported" : "Not Supported"}
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>OS</Text>
            <Text style={styles.value}>
              {availability?.osVersion || "—"}
            </Text>
          </View>
          
          <View style={styles.row}>
            <Text style={styles.label}>Framework</Text>
            <Text style={styles.value}>
              {availability?.frameworkVersion || "—"}
            </Text>
          </View>
        </View>
      </View>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    padding: 20,
  },
  title: {
    marginBottom: 32,
  },
  section: {
    marginBottom: 32,
  },
  sectionTitle: {
    opacity: 0.6,
    marginBottom: 16,
  },
  row: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 12,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: 'rgba(128, 128, 128, 0.2)',
  },
  label: {
    opacity: 0.8,
  },
  value: {
    fontWeight: '500',
  },
});
