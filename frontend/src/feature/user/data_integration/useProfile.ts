import { tsr } from "@/lib/api-client";

export function useProfile() {
  return tsr.users.getProfile.useQuery({ queryKey: ["profile"] });
}
