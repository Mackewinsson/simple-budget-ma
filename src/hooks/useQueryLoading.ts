import { useIsFetching, useIsMutating } from '@tanstack/react-query';

export const useQueryLoading = () => {
  const isFetching = useIsFetching();
  const isMutating = useIsMutating();
  
  return {
    isFetching: isFetching > 0,
    isMutating: isMutating > 0,
    isLoading: isFetching > 0 || isMutating > 0,
    fetchingCount: isFetching,
    mutatingCount: isMutating,
  };
};
