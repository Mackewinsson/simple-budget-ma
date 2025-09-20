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
    color: "#fff",
  },
  addButton: {
    backgroundColor: "#4ade80",
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 6,
  },
  addButtonText: {
    color: "#000",
    fontSize: 14,
    fontWeight: "600",
  },
  list: {
    flex: 1,
  },
  categoryCard: {
    backgroundColor: "#111",
    padding: 16,
    borderRadius: 8,
    marginBottom: 12,
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
    color: "#fff",
  },
  categoryAmount: {
    fontSize: 14,
    color: "#888",
  },
  progressBar: {
    height: 4,
    backgroundColor: "#333",
    borderRadius: 2,
    marginBottom: 8,
  },
  progressFill: {
    height: "100%",
    backgroundColor: "#4ade80",
    borderRadius: 2,
  },
  remainingText: {
    fontSize: 12,
    color: "#888",
  },
});
