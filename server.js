const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 【最重要】Renderの課金ディスク（/PDF）があればそこを使い、なければパソコンのフォルダを使います
const UPLOAD_DIR = fs.existsSync('/PDF') ? '/PDF' : path.join(__dirname, 'PDF');

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

// ファイル一覧取得：元のフィルター条件をそのまま引き継いでいます
app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.json([]);
        const filtered = files.filter(name => 
            !name.startsWith("RAFAA") && 
            !name.includes("板倉病院") && 
            !name.includes("日警保安") && 
            name !== "sample.pdf" &&
            !name.startsWith(".") // .keepなどの隠しファイルを除外
        );
        res.json(filtered);
    });
});

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send('Uploaded');
});

// ファイルを返す設定（保存先フォルダから正しく取得します）
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
    console.log(`Using directory: ${UPLOAD_DIR}`);
});
