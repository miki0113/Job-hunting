import { put } from '@vercel/blob';

export default async function handler(request) {
  const { searchParams } = new URL(request.url);
  const filename = searchParams.get('filename');

  const blob = await put(filename, request.body, {
    access: 'public',
  });

  return new Response(JSON.stringify(blob), {
    headers: { 'Content-Type': 'application/json' },
  });
}
