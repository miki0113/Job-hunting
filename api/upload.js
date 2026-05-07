import { put } from '@vercel/blob';

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');
    const file = await request.body;

    // MY_ の鍵だけを真っ直ぐ見に行くようにしました
    const token = process.env.MY_BLOB_READ_WRITE_TOKEN;

    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // もしエラーが出ても、内容をハッキリ表示させます
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
