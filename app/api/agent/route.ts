import { stepCountIs, streamText, tool } from 'ai';
import { z } from 'zod';
import { offers } from '@/lib/site';

export const maxDuration = 60;

const projectTypeSchema = z.enum(['vitrine', 'landing', 'vitrine_ai']);

function estimateProject(projectType: z.infer<typeof projectTypeSchema>, pages: number) {
  const offer = offers.find((item) => item.id === projectType);
  const base = offer?.from ?? 1000;
  const extraPages = Math.max(0, pages - (projectType === 'landing' ? 1 : 4));
  const min = base + extraPages * 120;
  const max = Math.round(min * 1.35);

  return {
    projectType,
    pages,
    estimatedRangeEUR: [min, max],
    disclaimer: 'Estimation de démonstration, pas un devis contractuel.',
  };
}

export async function POST(request: Request) {
  const body = await request.json().catch(() => null);
  const prompt = typeof body?.prompt === 'string' ? body.prompt.trim() : '';

  if (!prompt) {
    return Response.json({ error: 'Le champ prompt est obligatoire.' }, { status: 400 });
  }

  const result = streamText({
    model: process.env.AI_MODEL ?? 'openai/gpt-5.5',
    instructions: [
      'Tu es l’assistant commercial d’un petit studio web français.',
      'Réponds en français, de façon concise et concrète.',
      'Quand la question concerne les offres disponibles, utilise getOffers.',
      'Quand le visiteur demande un prix, un budget ou une estimation, utilise estimateProject.',
      'Ne présente jamais l’estimation comme un devis définitif.',
      'Si une information nécessaire manque, fais une hypothèse raisonnable et indique-la.',
    ].join(' '),
    prompt,
    stopWhen: stepCountIs(5),
    tools: {
      getOffers: tool({
        description: 'Retourne les offres commerciales actuellement disponibles.',
        inputSchema: z.object({}),
        execute: async () => offers,
      }),
      estimateProject: tool({
        description: 'Calcule une fourchette budgétaire indicative pour un projet web.',
        inputSchema: z.object({
          projectType: projectTypeSchema.describe(
            'vitrine = site vitrine classique, landing = landing page, vitrine_ai = site avec assistant IA',
          ),
          pages: z.number().int().min(1).max(30).describe('Nombre estimé de pages'),
        }),
        execute: async ({ projectType, pages }) => estimateProject(projectType, pages),
      }),
    },
  });

  return result.toTextStreamResponse({
    headers: {
      'Cache-Control': 'no-store',
    },
  });
}
