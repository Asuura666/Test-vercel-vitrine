export async function GET() {
  return Response.json({
    ok: true,
    service: 'test-vercel-vitrine',
    runtime: 'vercel-function',
  });
}
