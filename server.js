const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

const UPLOAD_DIR = './PDF/';           // Mikiさん専用（履歴書など）
const MASTER_DIR = './master_files/'; // システム専用（募集要項リンク用）

[UPLOAD_DIR, MASTER_DIR].forEach(dir => {
    if (!fs.existsSync(dir)) fs.mkdirSync(dir);
});

const storage = multer.diskStorage({
    destination: UPLOAD_DIR,
    filename: (req, file, cb) => { cb(null, file.originalname); }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/PDF', express.static(path.join(__dirname, 'PDF')));
app.use('/master_files', express.static(path.join(__dirname, 'master_files')));

app.post('/upload', upload.single('pdfFile'), (req, res) => {
    res.status(200).send('OK');
});

app.get('/api/files', (req, res) => {
    fs.readdir(UPLOAD_DIR, (err, files) => {
        if (err) return res.status(500).json([]);
        const filteredFiles = files.filter(file => file !== '.gitkeep');
        res.json(filteredFiles);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
