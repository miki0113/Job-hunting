import { put } from '@vercel/blob';

export default async function handler(request) {
  if (request.method !== 'POST') {
    return new Response('Method Not Allowed', { status: 405 });
  }

  try {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');

    // ボディを直接流し込むことで、Vercelの標準制限を回避します
    const blob = await put(filename, request.body, {
      access: 'public',
      token: process.env.MY_BLOB_READ_WRITE_TOKEN,
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    return new Response(`Error: ${error.message}`, { status: 500 });
  }
}

// これが重要！413エラー（サイズ制限）を解除する設定です
export const config = {
  api: {
    bodyParser: false,
  },
};
