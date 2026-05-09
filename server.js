const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// ファイルを保存するフォルダ（PDFという名前ですがWord等もここに入ります）
const uploadDir = path.join(__dirname, 'PDF');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir);
}

// ファイル保存の設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname) // 元のファイル名と拡張子を維持
});

// 制限なしでアップロードを許可
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/PDF', express.static(uploadDir));

// ファイル一覧を返すAPI（拡張子を問わずすべて取得）
app.get('/api/list', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json([]);
        const fileList = files.map(file => ({
            name: file,
            url: `/PDF/${file}`
        }));
        res.json(fileList);
    });
});

// ファイルを受け取るAPI
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.status(200).send('File uploaded!');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
