import { Text } from "@/components/ThemedText";
import { Href, useRouter } from "expo-router";
import { Pressable, ScrollView, StyleSheet, View } from "react-native";

type Example = {
  title: string;
  description: string;
  route: string;
};

const examples: Example[] = [
  {
    title: "Basic Generation",
    description: "Simple text generation with prompts",
    route: "/basic-generation",
  },
  {
    title: "Structured Data",
    description: "Generate JSON data with schemas",
    route: "/structured-data",
  },
  {
    title: "Streaming Chat",
    description: "Real-time text generation",
    route: "/streaming-chat",
  },
  {
    title: "Streaming Structured",
    description: "Real-time structured data",
    route: "/streaming-structured",
  },
];

export default function Home() {
  const router = useRouter();

  return (
    <ScrollView
      contentInsetAdjustmentBehavior="automatic"
      style={styles.container}
    >
      <View style={styles.content}>
        <Text size="header" style={styles.title}>
          Examples
        </Text>

        {examples.map((example, index) => (
          <Pressable
            key={example.route}
            style={({ pressed }) => [
              styles.card,
              pressed && styles.cardPressed,
              index === examples.length - 1 && styles.lastCard,
            ]}
            onPress={() => router.push(example.route as Href)}
          >
            <Text style={styles.cardTitle}>{example.title}</Text>
            <Text size="caption" style={styles.cardDescription}>
              {example.description}
            </Text>
          </Pressable>
        ))}
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
    marginBottom: 24,
  },
  card: {
    paddingVertical: 16,
    borderBottomWidth: StyleSheet.hairlineWidth,
    borderBottomColor: "rgba(128, 128, 128, 0.2)",
  },
  cardPressed: {
    opacity: 0.7,
  },
  lastCard: {
    borderBottomWidth: 0,
  },
  cardTitle: {
    fontSize: 17,
    fontWeight: "500",
    marginBottom: 4,
  },
  cardDescription: {
    opacity: 0.6,
  },
});
