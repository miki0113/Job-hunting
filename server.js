const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// 現在のディレクトリを基準にする
const currentDir = __dirname;
const pdfDir = path.join(currentDir, 'PDF');

// 1. 静的ファイルの配信（PDFフォルダなどを公開）
app.use(express.static(currentDir));
app.use('/PDF', express.static(pdfDir));

// 2. トップページ（index.html）を確実に表示させる設定
app.get('/', (req, res) => {
    res.sendFile(path.join(currentDir, 'index.html'));
});

// 3. ファイル一覧取得API
app.get('/api/list', (req, res) => {
    if (!fs.existsSync(pdfDir)) {
        return res.json([]);
    }
    const files = fs.readdirSync(pdfDir).filter(f => !f.startsWith('.'));
    res.json(files.map(f => ({
        name: f,
        url: `/PDF/${encodeURIComponent(f)}`
    })));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
