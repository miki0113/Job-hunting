const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const PORT = process.env.PORT || 3000;

// 保存先フォルダ名を「uploads」に統一（競合を避けるため）
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

// ファイル保存の設定（元の名前と拡張子を維持）
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

// 静的ファイルの提供
app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// ファイル一覧を返すAPI
app.get('/api/list', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.status(500).json([]);
        const fileList = files.map(file => ({
            name: file,
            url: `/uploads/${file}`
        }));
        res.json(fileList);
    });
});

// あらゆる形式のファイルを受け取るAPI
app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file uploaded.');
    res.status(200).send('OK');
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
