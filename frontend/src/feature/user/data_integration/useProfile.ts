import { apiClient } from "@/lib/api-client";

export function useProfile() {
  return apiClient.users.getProfile.useQuery({ queryKey: ["profile"] });
}
