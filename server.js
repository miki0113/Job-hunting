const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// 保存先を「PDF」フォルダに固定
const pdfDir = path.join(__dirname, 'public', 'PDF');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

app.use(express.static('public'));

// ファイル一覧をスマホとPCで同期させる機能
app.get('/api/files', (req, res) => {
    fs.readdir(pdfDir, (err, files) => {
        if (err) return res.status(500).json([]);
        // ゴミファイル（.から始まるものなど）を除外してリスト化
        const filtered = files.filter(f => !f.startsWith('.') && f !== '.gitkeep');
        res.json(filtered);
    });
});

// ファイルをUPする機能
const storage = multer.diskStorage({
    destination: pdfDir,
    filename: (req, file, cb) => {
        // 日本語が文字化けしないように保存
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.send('Uploaded');
});

// 【重要】これが「ゴミ箱ボタン」を本当に動かす機能です
app.delete('/delete', (req, res) => {
    const fileName = req.query.name;
    const filePath = path.join(pdfDir, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath); // ここで実際にファイルを削除
        res.send('Deleted');
    } else {
        res.status(404).send('Not Found');
    }
});

app.listen(port, () => console.log(`Server running on port ${port}`));
