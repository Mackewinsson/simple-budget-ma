import React, { useState } from "react";
import { View, Text, FlatList, StyleSheet, Pressable } from "react-native";
import { useCategories } from "../src/api/hooks/useCategories";
import { useDemoUser } from "../src/api/hooks/useDemoUser";
import NewCategoryForm from "./NewCategoryForm";

interface Category {
  _id?: string;
  id?: string;
  name: string;
  budgeted: number;
  spent: number;
  budgetId: string;
}

export default function CategoryList() {
  const { data: demoUser } = useDemoUser();
  const { data: categories = [], isLoading } = useCategories(demoUser?._id || "");
  const [showCategoryForm, setShowCategoryForm] = useState(false);

  const handleAddCategory = () => {
    setShowCategoryForm(true);
  };

  const renderCategory = ({ item }: { item: Category }) => (
    <View style={styles.categoryCard}>
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryName}>{item.name}</Text>
        <Text style={styles.categoryAmount}>
          ${item.budgeted} / ${item.spent}
        </Text>
      </View>
      <View style={styles.progressBar}>
        <View 
          style={[
            styles.progressFill, 
            { width: `${Math.min((item.spent / item.budgeted) * 100, 100)}%` }
          ]} 
        />
      </View>
      <Text style={styles.remainingText}>
        ${item.budgeted - item.spent} remaining
      </Text>
    </View>
  );

  if (isLoading) {
    return (
      <View style={styles.container}>
        <Text style={styles.title}>Categories</Text>
        <Text>Loading categories...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>Categories</Text>
        <Pressable style={styles.addButton} onPress={handleAddCategory}>
          <Text style={styles.addButtonText}>+ Add Category</Text>
        </Pressable>
      </View>
      
      {showCategoryForm ? (
        <NewCategoryForm 
          onComplete={() => setShowCategoryForm(false)}
          onCancel={() => setShowCategoryForm(false)}
        />
      ) : (
        <FlatList
          data={categories}
          keyExtractor={(item) => item._id || item.id || Math.random().toString()}
          renderItem={renderCategory}
          style={styles.list}
          scrollEnabled={false}
        />
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    margin: 16,
  },
  header: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 16,
  },
  title: {
    fontSize: 20,
    fontWeight: "600",
    color: "#0f172a",
  },
  addButton: {
    backgroundColor: "#10b981",
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 8,
    shadowColor: "#10b981",
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 2,
  },
  addButtonText: {
    color: "#fff",
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: "#ffffff",
    padding: 16,
    borderRadius: 12,
    marginBottom: 12,
    borderWidth: 1,
    borderColor: "#e2e8f0",
    shadowColor: "#000",
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.05,
    shadowRadius: 4,
    elevation: 2,
  },
  categoryHeader: {
    flexDirection: "row",
    justifyContent: "space-between",
    alignItems: "center",
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 16,
    fontWeight: "500",
    color: "#0f172a",
  },
  categoryAmount: {
    fontSize: 14,
    color: "#64748b",
  },
  progressBar: {
    height: 6,
    backgroundColor: "#f1f5f9",
    borderRadius: 3,
    marginBottom: 8,
    overflow: "hidden",
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#10b981",
    borderRadius: 3,
  },
  remainingText: {
    fontSize: 12,
    color: "#64748b",
  },
});
