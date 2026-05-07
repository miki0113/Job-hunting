import { put } from '@vercel/blob';

export default async function handler(request) {
  try {
    const file = await request.body;
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');

    // 1箇所目：ここを MY_ に修正
    if (!process.env.MY_BLOB_READ_WRITE_TOKEN) {
      return new Response("トークンが見つかりません。Vercelの設定を確認してください。", { status: 500 });
    }

    const blob = await put(filename, file, {
      access: 'public',
      // 2箇所目：ここも MY_ に修正
      token: process.env.MY_BLOB_READ_WRITE_TOKEN,
    });

    return new Response(JSON.stringify(blob), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
