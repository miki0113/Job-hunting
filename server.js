const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 1. MikiさんのDisk（金庫）を保存先に指定
const UPLOAD_DIR = '/opt/render/project/src/PDF';

// フォルダ作成
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

// 2. Cannot GET / を直すための設定
// index.htmlが置いてある場所（ルート）を読み込めるようにします
app.use(express.static(__dirname)); 

// ファイル一覧取得
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

// アップロード
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send('Uploaded');
});

// 削除
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
