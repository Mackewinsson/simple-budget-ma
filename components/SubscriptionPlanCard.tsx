import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { useTheme } from '../src/theme/ThemeContext';
import { SubscriptionPlan } from '../src/types/subscription';
import { trackPlanSelected } from '../src/lib/analytics';

interface SubscriptionPlanCardProps {
  plan: SubscriptionPlan;
  isSelected: boolean;
  onSelect: (plan: SubscriptionPlan) => void;
  style?: any;
}

export default function SubscriptionPlanCard({ 
  plan, 
  isSelected, 
  onSelect, 
  style 
}: SubscriptionPlanCardProps) {
  const { theme } = useTheme();
  const styles = createStyles(theme, isSelected);

  const handleSelect = () => {
    onSelect(plan);
    trackPlanSelected(plan.id, plan.displayName);
  };

  return (
    <TouchableOpacity
      style={[styles.container, style]}
      onPress={handleSelect}
      activeOpacity={0.7}
    >
      {plan.isPopular && (
        <View style={styles.popularBadge}>
          <Text style={styles.popularText}>Most Popular</Text>
        </View>
      )}
      
      <View style={[styles.header, { marginTop: plan.isPopular ? 8 : 0 }]}>
        <View style={styles.titleContainer}>
          <Text style={styles.title}>{plan.displayName}</Text>
          {isSelected && (
            <Ionicons name="checkmark-circle" size={24} color={theme.primary} />
          )}
        </View>
        
        <View style={styles.priceContainer}>
          <Text style={styles.price}>{plan.priceString}</Text>
          <Text style={styles.duration}>{plan.duration}</Text>
        </View>
        
        {plan.savings && (
          <Text style={styles.savings}>{plan.savings}</Text>
        )}
      </View>
    </TouchableOpacity>
  );
}

const createStyles = (theme: any, isSelected: boolean) => StyleSheet.create({
  container: {
    backgroundColor: isSelected ? theme.primary + '15' : theme.cardBackground,
    borderWidth: 2,
    borderColor: isSelected ? theme.primary : theme.cardBorder,
    borderRadius: 16,
    padding: 20,
    marginVertical: 8,
    position: 'relative',
    shadowColor: theme.shadow,
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: isSelected ? 0.15 : 0.05,
    shadowRadius: 8,
    elevation: isSelected ? 4 : 2,
  },
  popularBadge: {
    position: 'absolute',
    top: -8,
    left: 20,
    right: 20,
    backgroundColor: theme.primary,
    paddingHorizontal: 12,
    paddingVertical: 4,
    borderRadius: 12,
    alignItems: 'center',
  },
  popularText: {
    color: theme.surface,
    fontSize: 12,
    fontWeight: '600',
  },
  header: {
    marginTop: 0,
  },
  titleContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 12,
  },
  title: {
    fontSize: 18,
    fontWeight: '600',
    color: theme.text,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'baseline',
    marginBottom: 4,
  },
  price: {
    fontSize: 28,
    fontWeight: '700',
    color: theme.text,
  },
  duration: {
    fontSize: 16,
    color: theme.textSecondary,
    marginLeft: 4,
  },
  savings: {
    fontSize: 14,
    color: theme.success,
    fontWeight: '600',
  },
});
