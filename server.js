const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// ロリポップの設定を待たずに使える一時フォルダ
const uploadDir = '/tmp/'; 
const upload = multer({ dest: uploadDir });

app.use(express.static(__dirname));

// Wordアップロード
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('ファイルがありません');
  const targetPath = path.join(uploadDir, req.file.originalname);
  try {
    fs.renameSync(req.file.path, targetPath);
    res.json({ message: 'Success' });
  } catch (e) {
    res.status(500).send('保存失敗');
  }
});

// リスト表示
app.get('/api/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.json([]);
    const targetFiles = files.filter(f => !f.startsWith('.'));
    res.json(targetFiles.map(f => ({ name: f, url: `/download/${f}` })));
  });
});

// Wordダウンロード
app.get('/download/:name', (req, res) => {
  const filePath = path.join(uploadDir, req.params.name);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('Not Found');
  }
});

const PORT = process.env.PORT || 80;
app.listen(PORT);
