import { list } from '@vercel/blob';

export default async function handler(request) {
  try {
    // リスト取得側も、正しいトークンを使うように直します
    const token = process.env.MY_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

    const blobs = await list({
      token: token
    });

    return new Response(JSON.stringify(blobs), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
