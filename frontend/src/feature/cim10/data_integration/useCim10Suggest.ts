import { useState } from "react";
import { apiClient } from "@/lib/api-client";

type Suggestion = {
  code: string;
  libelle: string;
  justification: string;
  regles_codage: string;
};

export function useCim10Suggest() {
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const suggest = async (input: string) => {
    setLoading(true);
    setError(null);
    try {
      const res = await apiClient.cim10.suggest({ body: { input } });
      if (res.status !== 201) throw new Error(`Erreur serveur : ${res.status}`);
      setSuggestions(res.body.suggestions);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Erreur inconnue");
    } finally {
      setLoading(false);
    }
  };

  return { suggestions, loading, error, suggest };
}