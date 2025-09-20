import { useQuery } from "@tanstack/react-query";
import { getOrCreateDemoUser } from "../demo";

export const useDemoUser = () => {
  return useQuery({
    queryKey: ["demoUser"],
    queryFn: getOrCreateDemoUser,
    staleTime: 5 * 60 * 1000, // 5 minutes
    retry: 3,
  });
};
