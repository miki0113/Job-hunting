const express = require('express');
const path = require('path');
const multer = require('multer');
const fs = require('fs'); // フォルダを自動で作るための道具
const app = express();
const port = process.env.PORT || 3000;

// 【重要】uploadsフォルダがなければ勝手に作る設定
const uploadDir = './uploads';
if (!fs.existsSync(uploadDir)){
    fs.mkdirSync(uploadDir);
}

const storage = multer.diskStorage({
  destination: (req, file, cb) => cb(null, uploadDir),
  filename: (req, file, cb) => cb(null, file.originalname)
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));
app.use('/uploads', express.static(uploadDir));

// アップロード窓口
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('アップロード完了！');
});

// ファイル一覧を返す窓口
app.get('/api/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.json([]);
    res.json(files.map(f => ({ name: f, url: `/uploads/${f}` })));
  });
});

app.listen(port, () => {
  console.log('Server is running');
});
