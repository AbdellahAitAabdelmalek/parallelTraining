import { initClient } from "@ts-rest/core";
import { initTsrReactQuery } from "@ts-rest/react-query/v5";
import { contract } from "@parallel/contract";
import { supabase } from "@/lib/supabase";

const API_URL = import.meta.env.VITE_API_URL as string;

async function customFetch({
  path, // déjà l'URL complète (baseUrl + route.path) fournie par ts-rest
  method,
  headers,
  body,
  signal,
}: {
  path: string;
  method: string;
  headers: Record<string, string>;
  body?: string | FormData | URLSearchParams | null;
  signal?: AbortSignal | null;
}) {
  const finalHeaders: Record<string, string> = { ...headers };

  if (!finalHeaders["Authorization"] && !finalHeaders["authorization"]) {
    const { data } = await supabase.auth.getSession();
    const token = data.session?.access_token;
    if (token) finalHeaders["Authorization"] = `Bearer ${token}`;
  }

  const res = await fetch(path, {
    method,
    headers: finalHeaders,
    body,
    signal,
  });

  const responseBody = await res.json().catch(() => null);
  return { status: res.status, body: responseBody, headers: res.headers };
}

// Client React Query v5
export const tsr = initTsrReactQuery(contract, {
  baseUrl: API_URL,
  baseHeaders: {},
  api: customFetch,
});

// Client impératif (appels manuels avec token explicite : suggest, signup)
export const apiClient = initClient(contract, {
  baseUrl: API_URL,
  baseHeaders: {},
  api: customFetch,
});
