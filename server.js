const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// ロリポップが嫌がらない「一時フォルダ」を保存先に使います
const upload = multer({ dest: '/tmp/' });

app.use(express.static(__dirname));

// アップロードを受け付ける窓口
app.post('/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('ファイルがありません');
  // 元のファイル名で保存し直す
  const targetPath = path.join('/tmp/', req.file.originalname);
  fs.renameSync(req.file.path, targetPath);
  res.send('アップロード完了！');
});

// 保存されたWordをリストに出す窓口
app.get('/api/list', (req, res) => {
  fs.readdir('/tmp/', (err, files) => {
    if (err) return res.json([]);
    const wordFiles = files.filter(f => f.endsWith('.docx') || f.endsWith('.doc'));
    res.json(wordFiles.map(f => ({ name: f, url: `/download/${f}` })));
  });
});

// ダウンロードする窓口
app.get('/download/:name', (req, res) => {
  res.download(path.join('/tmp/', req.params.name));
});

app.listen(process.env.PORT || 3000);