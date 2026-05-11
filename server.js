const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// PDF保存先を「PDF」フォルダに設定（自動で作られます）
const pdfDir = path.join(__dirname, 'PDF');
if (!fs.existsSync(pdfDir)) {
    fs.mkdirSync(pdfDir, { recursive: true });
}

// 【修正ポイント】publicフォルダを使わず、今の場所にあるファイルをそのまま使う
app.use(express.static(__dirname));

// ファイル一覧取得機能
app.get('/api/files', (req, res) => {
    fs.readdir(pdfDir, (err, files) => {
        if (err) return res.status(500).json([]);
        const filtered = files.filter(f => !f.startsWith('.') && f !== '.gitkeep');
        res.json(filtered);
    });
});

// アップロード機能
const storage = multer.diskStorage({
    destination: pdfDir,
    filename: (req, file, cb) => {
        const fileName = Buffer.from(file.originalname, 'latin1').toString('utf8');
        cb(null, fileName);
    }
});
const upload = multer({ storage: storage });

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.send('Uploaded');
});

// ゴミ箱を動かす削除機能
app.delete('/delete', (req, res) => {
    const fileName = req.query.name;
    const filePath = path.join(pdfDir, fileName);
    if (fs.existsSync(filePath)) {
        fs.unlinkSync(filePath);
        res.send('Deleted');
    } else {
        res.status(404).send('Not Found');
    }
});

// PDFを表示・ダウンロードさせるための設定
app.get('/PDF/:name', (req, res) => {
    res.sendFile(path.join(pdfDir, req.params.name));
});

app.listen(port, () => console.log(`Server running on port ${port}`));
