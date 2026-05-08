const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

const app = express();
const port = process.env.PORT || 3000;

// 保存先フォルダ（uploads）がなければ作成
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ファイル保存の設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, 'uploads/'),
    filename: (req, file, cb) => {
        // 日本語ファイル名でも壊れないようにタイムスタンプを付与
        const safeName = Date.now() + '-' + Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, safeName);
    }
});
const upload = multer({ storage: storage });

// 静的ファイルの提供（HTMLやアップロード済みファイル）
app.use(express.static('public'));
app.use('/uploads', express.static('uploads'));

// アップロード用API
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.json({ url: `/uploads/${req.file.filename}` });
});

// ファイル一覧取得用API
app.get('/api/list', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).send('Error listing files.');
        res.json(files.map(f => ({ name: f, url: `/uploads/${f}` })));
    });
});

app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
