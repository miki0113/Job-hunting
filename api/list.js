import { list } from '@vercel/blob';

export const config = {
  regions: ['hnd1'], 
};

export default async function handler() {
  try {
    const blobs = await list({
      token: process.env.BLOB_READ_WRITE_TOKEN
    });
    return new Response(JSON.stringify(blobs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
