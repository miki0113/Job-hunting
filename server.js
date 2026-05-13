const express = require('express');
const multer = require('multer');
const fs = require('fs');
const path = require('path');
const app = express();

const UPLOAD_DIR = './PDF'; // 念のため相対パスに修正しています

if (!fs.existsSync(UPLOAD_DIR)) {
    fs.mkdirSync(UPLOAD_DIR, { recursive: true });
}

const storage = multer.diskStorage({
    destination: (req, file, cb) => { cb(null, UPLOAD_DIR); },
    filename: (req, file, cb) => {
        // 日本語の文字化け防止
        file.originalname = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, file.originalname);
    }
});
const upload = multer({ storage: storage });

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

app.post('/api/upload', upload.single('file'), (req, res) => {
    res.send('Uploaded');
});

// 【★今度こそここを修正★】強制ダウンロードを阻止して表示させる設定
app.get('/PDF/:name', (req, res) => {
    const filePath = path.resolve(UPLOAD_DIR, req.params.name);
    
    if (fs.existsSync(filePath)) {
        // ブラウザに「保存（attachment）」ではなく「表示（inline）」しろと命令を出す
        res.setHeader('Content-Disposition', 'inline; filename="' + encodeURIComponent(req.params.name) + '"');
        
        // ファイルを送る
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