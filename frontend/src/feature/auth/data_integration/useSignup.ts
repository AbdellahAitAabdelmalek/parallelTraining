import { useState } from "react";
import { useNavigate } from "react-router-dom";
import { supabase } from "@/lib/supabase";
import { apiClient } from "@/lib/api-client";

type SignupData = {
  email: string;
  password: string;
  firstName: string;
  lastName: string;
  dateOfBirth: string;
};

export function useSignup() {
  const navigate = useNavigate();
  const { mutateAsync: createProfile } = apiClient.users.createProfile.useMutation();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const signup = async ({ email, password, firstName, lastName, dateOfBirth }: SignupData) => {
    setLoading(true);
    setError(null);

    const { data: signUpData, error: signUpError } = await supabase.auth.signUp({ email, password });

    if (signUpError) {
      setError(signUpError.message);
      setLoading(false);
      return;
    }

    const token = signUpData.session?.access_token;
    if (!token) {
      setError("Vérifie ton email pour confirmer ton compte avant de continuer.");
      setLoading(false);
      return;
    }

    const res = await createProfile({
      body: { firstName, lastName, dateOfBirth },
      extraHeaders: { Authorization: `Bearer ${token}` },
    });

    if (res.status !== 201) {
      const errBody = res.body as { message?: string } | null;
      setError(errBody?.message ?? "Erreur lors de la création du profil");
      setLoading(false);
      return;
    }

    navigate("/");
  };

  return { signup, loading, error };
}