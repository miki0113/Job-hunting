import { put } from '@vercel/blob';

export default async function handler(request) {
  try {
    const { searchParams } = new URL(request.url, `http://${request.headers.host}`);
    const filename = searchParams.get('filename');
    const file = await request.body;

    // 設定されているトークンを片っ端から試す設定です
    const token = process.env.MY_BLOB_READ_WRITE_TOKEN || process.env.BLOB_READ_WRITE_TOKEN;

    if (!token) {
      return new Response("【設定エラー】Vercelの設定画面でトークンが登録されていません。", { status: 500 });
    }

    const blob = await put(filename, file, {
      access: 'public',
      token: token,
    });

    return new Response(JSON.stringify(blob), {
      status: 200,
      headers: { 'Content-Type': 'application/json' },
    });
  } catch (error) {
    // もしここでエラーが出たら、その理由を正直に画面に返します
    return new Response(`【実行エラー】${error.message}`, { status: 500 });
  }
}
