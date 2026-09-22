import Link from 'next/link';
import { highlights, offers } from '@/lib/site';

export default function Home() {
  return (
    <main>
      <nav className="nav shell">
        <Link href="/" className="brand">Vitrine Lab</Link>
        <div className="navLinks">
          <a href="#offres">Offres</a>
          <Link href="/assistant" className="button small">Tester l&apos;agent</Link>
        </div>
      </nav>

      <section className="hero shell">
        <div className="eyebrow">POC Vercel · Next.js · AI SDK</div>
        <h1>Un site vitrine simple, rapide et prêt à intégrer de l&apos;IA.</h1>
        <p className="lead">
          Ce repo sert de laboratoire pour tester un déploiement Vercel complet :
          frontend, route serverless et agent IA avec outils métier.
        </p>
        <div className="actions">
          <Link href="/assistant" className="button">Parler à l&apos;assistant</Link>
          <a href="#offres" className="button ghost">Voir les offres</a>
        </div>
        <div className="chips">
          {highlights.map((item) => <span key={item}>{item}</span>)}
        </div>
      </section>

      <section id="offres" className="section shell">
        <div className="sectionHead">
          <div>
            <div className="eyebrow">Exemple commercial</div>
            <h2>Des offres faciles à comprendre.</h2>
          </div>
          <p>Les prix sont volontairement fictifs : ils servent aux tools de l&apos;agent.</p>
        </div>
        <div className="grid">
          {offers.map((offer) => (
            <article className="card" key={offer.id}>
              <div className="cardTop">
                <h3>{offer.name}</h3>
                <span>à partir de {offer.from.toLocaleString('fr-FR')} €</span>
              </div>
              <p>{offer.description}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="section shell split">
        <div>
          <div className="eyebrow">Le test intéressant</div>
          <h2>L&apos;agent ne répond pas seulement avec son prompt.</h2>
        </div>
        <div className="feature">
          <p>
            Il dispose de tools server-side pour consulter les offres et faire une
            estimation simple. Le modèle choisit quand les utiliser.
          </p>
          <Link href="/assistant" className="textLink">Ouvrir /assistant →</Link>
        </div>
      </section>

      <footer className="footer shell">
        <span>Vitrine Lab</span>
        <span>POC de déploiement Vercel</span>
      </footer>
    </main>
  );
}
