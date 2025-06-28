import ExpoFoundationModelsModule, {
  StructuredStreamingChunk,
  StreamingSession,
} from "@/modules/expo-foundation-models";
import React, { useEffect, useRef, useState } from "react";
import {
  ActivityIndicator,
  Button,
  KeyboardAvoidingView,
  Platform,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

export default function StreamingStructuredScreen() {
  const [prompt, setPrompt] = useState("");
  const [streamingData, setStreamingData] = useState<any>(null);
  const [session, setSession] = useState<StreamingSession | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);
  const [isPartial, setIsPartial] = useState(false);

  const scrollViewRef = useRef<ScrollView>(null);
  const subscriptionsRef = useRef<any[]>([]);

  useEffect(() => {
    checkAvailability();

    // Set up event listeners
    const chunkSub = ExpoFoundationModelsModule.addListener(
      "onStructuredStreamingChunk",
      (chunk: StructuredStreamingChunk) => {
        if (chunk.isComplete) {
          setSession(null);
          setLoading(false);
          setIsPartial(false);
        } else {
          setStreamingData(chunk.data);
          setIsPartial(chunk.isPartial);
        }
      }
    );

    const errorSub = ExpoFoundationModelsModule.addListener(
      "onStreamingError",
      ({ error }: { sessionId: string; error: string }) => {
        setError(error);
        setSession(null);
        setLoading(false);
        setIsPartial(false);
      }
    );

    const cancelSub = ExpoFoundationModelsModule.addListener(
      "onStreamingCancelled",
      () => {
        setSession(null);
        setLoading(false);
        setIsPartial(false);
      }
    );

    subscriptionsRef.current = [chunkSub, errorSub, cancelSub];

    return () => {
      // Clean up subscriptions
      subscriptionsRef.current.forEach((sub) => sub.remove());
    };
  }, []);

  // Auto-start generation when availability is confirmed
  useEffect(() => {
    if (isAvailable === true && !loading && !streamingData) {
      const timer = setTimeout(() => {
        startStreaming();
      }, 500);
      return () => clearTimeout(timer);
    }
  }, [isAvailable]);

  const checkAvailability = async () => {
    try {
      const availability = await ExpoFoundationModelsModule.checkAvailability();
      setIsAvailable(availability.isAvailable);
    } catch (err) {
      console.error("Failed to check availability:", err);
      setIsAvailable(false);
    }
  };

  const startStreaming = async () => {
    // Use a default prompt if none provided
    const promptToUse = prompt.trim() || "Create a product for a high-end wireless noise-cancelling headphone";

    if (!isAvailable) {
      setError("Foundation Models is not available on this device");
      return;
    }

    if (!ExpoFoundationModelsModule.startStructuredStreamingSession) {
      setError("Structured streaming not supported on this platform");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setStreamingData(null);
      setIsPartial(false);

      const newSession = await ExpoFoundationModelsModule.startStructuredStreamingSession({
        prompt: promptToUse,
      });

      if ("error" in newSession && newSession.error) {
        setError(newSession.error as string);
        setLoading(false);
      } else {
        setSession(newSession);
      }
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to start streaming"
      );
      setLoading(false);
    }
  };

  const cancelStreaming = async () => {
    if (session && ExpoFoundationModelsModule.cancelStreamingSession) {
      try {
        await ExpoFoundationModelsModule.cancelStreamingSession(
          session.sessionId
        );
      } catch (err) {
        console.error("Failed to cancel streaming:", err);
      }
    }
  };


  const formatProductData = (data: any) => {
    if (!data) return null;

    // Show whatever fields we have
    return (
      <View style={styles.productContainer}>
        {data.name ? (
          <Text style={styles.productName}>{data.name}</Text>
        ) : (
          <View style={styles.skeleton}>
            <View style={[styles.skeletonLine, { width: "60%" }]} />
          </View>
        )}
        
        {data.price !== undefined ? (
          <Text style={styles.productPrice}>${data.price}</Text>
        ) : (
          <View style={styles.skeleton}>
            <View style={[styles.skeletonLine, { width: "30%" }]} />
          </View>
        )}
        
        {data.category ? (
          <Text style={styles.productCategory}>{data.category}</Text>
        ) : (
          <View style={styles.skeleton}>
            <View style={[styles.skeletonLine, { width: "40%" }]} />
          </View>
        )}
        
        {data.description ? (
          <Text style={styles.productDescription}>{data.description}</Text>
        ) : (
          <View style={styles.skeleton}>
            <View style={[styles.skeletonLine, { width: "100%" }]} />
            <View style={[styles.skeletonLine, { width: "90%" }]} />
            <View style={[styles.skeletonLine, { width: "95%" }]} />
          </View>
        )}
        
        {data.features && data.features.length > 0 ? (
          <View style={styles.featuresContainer}>
            <Text style={styles.featuresTitle}>Features:</Text>
            {data.features.map((feature: string, index: number) => (
              <Text key={index} style={styles.featureItem}>
                • {feature}
              </Text>
            ))}
          </View>
        ) : !data.features && (
          <View style={styles.skeleton}>
            <View style={[styles.skeletonLine, { width: "50%", marginTop: 16 }]} />
            <View style={[styles.skeletonLine, { width: "70%", marginLeft: 16 }]} />
            <View style={[styles.skeletonLine, { width: "65%", marginLeft: 16 }]} />
          </View>
        )}
        
        {data.inStock !== undefined ? (
          <View style={styles.stockContainer}>
            <Text style={[
              styles.stockText,
              { color: data.inStock ? "#28a745" : "#dc3545" }
            ]}>
              {data.inStock ? "✓ In Stock" : "✗ Out of Stock"}
            </Text>
          </View>
        ) : (
          <View style={styles.skeleton}>
            <View style={[styles.skeletonLine, { width: "25%", marginTop: 16 }]} />
          </View>
        )}
      </View>
    );
  };

  useEffect(() => {
    // Auto-scroll when data updates
    if (scrollViewRef.current && streamingData) {
      scrollViewRef.current.scrollToEnd({ animated: true });
    }
  }, [streamingData]);

  return (
    <KeyboardAvoidingView
      style={styles.container}
      behavior={Platform.OS === "ios" ? "padding" : "height"}
    >
      <ScrollView
        ref={scrollViewRef}
        style={styles.scrollView}
        contentInsetAdjustmentBehavior="automatic"
      >
        <View style={styles.content}>
          <Text style={styles.title}>Streaming Structured Data</Text>
          <Text style={styles.subtitle}>
            Real-time product generation with structured output
          </Text>

          {/* Response Display */}
          {(streamingData || loading) && (
            <View style={styles.responseCard}>
              <Text style={styles.responseLabel}>
                Generated Product {isPartial && "(Partial)"}:
              </Text>
              {formatProductData(streamingData)}
              {loading && !streamingData && (
                <View style={styles.loadingContainer}>
                  <ActivityIndicator size="large" color="#007AFF" />
                  <Text style={styles.loadingText}>Starting generation...</Text>
                </View>
              )}
            </View>
          )}

          {/* Error Display */}
          {error && (
            <View style={styles.errorCard}>
              <Text style={styles.errorText}>Error: {error}</Text>
            </View>
          )}

          {/* Status Info */}
          {isAvailable === false && (
            <View style={styles.infoCard}>
              <Text style={styles.infoTitle}>Not Available</Text>
              <Text style={styles.infoText}>
                Foundation Models is not available on this device. iOS 26+ with
                Apple Intelligence is required.
              </Text>
            </View>
          )}

          {/* Simple Controls */}
          {isAvailable && (
            <View style={styles.controlsCard}>
              <View style={styles.buttonRow}>
                {!loading ? (
                  <Button
                    title="Generate New Product"
                    onPress={startStreaming}
                  />
                ) : (
                  <Button
                    title="Cancel"
                    onPress={cancelStreaming}
                    color="#dc3545"
                  />
                )}
              </View>
            </View>
          )}
        </View>
      </ScrollView>
    </KeyboardAvoidingView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: "#f5f5f5",
  },
  scrollView: {
    flex: 1,
  },
  content: {
    padding: 20,
    paddingBottom: 120,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#333",
    textAlign: "center",
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  responseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 16,
  },
  productContainer: {
    gap: 12,
  },
  productName: {
    fontSize: 20,
    fontWeight: "bold",
    color: "#333",
  },
  productPrice: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#007AFF",
  },
  productCategory: {
    fontSize: 14,
    color: "#666",
    textTransform: "uppercase",
    letterSpacing: 1,
  },
  productDescription: {
    fontSize: 16,
    color: "#333",
    lineHeight: 24,
    marginTop: 8,
  },
  featuresContainer: {
    marginTop: 16,
  },
  featuresTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  featureItem: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
    marginLeft: 8,
  },
  stockContainer: {
    marginTop: 16,
    alignItems: "flex-start",
  },
  stockText: {
    fontSize: 16,
    fontWeight: "bold",
  },
  partialDataContainer: {
    alignItems: "center",
    paddingVertical: 40,
    gap: 16,
  },
  partialLabel: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
  },
  loadingContainer: {
    alignItems: "center",
    paddingVertical: 20,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  infoTitle: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: "#1e40af",
    lineHeight: 20,
  },
  inputArea: {
    position: "absolute",
    bottom: 0,
    left: 0,
    right: 0,
    backgroundColor: "#f5f5f5",
    borderTopWidth: 1,
    borderTopColor: "#e0e0e0",
    paddingTop: 10,
  },
  inputCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 16,
    margin: 16,
    marginTop: 0,
    boxShadow: "0 -2px 4px rgba(0, 0, 0, 0.1)",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 60,
    maxHeight: 100,
    marginBottom: 12,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    alignItems: "center",
  },
  buttonContainer: {
    flex: 1,
  },
  streamingIndicator: {
    flex: 2,
    flexDirection: "row",
    alignItems: "center",
    justifyContent: "center",
    gap: 8,
  },
  streamingText: {
    fontSize: 14,
    color: "#007AFF",
  },
  skeleton: {
    marginVertical: 4,
  },
  skeletonLine: {
    height: 20,
    backgroundColor: "#e0e0e0",
    borderRadius: 4,
    marginVertical: 4,
  },
  controlsCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginTop: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
});