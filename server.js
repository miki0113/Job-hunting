const express = require('express');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// 今いる場所（current）を基準にする
const currentDir = __dirname;
const pdfDir = path.join(currentDir, 'PDF');

// 静的ファイルの配信
app.use(express.static(currentDir));
app.use('/PDF', express.static(pdfDir));

// 500エラーを回避するためのAPI
app.get('/api/list', (req, res) => {
    if (!fs.existsSync(pdfDir)) {
        return res.json([]);
    }
    const files = fs.readdirSync(pdfDir).filter(f => !f.startsWith('.'));
    res.json(files.map(f => ({ name: f, url: `/PDF/${f}` })));
});

app.listen(port, () => {
    console.log(`Server running on port ${port}`);
});
