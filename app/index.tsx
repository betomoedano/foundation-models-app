import { Link } from "expo-router";
import { Pressable, ScrollView, StyleSheet, Text, View } from "react-native";

const screens = [
  {
    id: "availability",
    title: "Availability Check",
    description:
      "Check Foundation Models availability and device compatibility",
    href: "/availability",
  },
  {
    id: "basic-generation",
    title: "Basic Generation",
    description: "Simple text generation with prompts",
    href: "/basic-generation",
  },
];

export default function Index() {
  return (
    <ScrollView
      style={styles.container}
      contentInsetAdjustmentBehavior="automatic"
    >
      <View style={styles.content}>
        <View style={styles.header}>
          <Text style={styles.title}>Foundation Models Demo</Text>
          <Text style={styles.subtitle}>
            Apple&apos;s Foundation Models integration with Expo
          </Text>
        </View>

        <View style={styles.screensContainer}>
          {screens.map((screen) => (
            <Link key={screen.id} href={screen.href as any} asChild>
              <Pressable style={styles.screenCard}>
                <Text style={styles.screenTitle}>{screen.title}</Text>
                <Text style={styles.screenDescription}>
                  {screen.description}
                </Text>
              </Pressable>
            </Link>
          ))}
        </View>

        <View style={styles.infoCard}>
          <Text style={styles.infoTitle}>About</Text>
          <Text style={styles.infoText}>
            iOS 26+ with Apple Intelligence required for full functionality.
            Android/Web show &quot;not implemented&quot; messages.
          </Text>
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
  screensContainer: {
    gap: 12,
    marginBottom: 30,
  },
  screenCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  screenTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 8,
  },
  screenDescription: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
  infoCard: {
    backgroundColor: "white",
    borderRadius: 12,
    padding: 20,
    boxShadow: "0 2px 4px rgba(0, 0, 0, 0.1)",
  },
  infoTitle: {
    fontSize: 18,
    fontWeight: "bold",
    color: "#333",
    marginBottom: 12,
  },
  infoText: {
    fontSize: 14,
    color: "#666",
    lineHeight: 20,
  },
});
