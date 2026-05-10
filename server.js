const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 保存先をRenderのDisk "/PDF" に固定
const saveDir = process.env.SAVE_DIR || '/PDF';

// フォルダがなければ作成
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

// index.htmlを表示するための設定
app.use(express.static(__dirname));

// アップロードの設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, saveDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

// --- 機能（ルート） ---

// ファイル一覧を取得する
app.get('/api/files', (req, res) => {
    fs.readdir(saveDir, (err, files) => {
        if (err) return res.status(500).json([]);
        res.json(files || []);
    });
});

// ファイルをアップロードする
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.redirect('/');
});

// ファイルを削除する（ゴミ箱）
app.delete('/delete/:filename', (req, res)
