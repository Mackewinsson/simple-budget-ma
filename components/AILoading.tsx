import React from 'react';
import { View, Text, StyleSheet, ActivityIndicator } from 'react-native';
import { Ionicons } from '@expo/vector-icons';

interface AILoadingProps {
  isProcessing: boolean;
  currentStep?: 'analyzing' | 'parsing' | 'creating' | 'complete';
}

export default function AILoading({ isProcessing, currentStep = 'analyzing' }: AILoadingProps) {
  if (!isProcessing) return null;

  const getStepText = () => {
    switch (currentStep) {
      case 'analyzing':
        return 'Analyzing your budget description...';
      case 'parsing':
        return 'Parsing income and expenses...';
      case 'creating':
        return 'Creating budget and categories...';
      case 'complete':
        return 'Budget created successfully!';
      default:
        return 'AI is working...';
    }
  };

  const getStepIcon = () => {
    switch (currentStep) {
      case 'analyzing':
        return 'search-outline';
      case 'parsing':
        return 'document-text-outline';
      case 'creating':
        return 'add-circle-outline';
      case 'complete':
        return 'checkmark-circle-outline';
      default:
        return 'sparkles-outline';
    }
  };

  return (
    <View style={styles.overlay}>
      <View style={styles.container}>
        <View style={styles.iconContainer}>
          <Ionicons 
            name={getStepIcon() as any} 
            size={48} 
            color="#4ade80" 
            style={styles.icon}
          />
          {currentStep !== 'complete' && (
            <ActivityIndicator 
              size="small" 
              color="#4ade80" 
              style={styles.spinner}
            />
          )}
        </View>
        
        <Text style={styles.title}>AI Budget Creation</Text>
        <Text style={styles.stepText}>{getStepText()}</Text>
        
        {currentStep !== 'complete' && (
          <View style={styles.progressContainer}>
            <View style={styles.progressBar}>
              <View 
                style={[
                  styles.progressFill, 
                  { 
                    width: currentStep === 'analyzing' ? '25%' : 
                           currentStep === 'parsing' ? '50%' : 
                           currentStep === 'creating' ? '75%' : '100%'
                  }
                ]} 
              />
            </View>
          </View>
        )}
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  overlay: {
    position: 'absolute',
    top: 0,
    left: 0,
    right: 0,
    bottom: 0,
    backgroundColor: 'rgba(0, 0, 0, 0.8)',
    justifyContent: 'center',
    alignItems: 'center',
    zIndex: 1000,
  },
  container: {
    backgroundColor: '#1a1a1a',
    borderRadius: 16,
    padding: 32,
    alignItems: 'center',
    minWidth: 280,
    borderWidth: 1,
    borderColor: '#333',
  },
  iconContainer: {
    position: 'relative',
    marginBottom: 16,
  },
  icon: {
    opacity: 0.9,
  },
  spinner: {
    position: 'absolute',
    top: -4,
    right: -4,
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    color: '#fff',
    marginBottom: 8,
    textAlign: 'center',
  },
  stepText: {
    fontSize: 16,
    color: '#94a3b8',
    textAlign: 'center',
    marginBottom: 24,
    lineHeight: 22,
  },
  progressContainer: {
    width: '100%',
    alignItems: 'center',
  },
  progressBar: {
    width: '100%',
    height: 4,
    backgroundColor: '#333',
    borderRadius: 2,
    overflow: 'hidden',
  },
  progressFill: {
    height: '100%',
    backgroundColor: '#4ade80',
    borderRadius: 2,
  },
});
