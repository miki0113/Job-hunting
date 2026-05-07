import { put } from '@vercel/blob';

export default async function handler(request) {
  const file = await request.body;
  const filename = new URL(request.url, `http://${request.headers.host}`).searchParams.get('filename');
  
  const blob = await put(filename, file, { 
    access: 'public',
    token: process.env.BLOB_READ_WRITE_TOKEN 
  });
  
  return new Response(JSON.stringify(blob));
}
