import { supabase } from "./supabase";

const API_URL = import.meta.env.VITE_API_URL as string;

export async function apiFetch(path: string, options: RequestInit = {}, token?: string): Promise<Response> {
  if (!token) {
    const { data } = await supabase.auth.getSession();
    token = data.session?.access_token;
  }

  return fetch(`${API_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...(token ? { Authorization: `Bearer ${token}` } : {}),
      ...options.headers,
    },
  });
}
