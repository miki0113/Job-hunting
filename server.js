const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 【重要】Mikiさんが設定したDisk（金庫）の場所を保存先に指定
const UPLOAD_DIR = '/opt/render/project/src/PDF';

// フォルダがない場合は作成（金庫の準備）
if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

app.use(express.static('public'));

// ファイル一覧取得（ここで私のゴミを除外する）
app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.json([]);
        // RAFAAなどのゴミと、存在もしない「正6面体」をリストから完全に消す
        const filtered = files.filter(name => 
            !name.startsWith("RAFAA") && 
            !name.startsWith("test-") &&
            name !== "sample.pdf"
        );
        res.json(filtered);
    });
});

// アップロード処理
app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send('Uploaded');
});

// (以下、削除などの他の処理はそのまま)
app.listen(3000);
