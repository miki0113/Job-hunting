const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();
const port = process.env.PORT || 3000;

// ロリポップが絶対に拒否しない「一時フォルダ」を保存先に指定します
const storage = multer.diskStorage({
  destination: '/tmp', 
  filename: (req, file, cb) => {
    cb(null, file.originalname);
  }
});
const upload = multer({ storage: storage });

app.use(express.static(__dirname));

// Wordファイルを受け取る窓口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('ファイルがありません');
  res.send('アップロード完了！');
});

// 保存されたファイルを確認する窓口
app.get('/api/list', (req, res) => {
  fs.readdir('/tmp', (err, files) => {
    if (err) return res.json([]);
    // Wordファイル（.doc/.docx）だけをリストに出すようにします
    const wordFiles = files.filter(f => f.endsWith('.docx') || f.endsWith('.doc'));
    res.json(wordFiles.map(f => ({ name: f, url: `/download/${f}` })));
  });
});

// ファイルをダウンロードする窓口
app.get('/download/:name', (req, res) => {
  const file = path.join('/tmp', req.params.name);
  res.download(file);
});

app.listen(port, () => {
  console.log('Server is running');
});
