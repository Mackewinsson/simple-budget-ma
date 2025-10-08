import React from 'react';
import { useIsFetching, useIsMutating } from '@tanstack/react-query';
import BeautifulLoadingOverlay from './BeautifulLoadingOverlay';

interface GlobalLoadingIndicatorProps {
  showBackgroundFetching?: boolean;
  showMutations?: boolean;
  position?: 'top-right' | 'top-left' | 'bottom-right' | 'bottom-left';
}

export default function GlobalLoadingIndicator({ 
  showBackgroundFetching = true,
  showMutations = true,
  position = 'top-right' // Keep for backward compatibility but not used
}: GlobalLoadingIndicatorProps) {
  // Detect all fetching states including manual refetches
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  const isLoading = (showBackgroundFetching && isFetching > 0) || (showMutations && isMutating > 0);

  return (
    <BeautifulLoadingOverlay
      visible={isLoading}
      title={isMutating > 0 ? "Saving..." : "Loading..."}
      subtitle={isMutating > 0 ? "Please wait while we save your data" : "Getting latest data"}
      iconName={isMutating > 0 ? "save" : "refresh"}
    />
  );
}

