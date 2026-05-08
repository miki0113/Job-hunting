const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// Wordを保存するフォルダ「uploads」を自動で作る
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ファイル名をそのまま保存する設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

// Wordアップロードの窓口
app.post('/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file');
    res.send('Uploaded');
});

// 保存されたWordの一覧を出す窓口
app.get('/api/list', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.json([]);
        const wordFiles = files.filter(f => f.endsWith('.docx') || f.endsWith('.doc'));
        res.json(wordFiles.map(f => ({ name: f, url: `/uploads/${f}` })));
    });
});

// アップロードしたファイルを表示・ダウンロード可能にする
app.use('/uploads', express.static(uploadDir));

app.listen(process.env.PORT || 3000);
