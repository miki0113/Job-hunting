import { list } from '@vercel/blob';

export default async function handler(request) {
  const { blobs } = await list();
  return new Response(JSON.stringify({ blobs }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
