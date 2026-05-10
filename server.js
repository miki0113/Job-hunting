const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 1. 保存先の設定
const saveDir = process.env.SAVE_DIR || path.join(__dirname, 'PDF');
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

// 2. Mikiさんのjson設定に合わせ「EJS」を正しく使う設定
app.set('view engine', 'ejs');
app.set('views', __dirname); // index.ejsがルートにある場合

// 3. アップロードの設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => cb(null, saveDir),
    filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

// --- ルート設定 ---

// 一覧表示
app.get('/', (req, res) => {
    fs.readdir(saveDir, (err, files) => {
        res.render('index', { files: files || [] });
    });
});

// アップロード
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.redirect('/');
});

// 削除（ゴミ箱機能）
app.delete('/delete/:filename', (req, res) => {
    const filePath = path.join(saveDir, req.params.filename);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send('ok');
    } else {
        res.status(404).send('File not found');
    }
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server is running!`));
