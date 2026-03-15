import { useState } from 'react';

interface Suggestion {
  code: string;
  libelle: string;
  justification: string;
  regles_codage: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSuggest = async () => {
    setLoading(true);
    setError(null);
    try {
      const res = await fetch('http://localhost:3000/rag/suggest', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ input }),
      });
      if (!res.ok) throw new Error(`Erreur serveur : ${res.status}`);
      const data = await res.json();
      setSuggestions(data.suggestions ?? []);
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Erreur inconnue');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-2xl p-8 space-y-6">
        <h1 className="text-2xl font-bold text-gray-800">
          Suggestion de codes CIM-10
        </h1>

        <div className="space-y-3">
          <textarea
            className="w-full border border-gray-300 rounded-lg p-3 text-sm resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={4}
            placeholder="Décrivez le diagnostic ou le symptôme…"
            value={input}
            onChange={(e) => setInput(e.target.value)}
          />
          <button
            onClick={handleSuggest}
            disabled={loading || !input.trim()}
            className="w-full bg-blue-600 hover:bg-blue-700 disabled:opacity-50 text-white font-medium py-2 px-4 rounded-lg transition-colors"
          >
            {loading ? 'Recherche…' : 'Suggérer des codes'}
          </button>
        </div>

        {error && (
          <p className="text-sm text-red-500 text-center">{error}</p>
        )}

        {suggestions.length > 0 && (
          <ul className="space-y-4">
            {suggestions.map((s) => (
              <li
                key={s.code}
                className="border border-gray-200 rounded-xl p-4 space-y-2"
              >
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
          <p className="text-sm text-gray-400 text-center">
            Aucune suggestion pour l'instant.
          </p>
        )}
      </div>
    </div>
  );
}