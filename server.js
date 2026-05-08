const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// 絶対パスで場所を特定する
const currentDir = path.resolve(__dirname);
const pdfDir = path.join(currentDir, 'PDF');

// index.htmlが存在するかチェックしてから表示する
app.get('/', (req, res) => {
    const indexPath = path.join(currentDir, 'index.html');
    if (fs.existsSync(indexPath)) {
        res.sendFile(indexPath);
    } else {
        res.status(404).send('index.htmlが見つかりません。現在の場所: ' + currentDir);
    }
});

// PDFフォルダを公開
app.use('/PDF', express.static(pdfDir));
app.use(express.static(currentDir));

// ファイル一覧API
app.get('/api/list', (req, res) => {
    if (!fs.existsSync(pdfDir)) return res.json([]);
    const files = fs.readdirSync(pdfDir).filter(f => !f.startsWith('.'));
    res.json(files.map(f => ({ name: f, url: `/PDF/${encodeURIComponent(f)}` })));
});

app.listen(port, () => {
    console.log(`Server started`);
});
