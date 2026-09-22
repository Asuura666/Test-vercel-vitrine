# Test Vercel Vitrine

POC volontairement simple pour tester une stack **Vercel + Next.js + AI SDK** avant de la réutiliser sur des missions client.

## Ce que contient le repo

- landing page vitrine responsive ;
- page `/assistant` ;
- Vercel Function `POST /api/agent` ;
- streaming de la réponse ;
- boucle agentique avec jusqu'à 5 étapes ;
- 2 tools server-side :
  - `getOffers` ;
  - `estimateProject` ;
- route `GET /api/health`.

## Stack

- Next.js 16
- React 19
- TypeScript
- Vercel AI SDK 7
- AI Gateway
- Zod

## Lancer en local

```bash
npm install
cp .env.example .env.local
npm run dev
```

Ajoute une clé AI Gateway dans `.env.local` :

```env
AI_GATEWAY_API_KEY=...
AI_MODEL=openai/gpt-5.5
```

Puis ouvre `http://localhost:3000`.

## Déployer sur Vercel

1. Importe ce repository dans Vercel.
2. Framework détecté : **Next.js**.
3. Build command : `next build` (automatique).
4. Déploie.
5. Ouvre `/assistant` et teste les prompts proposés.

En production Vercel, l'AI Gateway peut utiliser l'identité du déploiement. Le secret utilisé en local ne doit jamais être commité.

## Tester l'agent

Exemples :

- « Quelles offres proposes-tu ? »
- « Estime un site vitrine de 5 pages. »
- « Je veux un site de 4 pages avec un assistant IA, quel budget prévoir ? »

Les tarifs sont fictifs. Le but est de démontrer le tool calling, pas de produire de vrais devis.

## Architecture

```text
Browser
   |
   +--> Next.js pages
   |
   +--> POST /api/agent
            |
            +--> AI SDK / AI Gateway
            |
            +--> getOffers()
            |
            +--> estimateProject()
```

## Pour aller plus loin

Le prochain incrément logique serait de remplacer les tools mockés par de vraies sources :

- formulaire / leads PostgreSQL ;
- CRM ;
- catalogue produit ;
- agenda ;
- API métier ;
- RAG documentaire.
