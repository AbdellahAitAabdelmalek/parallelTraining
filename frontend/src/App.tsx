import { useState } from 'react';

interface Suggestion {
  code: string;
  libelle: string;
}

export default function App() {
  const [input, setInput] = useState('');
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [loading, setLoading] = useState(false);

  const handleSuggest = async () => {
    // TODO: activer quand le backend est prêt
    // setLoading(true);
    // const res = await fetch('http://localhost:3000/rag/suggest', {
    //   method: 'POST',
    //   headers: { 'Content-Type': 'application/json' },
    //   body: JSON.stringify({ input }),
    // });
    // const data = await res.json();
    // setSuggestions(data.suggestions ?? []);
    // setLoading(false);
    setSuggestions([]);
  };

  return (
    <div className="min-h-screen bg-gray-50 flex items-center justify-center p-6">
      <div className="bg-white rounded-2xl shadow-md w-full max-w-xl p-8 space-y-6">
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

        {suggestions.length > 0 && (
          <ul className="divide-y divide-gray-100">
            {suggestions.map((s) => (
              <li key={s.code} className="py-3 flex items-center gap-3">
                <span className="font-mono text-sm bg-blue-100 text-blue-800 px-2 py-0.5 rounded">
                  {s.code}
                </span>
                <span className="text-gray-700 text-sm">{s.libelle}</span>
              </li>
            ))}
          </ul>
        )}

        {suggestions.length === 0 && input && (
          <p className="text-sm text-gray-400 text-center">
            Aucune suggestion pour l'instant.
          </p>
        )}
      </div>
    </div>
  );
}