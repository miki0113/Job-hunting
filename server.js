const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// RenderのDisk（/PDF）を優先的に使う設定
const saveDir = process.env.SAVE_DIR || path.join(__dirname, 'PDF');

// 保存用フォルダがなければ作る
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

// フォルダを公開設定にする（PDFを表示するため）
app.use('/PDF', express.static(saveDir));
app.use(express.static(path.join(__dirname)));

// アップロードの設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, saveDir); },
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

// --- ルート設定 ---

// 1. メイン画面（index.htmlを返す）
app.get('/', (req, res) => {
    res.sendFile(path.join(__dirname, 'index.html'));
});

// 2. ファイル一覧をJSONで返す（HTML側でボタンを作るために必要）
app.get('/api/files', (req, res) => {
    fs.readdir(saveDir, (err, files) => {
        if (err) return res.status(500).json([]);
        res.json(files);
    });
});

// 3. アップロードを実行
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.redirect('/');
});

// 4. 削除を実行（ゴミ箱ボタンの掃除機！）
app.delete('/delete/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(saveDir, fileName);

    fs.unlink(filePath, (err) => {
        if (err) return res.status(500).send("消せませんでした");
        res.send("削除完了");
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server running on port ${PORT}`);
});
