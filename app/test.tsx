import React from "react";
import { View, Text, StyleSheet } from "react-native";

export default function TestScreen() {
  return (
    <View style={styles.container}>
      <Text style={styles.title}>Test Screen</Text>
      <Text style={styles.subtitle}>If you can see this, the app is working!</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    justifyContent: "center",
    alignItems: "center",
    backgroundColor: "#000",
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: "bold",
    color: "#fff",
    marginBottom: 20,
  },
  subtitle: {
    fontSize: 16,
    color: "#888",
    textAlign: "center",
  },
});
