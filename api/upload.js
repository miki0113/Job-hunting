import { put } from '@vercel/blob';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');

    // リクエストのbodyをそのまま渡すのではなく、一度「中身」をしっかり取り出します
    const file = await request.body;

    const blob = await put(filename, file, {
      access: 'public',
      token: process.env.MY_BLOB_READ_WRITE_TOKEN,
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(JSON.stringify({ error: error.message }), { 
      status: 500,
      headers: { 'Content-Type': 'application/json' }
    });
  }
}

export const config = {
  api: {
    bodyParser: false, // 大きなファイルを扱うために必須の設定です
  },
};
