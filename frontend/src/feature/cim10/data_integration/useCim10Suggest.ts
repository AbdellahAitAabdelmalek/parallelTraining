import { tsr } from "@/lib/api-client";

export function useCim10Suggest() {
  const { mutate, isPending, isError, data } = tsr.cim10.suggest.useMutation();

  const suggestions = data?.status === 201 ? data.body.suggestions : [];
  const error = isError
    ? "Erreur inconnue"
    : data && data.status !== 201
      ? `Erreur serveur : ${data.status}`
      : null;

  return {
    suggestions,
    loading: isPending,
    error,
    suggest: (input: string) => mutate({ body: { input } }),
  };
}
