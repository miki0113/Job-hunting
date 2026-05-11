const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// PDFを保存する場所を固定
const pdfDir = path.join(__dirname, 'public', 'PDF');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

app.use(express.static('public'));

// ファイル一覧をスマホに送る機能（キャッシュ防止付き）
app.get('/api/files', (req, res) => {
    fs.readdir(pdfDir, (err, files) => {
        if (err) return res.status(500).json([]);
        res.json(files);
    });
});

// アップロード機能
const storage = multer.diskStorage({
    destination: pdfDir,
    filename: (req, file, cb) => {
        // 日本語ファイル名が壊れないようにデコードして保存
        cb(null, Buffer.from(file.originalname, 'latin1').toString('utf8'));
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.send('Uploaded');
});

// 【重要】ゴミ箱ボタンを動かすための削除機能
app.delete('/delete', (req, res) => {
    const fileName = req.query.name;
    const filePath = path.join(pdfDir, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send('Deleted');
    } else {
        res.status(404).send('Not Found');
    }
});

// 【緊急用】一括削除ボタンを動かす機能
app.post('/clear-all', (req, res) => {
    const files = fs.readdirSync(pdfDir);
    for (const file of files) {
        if (file !== '.gitkeep') fs.unlinkSync(path.join(pdfDir, file));
    }
    res.send('Cleared');
});

app.listen(port, () => console.log(`Server running on port ${port}`));
