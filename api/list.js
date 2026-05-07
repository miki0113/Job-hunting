import { list } from '@vercel/blob';

export default async function handler(request) {
  try {
    if (!process.env.BLOB_READ_WRITE_TOKEN) {
      return new Response("トークンなし", { status: 500 });
    }

    const { blobs } = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN
    });

    return new Response(JSON.stringify({ blobs }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
