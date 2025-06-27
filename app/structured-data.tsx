import ExpoFoundationModelsModule, {
  StructuredGenerationResponse,
} from "@/modules/expo-foundation-models";
import { useEffect, useState } from "react";
import {
  ActivityIndicator,
  Button,
  ScrollView,
  StyleSheet,
  Text,
  TextInput,
  View,
} from "react-native";

// Predefined schema examples
const SCHEMA_EXAMPLES = {
  userProfile: {
    name: "User Profile",
    description: "Generate a user profile with basic information",
    example:
      "Create a profile for a 25-year-old software developer from San Francisco",
  },
  product: {
    name: "Product Information",
    description: "Generate product details for e-commerce",
    example: "Create a product for a wireless bluetooth headphone",
  },
  event: {
    name: "Event Details",
    description: "Generate event information",
    example: "Create an event for a tech conference about AI in Palo Alto",
  },
};

export default function StructuredDataScreen() {
  const [prompt, setPrompt] = useState("");
  const [selectedSchema, setSelectedSchema] = useState<
    "userProfile" | "product" | "event"
  >("userProfile");
  const [response, setResponse] = useState<StructuredGenerationResponse | null>(
    null
  );
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [isAvailable, setIsAvailable] = useState<boolean | null>(null);

  useEffect(() => {
    checkAvailability();
    // Set example prompt for default schema
    setPrompt(SCHEMA_EXAMPLES.userProfile.example);
  }, []);

  const checkAvailability = async () => {
    try {
      const availability = await ExpoFoundationModelsModule.checkAvailability();
      setIsAvailable(availability.isAvailable);
    } catch (err) {
      console.error("Failed to check availability:", err);
      setIsAvailable(false);
    }
  };

  const generateStructuredData = async () => {
    if (!prompt.trim()) {
      setError("Please enter a prompt");
      return;
    }

    if (!isAvailable) {
      setError("Foundation Models is not available on this device");
      return;
    }

    if (!ExpoFoundationModelsModule.generateStructuredData) {
      setError("Structured data generation not supported on this platform");
      return;
    }

    try {
      setLoading(true);
      setError(null);
      setResponse(null);

      const result = await ExpoFoundationModelsModule.generateStructuredData({
        prompt: prompt.trim(),
        schemaType: selectedSchema,
      });

      // Check if there's an error in the response
      if ("error" in result && result.error) {
        setError(result.error as string);
      } else {
        setResponse(result);
      }
    } catch (err) {
      setError(
        err instanceof Error
          ? err.message
          : "Failed to generate structured data"
      );
    } finally {
      setLoading(false);
    }
  };

  const selectSchemaExample = (key: "userProfile" | "product" | "event") => {
    setSelectedSchema(key);
    const example = SCHEMA_EXAMPLES[key];
    setPrompt(example.example);
  };

  const clearAll = () => {
    setPrompt("");
    setResponse(null);
    setError(null);
    setPrompt(SCHEMA_EXAMPLES[selectedSchema].example);
  };

  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        <Text style={styles.title}>Structured Data Generation</Text>
        <Text style={styles.subtitle}>
          Generate JSON data that matches specific schemas
        </Text>

        {/* Schema Selection */}
        <View style={styles.schemaCard}>
          <Text style={styles.label}>Schema Type:</Text>

          <View style={styles.schemaExamples}>
            {Object.entries(SCHEMA_EXAMPLES).map(([key, schema]) => (
              <Button
                key={key}
                title={schema.name}
                onPress={() =>
                  selectSchemaExample(
                    key as "userProfile" | "product" | "event"
                  )
                }
                color={selectedSchema === key ? "#007AFF" : "#666"}
              />
            ))}
          </View>

          <View style={styles.schemaDisplay}>
            <Text style={styles.schemaDescription}>
              {SCHEMA_EXAMPLES[selectedSchema].description}
            </Text>
          </View>
        </View>

        {/* Prompt Input */}
        <View style={styles.inputCard}>
          <Text style={styles.label}>Prompt:</Text>
          <TextInput
            style={styles.textInput}
            value={prompt}
            onChangeText={setPrompt}
            placeholder="Describe what you want to generate..."
            multiline
            numberOfLines={3}
            textAlignVertical="top"
          />
        </View>

        {/* Actions */}
        <View style={styles.actionCard}>
          <View style={styles.buttonRow}>
            <View style={styles.buttonContainer}>
              <Button
                title="Generate"
                onPress={generateStructuredData}
                disabled={loading || !prompt.trim()}
              />
            </View>
            <View style={styles.buttonContainer}>
              <Button title="Clear" onPress={clearAll} color="#666" />
            </View>
          </View>
        </View>

        {/* Loading */}
        {loading && (
          <View style={styles.loadingCard}>
            <ActivityIndicator size="large" color="#007AFF" />
            <Text style={styles.loadingText}>
              Generating structured data...
            </Text>
          </View>
        )}

        {/* Error */}
        {error && (
          <View style={styles.errorCard}>
            <Text style={styles.errorText}>Error: {error}</Text>
          </View>
        )}

        {/* Response */}
        {response && !loading && (
          <View style={styles.responseCard}>
            <Text style={styles.responseLabel}>Generated Data:</Text>

            {/* Structured Data */}
            <View style={styles.dataContainer}>
              <Text style={styles.dataTitle}>
                Generated Data ({response.schemaType}):
              </Text>
              <Text style={styles.dataText}>
                {JSON.stringify(response.data, null, 2)}
              </Text>
            </View>

            {/* Metadata */}
            <View style={styles.metadataContainer}>
              <Text style={styles.metadataTitle}>Generation Details:</Text>
              <Text style={styles.metadataText}>
                • Tokens: {response.metadata.tokenCount}
              </Text>
              <Text style={styles.metadataText}>
                • Time: {response.metadata.generationTime.toFixed(2)}s
              </Text>
              <Text style={styles.metadataText}>
                • Model: {response.metadata.model}
              </Text>
              <Text style={styles.metadataText}>
                • Schema Type: {response.schemaType}
              </Text>
            </View>
          </View>
        )}

        {/* Status Info */}
        {isAvailable === false && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Not Available</Text>
            <Text style={styles.infoText}>
              Foundation Models is not available on this device. iOS 26+ with
              Apple Intelligence is required for structured data generation.
            </Text>
          </View>
        )}

        {isAvailable === true && (
          <View style={styles.infoCard}>
            <Text style={styles.infoTitle}>Ready to Generate</Text>
            <Text style={styles.infoText}>
              Foundation Models is available! Select a schema above and enter a
              prompt to generate structured JSON data.
            </Text>
          </View>
        )}
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
    marginBottom: 8,
  },
  subtitle: {
    fontSize: 16,
    color: "#666",
    textAlign: "center",
    marginBottom: 30,
  },
  schemaCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  inputCard: {
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
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  loadingCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    alignItems: "center",
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  errorCard: {
    backgroundColor: "#fef2f2",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  responseCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    marginBottom: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  infoCard: {
    backgroundColor: "#f0f9ff",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  label: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  schemaExamples: {
    flexDirection: "row",
    flexWrap: "wrap",
    gap: 8,
    marginBottom: 16,
  },
  schemaDisplay: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginTop: 12,
  },
  schemaDescription: {
    fontSize: 14,
    color: "#666",
    fontStyle: "italic",
  },
  textInput: {
    borderWidth: 1,
    borderColor: "#ddd",
    borderRadius: 8,
    padding: 12,
    fontSize: 16,
    minHeight: 80,
  },
  buttonRow: {
    flexDirection: "row",
    gap: 12,
    marginBottom: 12,
  },
  buttonContainer: {
    flex: 1,
  },
  loadingText: {
    marginTop: 10,
    color: "#666",
  },
  errorText: {
    color: "#dc3545",
    fontSize: 14,
    lineHeight: 20,
  },
  responseLabel: {
    fontSize: 16,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  dataContainer: {
    backgroundColor: "#f0f9ff",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  dataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#1e40af",
    marginBottom: 8,
  },
  dataText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#1e40af",
    lineHeight: 16,
  },
  rawContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
    marginBottom: 12,
  },
  rawTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  rawText: {
    fontSize: 12,
    fontFamily: "monospace",
    color: "#666",
    lineHeight: 16,
  },
  metadataContainer: {
    backgroundColor: "#f8f9fa",
    borderRadius: 8,
    padding: 12,
  },
  metadataTitle: {
    fontSize: 14,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  metadataText: {
    fontSize: 12,
    color: "#666",
    lineHeight: 16,
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
});
