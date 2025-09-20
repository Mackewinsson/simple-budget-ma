import { Tabs } from "expo-router";

export default function TabsLayout() {
  return (
    <Tabs screenOptions={{ headerShown: false }}>
      <Tabs.Screen name="budgets" options={{ title: "Budgets" }} />
      <Tabs.Screen name="transactions" options={{ title: "Transactions" }} />
      <Tabs.Screen name="reports" options={{ title: "Reports" }} />
      <Tabs.Screen name="settings" options={{ title: "Settings" }} />
    </Tabs>
  );
}
