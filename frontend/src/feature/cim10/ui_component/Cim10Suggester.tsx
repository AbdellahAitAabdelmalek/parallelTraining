import { useState } from "react";
import { useCim10Suggest } from "@/feature/cim10/data_integration/useCim10Suggest";

export default function Cim10Suggester() {
  const [input, setInput] = useState("");
  const { suggestions, loading, error, suggest } = useCim10Suggest();

  return (
    <div className="space-y-6">
      <div className="space-y-3">
        <textarea
          className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
          rows={4}
          placeholder="Décrivez le diagnostic ou le symptôme…"
          value={input}
          onChange={(e) => setInput(e.target.value)}
        />
        <button
          onClick={() => suggest(input)}
          disabled={loading || !input.trim()}
          className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
        >
          {loading ? "Recherche…" : "Suggérer des codes"}
        </button>
      </div>

      {error && <p className="text-sm text-red-500 text-center">{error}</p>}

      {suggestions.length > 0 && (
        <ul className="space-y-4">
          {suggestions.map((s) => (
            <li key={s.code} className="border border-gray-200 rounded-xl p-4 space-y-2">
              <div className="flex items-center gap-3">
                <span className="font-mono text-sm font-semibold bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {s.code}
                </span>
                <span className="text-gray-800 font-medium">{s.libelle}</span>
              </div>
              <p className="text-sm text-gray-600">{s.justification}</p>
              {s.regles_codage && (
                <p className="text-xs text-gray-500 bg-gray-50 rounded p-2 border-l-2 border-blue-300">
                  <span className="font-medium text-gray-700">Règles CoCoA : </span>
                  {s.regles_codage}
                </p>
              )}
            </li>
          ))}
        </ul>
      )}

      {suggestions.length === 0 && !loading && input && !error && (
        <p className="text-sm text-gray-400 text-center">Aucune suggestion pour l'instant.</p>
      )}
    </div>
  );
}