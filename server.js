const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const UPLOAD_DIR = './PDF/';
if (!fs.existsSync(UPLOAD_DIR)) fs.mkdirSync(UPLOAD_DIR);

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/PDF', express.static(path.join(__dirname, 'PDF')));

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.status(200).send('OK');
});

// 【復旧ポイント】Mikiさんの履歴書だけをプルダウンに出す
app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.status(500).json([]);
        
        const filteredFiles = files.filter(file => {
            const f = file.toUpperCase();
            // RAFAA... や 謎の英数字だけのファイルはプルダウンに出さない
            const isSystemFile = f.startsWith('RAFAA') || /^[0-9A-F]{20,}/.test(f);
            return !isSystemFile && file !== '.gitkeep';
        });
        res.json(filteredFiles);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
