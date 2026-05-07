import { put } from '@vercel/blob';

export default async function handler(request) {
  try {
    const file = await request.body;
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');

    // MY_ があればそれを使い、なければ古い方を使う「二段構え」にしました
    const token = process.env.MY_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return new Response("トークンが見つかりません。設定を確認してください。", { status: 500 });
    }

    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    });

    return new Response(JSON.stringify(blob), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}
