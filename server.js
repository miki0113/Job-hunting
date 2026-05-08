const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// ロリポップの一時フォルダを使います
const storage = multer.diskStorage({
  destination: '/tmp', 
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

// アップロード窓口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('ファイルがありません');
  res.send('アップロード完了！');
});

// ファイルリスト表示
app.get('/api/list', (req, res) => {
  fs.readdir('/tmp', (err, files) => {
    if (err) return res.json([]);
    const wordFiles = files.filter(f => f.endsWith('.docx') || f.endsWith('.doc'));
    res.json(wordFiles.map(f => ({ name: f, url: `/download/${f}` })));
  });
});

// ダウンロード窓口
app.get('/download/:name', (req, res) => {
  const file = path.join('/tmp', req.params.name);
  res.download(file);
});

app.listen(port, () => {
  console.log('Server is running');
});
