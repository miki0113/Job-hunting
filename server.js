const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// 【超重要】ここがファイル名を維持する設定です！
const storage = multer.diskStorage({
    destination: './PDF/',
    filename: (req, file, cb) => {
        // Mikiさんが選んだ「履歴書.pdf」という名前をそのまま使います
        cb(null, file.originalname); 
    }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/PDF', express.static(path.join(__dirname, 'PDF')));

// アップロード処理
app.post('/upload', upload.single('pdfFile'), (req, res) => {
    // HTML側のfetchで結果を受け取るため、成功ステータスを返します
    res.status(200).send('Upload successful');
});

// プルダウン用のリスト取得（募集要項RAFAA...を除外して履歴書だけ出す）
app.get('/api/files', (req, res) => {
    const dirPath = path.join(__dirname, 'PDF');
    fs.readdir(dirPath, (err, files) => {
        if (err) return res.status(500).json([]);
        
        // RAFAAで始まる募集要項ファイルはプルダウンに出さない！
        const filteredFiles = files.filter(file => 
            !file.startsWith('RAFAA') && 
            file.endsWith('.pdf') && 
            file !== '.gitkeep'
        );
        res.json(filteredFiles);
    });
});

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));
