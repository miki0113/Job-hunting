const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 保存先の設定（RenderのDisk "/PDF" を最優先に使用）
const saveDir = process.env.SAVE_DIR || path.join(__dirname, 'PDF');

// フォルダがなければ自動作成
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

// 静的ファイルの提供（index.htmlなどを表示できるようにする）
app.use(express.static(__dirname));

// アップロードの設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, saveDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

// --- 各命令（ルート） ---

// 1. ファイル一覧を取得してフロント（HTML）に返す
app.get('/api/files', (req, res) => {
    fs.readdir(saveDir, (err, files) => {
        if (err) return res.status(500).json([]);
        res.json(files);
    });
});

// 2. ファイルをアップロードする
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.redirect('/');
});

// 3. ファイルを削除する（ゴミ箱機能の本体）
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(saveDir, req.params.filename);
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error(err);
            return res.status(500).send("消せませんでした");
        }
        res.send("削除完了");
    });
});

// サーバーを起動
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
