const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

// 1. 保存先の決定（RenderのDisk "/PDF" を最優先、なければ "PDF" フォルダ）
const saveDir = process.env.SAVE_DIR || path.join(__dirname, 'PDF');

// 保存先フォルダがない場合は自動で作る
if (!fs.existsSync(saveDir)) {
    fs.mkdirSync(saveDir, { recursive: true });
}

// EJSを使う設定（もしHTMLをレンダリングしている場合）
app.set('view engine', 'ejs');
app.use(express.static('public'));

// 2. アップロードの設定
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, saveDir);
    },
    filename: (req, file, cb) => {
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

// --- ここからが各ルート（命令） ---

// メイン画面：ファイル一覧を取得して表示
app.get('/', (req, res) => {
    fs.readdir(saveDir, (err, files) => {
        if (err) {
            return res.status(500).send("フォルダが読み込めません");
        }
        // index.ejs（またはhtml）にファイルリストを渡す
        res.render('index', { files: files });
    });
});

// 【アップロード機能】
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.redirect('/');
});

// 【削除機能】★ここが今回追加したい「掃除機」の正体です
app.delete('/delete/:filename', (req, res) => {
    const fileName = req.params.filename;
    const filePath = path.join(saveDir, fileName);

    // 本当にDisk（金庫）からファイルを消す命令
    fs.unlink(filePath, (err) => {
        if (err) {
            console.error("削除エラー:", err);
            return res.status(500).send("ファイルが消せませんでした");
        }
        console.log(fileName + " を削除しました");
        res.send("削除成功");
    });
});

// サーバー起動の設定
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});