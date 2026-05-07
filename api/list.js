import { list } from '@vercel/blob';

export default async function handler(request) {
  // カッコの中に合言葉（トークン）を書き足します
  const { blobs } = await list({
    token: process.env.BLOB_READ_WRITE_TOKEN
  });
  
  return new Response(JSON.stringify({ blobs }), {
    headers: { 'Content-Type': 'application/json' },
  });
}
