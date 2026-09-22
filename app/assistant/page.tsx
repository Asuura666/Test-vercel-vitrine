'use client';

import Link from 'next/link';
import { FormEvent, useState } from 'react';

const examples = [
  'Quelles offres proposes-tu ?',
  'Estime un site vitrine de 5 pages.',
  'Je veux un site de 4 pages avec un assistant IA, quel budget prévoir ?',
];

export default function AssistantPage() {
  const [prompt, setPrompt] = useState('');
  const [answer, setAnswer] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  async function askAgent(value: string) {
    const clean = value.trim();
    if (!clean || loading) return;

    setPrompt(clean);
    setAnswer('');
    setError('');
    setLoading(true);

    try {
      const response = await fetch('/api/agent', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ prompt: clean }),
      });

      if (!response.ok) {
        const payload = await response.json().catch(() => null);
        throw new Error(payload?.error ?? 'Erreur côté agent.');
      }

      if (!response.body) throw new Error('Le streaming n’est pas disponible.');

      const reader = response.body.getReader();
      const decoder = new TextDecoder();

      while (true) {
        const { value: chunk, done } = await reader.read();
        if (done) break;
        setAnswer((current) => current + decoder.decode(chunk, { stream: true }));
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Erreur inconnue.');
    } finally {
      setLoading(false);
    }
  }

  async function onSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    await askAgent(prompt);
  }

  return (
    <main className="assistantPage shell">
      <nav className="nav">
        <Link href="/" className="brand">Vitrine Lab</Link>
        <Link href="/" className="textLink">← Retour au site</Link>
      </nav>

      <section className="assistantIntro">
        <div className="eyebrow">Vercel AI SDK · tool calling</div>
        <h1>Assistant commercial de démonstration.</h1>
        <p className="lead">
          Demande-lui une offre ou une estimation. Il peut appeler des tools côté serveur
          avant de construire sa réponse.
        </p>
      </section>

      <div className="examples">
        {examples.map((example) => (
          <button key={example} type="button" onClick={() => askAgent(example)} disabled={loading}>
            {example}
          </button>
        ))}
      </div>

      <section className="chatCard">
        <form onSubmit={onSubmit} className="promptForm">
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            placeholder="Ex. Je veux un site vitrine de 6 pages avec une partie IA..."
            rows={4}
          />
          <button className="button" disabled={loading || !prompt.trim()}>
            {loading ? 'L’agent travaille…' : 'Envoyer'}
          </button>
        </form>

        <div className="answer">
          <div className="answerLabel">Réponse</div>
          {error ? <p className="error">{error}</p> : null}
          {!answer && !error ? (
            <p className="muted">La réponse streamée apparaîtra ici.</p>
          ) : (
            <p>{answer}</p>
          )}
        </div>
      </section>

      <aside className="note">
        <strong>Ce qui tourne sur Vercel :</strong> la page, la Function <code>/api/agent</code>,
        l&apos;appel AI Gateway et les tools. Aucun secret n&apos;est exposé au navigateur.
      </aside>
    </main>
  );
}
