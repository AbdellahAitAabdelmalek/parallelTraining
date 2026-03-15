import { useQuery } from "@tanstack/react-query";
import { apiFetch } from "@/lib/api";

interface UserProfile {
  id: string;
  email: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
}

async function fetchProfile(): Promise<UserProfile> {
  const res = await apiFetch("/users/profile");
  if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
  return res.json();
}

export function useProfile() {
  return useQuery({ queryKey: ["profile"], queryFn: fetchProfile });
}
