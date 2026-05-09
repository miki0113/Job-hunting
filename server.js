const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// 保存先フォルダ設定（エラー防止のためシンプルに）
const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    try { fs.mkdirSync(uploadDir); } catch (e) {}
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, safeName);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/PDF', express.static(path.join(__dirname, 'PDF')));
app.use('/uploads', express.static(uploadDir));

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('No file');
    res.json({ name: req.file.filename, url: `/uploads/${req.file.filename}` });
});

app.get('/api/list', (req, res) => {
    try {
        const files = fs.readdirSync(uploadDir);
        res.json(files.map(file => ({ name: file, url: `/uploads/${file}` })));
    } catch (e) { res.json([]); }
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
