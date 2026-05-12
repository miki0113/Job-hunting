const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

const UPLOAD_DIR = '/PDF';

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => {
        // 【重要】日本語の文字化けを直す魔法の1行
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.json([]);
        const filtered = files.filter(name => 
            !name.startsWith("RAFAA") && 
            !name.startsWith("test-") &&
            name !== "sample.pdf"
        );
        res.json(filtered);
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send('Uploaded');
});

// ファイル表示（ここも日本語対応に強化）
app.get('/PDF/:name', (req, res) => {
    const filePath = path.join(UPLOAD_DIR, req.params.name);
    res.download(filePath, req.params.name);
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
