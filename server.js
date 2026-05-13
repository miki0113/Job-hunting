const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 【ここが最重要】__dirname を使うことで、今の場所にある「PDF」フォルダを確実に見に行きます
const UPLOAD_DIR = path.join(__dirname, 'PDF');

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => {
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

// 全ファイルを表示
app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.json([]);
        // 全てのファイルを表示
        res.json(files);
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send('Uploaded');
});

// 表示（inline）設定
app.get('/PDF/:name', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.name);
    if (fs.existsSync(filePath)) {
        res.setHeader('Content-Disposition', 'inline; filename="' + encodeURIComponent(req.params.name) + '"');
        res.sendFile(filePath);
    } else {
        res.status(404).send('ファイルが見つかりません');
    }
});

app.delete('/api/files/:name', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.name);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send('Deleted');
    } else {
        res.status(404).send('Not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
