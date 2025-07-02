import { Text } from "@/components/ThemedText";
import { useGradualAnimation } from "@/components/useGradualAnimation";
import { useThemedColors } from "@/components/useThemedColors";
import { useFoundationModelsStructuredStreaming } from "@/hooks/useFoundationModelsStructuredStreaming";
import React, { useState } from "react";
import {
  ActivityIndicator,
  Pressable,
  ScrollView,
  StyleSheet,
  TextInput,
  View,
} from "react-native";
import Animated, { useAnimatedStyle } from "react-native-reanimated";

export default function StreamingStructuredScreen() {
  const { height } = useGradualAnimation();
  const [prompt, setPrompt] = useState(
    "Create a premium wireless headphone product"
  );
  const colors = useThemedColors();
  
  const {
    data: streamingData,
    loading,
    error,
    isPartial,
    startStreaming,
    cancelStreaming,
    reset,
  } = useFoundationModelsStructuredStreaming();


  const keyboardPadding = useAnimatedStyle(() => {
    return {
      height: height.value,
    };
  }, []);

  const handleStartStreaming = async () => {
    if (!prompt.trim()) return;
    await startStreaming(prompt);
  };

  const clearChat = () => {
    setPrompt("Create a premium wireless headphone product");
    reset();
  };

  const formatProductData = (data: any) => {
    if (!data) return null;

    return (
      <View style={[styles.productCard, { borderColor: colors.border }]}>
        {data.name && (
          <Text size="header" style={styles.productName}>{data.name}</Text>
        )}
        
        {data.price && (
          <Text style={[styles.productPrice, { color: colors.accent }]}>
            ${data.price.toFixed(2)}
          </Text>
        )}
        
        {data.category && (
          <View style={[styles.categoryBadge, { backgroundColor: colors.buttonBackground }]}>
            <Text size="caption" style={[styles.categoryText, { color: colors.buttonText }]}>
              {data.category.toUpperCase()}
            </Text>
          </View>
        )}
        
        {data.description && (
          <Text style={[styles.productDescription, { color: colors.textSecondary }]}>
            {data.description}
          </Text>
        )}
        
        {data.features && data.features.length > 0 && (
          <View style={styles.featuresSection}>
            <Text size="caption" style={[styles.featuresLabel, { color: colors.textSecondary }]}>
              FEATURES
            </Text>
            {data.features.map((feature: string, index: number) => (
              <View key={index} style={styles.featureRow}>
                <Text style={styles.featureBullet}>•</Text>
                <Text style={styles.featureText}>{feature}</Text>
              </View>
            ))}
          </View>
        )}
        
        {data.inStock !== undefined && (
          <View style={styles.stockSection}>
            <View style={[
              styles.stockIndicator, 
              { backgroundColor: data.inStock ? '#22c55e' : '#ef4444' }
            ]} />
            <Text size="caption" style={styles.stockText}>
              {data.inStock ? 'IN STOCK' : 'OUT OF STOCK'}
            </Text>
          </View>
        )}
      </View>
    );
  };

  return (
    <View style={styles.container}>
      <ScrollView
        contentInsetAdjustmentBehavior="automatic"
        keyboardShouldPersistTaps="handled"
      >
        <View style={styles.content}>
          {error && (
            <View style={styles.section}>
              <Text size="caption" style={styles.errorLabel}>
                ERROR
              </Text>
              <Text style={styles.errorText}>{error}</Text>
            </View>
          )}

          {(streamingData || loading) && (
            <View style={styles.section}>
              <Text size="caption" style={styles.label}>
                STRUCTURED DATA {isPartial && "(PARTIAL)"}
              </Text>
              {streamingData ? (
                formatProductData(streamingData)
              ) : (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="small" color={colors.text} />
                  <Text style={styles.loadingText}>Starting generation...</Text>
                </View>
              )}
            </View>
          )}
        </View>
      </ScrollView>

      {/* Fixed Input Area */}
      <View
        style={[
          styles.inputArea,
          {
            backgroundColor: colors.background,
            borderTopColor: colors.border,
          },
        ]}
      >
        <View style={styles.inputSection}>
          <Text size="caption" style={styles.label}>
            PROMPT
          </Text>
          <TextInput
            style={[
              styles.textInput,
              {
                borderColor: colors.border,
                color: colors.text,
              },
            ]}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe a product to generate..."
            placeholderTextColor={colors.placeholder}
            multiline
            numberOfLines={2}
            textAlignVertical="top"
            editable={!loading}
          />
        </View>

        <View style={styles.actions}>
          {!loading ? (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: colors.button,
                    borderColor: colors.button,
                  },
                  pressed && styles.buttonPressed,
                  !prompt.trim() && styles.buttonDisabled,
                ]}
                onPress={handleStartStreaming}
                disabled={!prompt.trim()}
              >
                <Text style={[styles.buttonText, { color: colors.buttonText }]}>
                  Generate
                </Text>
              </Pressable>

              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  { borderColor: colors.border },
                  pressed && styles.buttonPressed,
                ]}
                onPress={clearChat}
              >
                <Text style={styles.buttonText}>Clear</Text>
              </Pressable>
            </>
          ) : (
            <>
              <Pressable
                style={({ pressed }) => [
                  styles.button,
                  {
                    backgroundColor: "red",
                    borderColor: "red",
                  },
                  pressed && styles.buttonPressed,
                ]}
                onPress={cancelStreaming}
              >
                <Text style={[styles.buttonText, { color: "white" }]}>
                  Cancel
                </Text>
              </Pressable>

              <View style={styles.streamingIndicator}>
                <ActivityIndicator size="small" color={colors.text} />
                <Text style={styles.streamingText}>Generating...</Text>
              </View>
            </>
          )}
        </View>
      </View>

      <Animated.View style={keyboardPadding} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
  },
  content: {
    paddingHorizontal: 20,
  },
  section: {
    marginBottom: 32,
  },
  label: {
    opacity: 0.6,
    marginBottom: 12,
  },
  errorLabel: {
    opacity: 0.6,
    marginBottom: 12,
    color: "red",
  },
  dataContainer: {
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 8,
    padding: 16,
  },
  dataText: {
    fontSize: 12,
    fontFamily: "monospace",
    lineHeight: 18,
  },
  loadingContainer: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
  },
  loadingText: {
    fontSize: 14,
    opacity: 0.6,
  },
  errorText: {
    color: "red",
  },
  inputArea: {
    borderTopWidth: StyleSheet.hairlineWidth,
    padding: 20,
  },
  inputSection: {
    marginBottom: 16,
  },
  textInput: {
    fontSize: 16,
    lineHeight: 24,
    minHeight: 60,
    maxHeight: 100,
    padding: 16,
    borderWidth: 1,
    borderRadius: 8,
  },
  actions: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  button: {
    flex: 1,
    paddingHorizontal: 20,
    paddingVertical: 12,
    borderRadius: 8,
    borderWidth: 1,
    alignItems: "center",
    justifyContent: "center",
    minHeight: 44,
  },
  buttonPressed: {
    opacity: 0.7,
  },
  buttonDisabled: {
    opacity: 0.3,
  },
  buttonText: {
    fontSize: 16,
    fontWeight: "500",
    textAlign: "center",
  },
  streamingIndicator: {
    flex: 1,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  streamingText: {
    fontSize: 14,
    opacity: 0.6,
  },
  // Product card styles
  productCard: {
    backgroundColor: "rgba(128, 128, 128, 0.05)",
    borderRadius: 12,
    borderWidth: StyleSheet.hairlineWidth,
    padding: 20,
    gap: 16,
  },
  productName: {
    fontSize: 22,
    fontWeight: "600",
    lineHeight: 28,
  },
  productPrice: {
    fontSize: 20,
    fontWeight: "700",
    marginTop: -4,
  },
  categoryBadge: {
    alignSelf: "flex-start",
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
  },
  categoryText: {
    fontSize: 11,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
  productDescription: {
    fontSize: 16,
    lineHeight: 24,
  },
  featuresSection: {
    gap: 8,
  },
  featuresLabel: {
    fontWeight: "600",
    letterSpacing: 0.5,
    marginBottom: 4,
  },
  featureRow: {
    flexDirection: "row",
    alignItems: "flex-start",
    gap: 8,
  },
  featureBullet: {
    fontSize: 16,
    lineHeight: 24,
    opacity: 0.6,
    marginTop: 0,
  },
  featureText: {
    fontSize: 15,
    lineHeight: 24,
    flex: 1,
  },
  stockSection: {
    flexDirection: "row",
    alignItems: "center",
    gap: 8,
    marginTop: 4,
  },
  stockIndicator: {
    width: 8,
    height: 8,
    borderRadius: 4,
  },
  stockText: {
    fontSize: 12,
    fontWeight: "600",
    letterSpacing: 0.5,
  },
});
