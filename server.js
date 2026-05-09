const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

const uploadDir = path.join(__dirname, 'uploads');
if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, uploadDir),
    filename: (req, file, cb) => {
        // 日本語ファイル名の文字化けをより確実に防ぐ処理
        const safeName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, safeName);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/PDF', express.static(path.join(__dirname, 'PDF')));
app.use('/uploads', express.static(uploadDir));

app.post('/api/upload', upload.single('file'), (req, res) => {
    if (!req.file) return res.status(400).send('ファイルがありません');
    res.json({ name: req.file.filename, url: `/uploads/${req.file.filename}` });
});

app.get('/api/list', (req, res) => {
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.json([]);
        res.json(files.map(file => ({ name: file, url: `/uploads/${file}` })));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
