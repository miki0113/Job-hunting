const express = require('express');
const path = require('path');
const fs = require('fs');
const multer = require('multer');
const app = express();
const PORT = process.env.PORT || 3000;

// 保存先フォルダを「作業ディレクトリ直下」に指定
const uploadDir = './uploads';

// 起動時にフォルダがあるか確認し、なければ作る（エラーが出ても無視して進む設定）
try {
    if (!fs.existsSync(uploadDir)) {
        fs.mkdirSync(uploadDir);
    }
} catch (e) {
    console.log("Folder check skipped");
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
    fs.readdir(uploadDir, (err, files) => {
        if (err) return res.json([]);
        res.json(files.map(file => ({ name: file, url: `/uploads/${file}` })));
    });
});

app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
