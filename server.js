const express = require('express');
const multer = require('multer');
const path = require('path');
const fs = require('fs');
const app = express();

// 保存先フォルダ（一時フォルダ）
const uploadDir = '/tmp/';
const upload = multer({ dest: uploadDir });

app.use(express.static(__dirname));

// 1. アップロード窓口 (HTMLの /api/upload に合わせる)
app.post('/api/upload', upload.single('file'), (req, res) => {
  if (!req.file) return res.status(400).send('ファイルがありません');
  
  // 元のファイル名で保存し直す
  const targetPath = path.join(uploadDir, req.file.originalname);
  
  try {
    fs.renameSync(req.file.path, targetPath);
    res.json({ message: 'Success' });
  } catch (e) {
    res.status(500).send('保存失敗');
  }
});

// 2. リスト取得窓口 (HTMLの /api/list に合わせる)
app.get('/api/list', (req, res) => {
  fs.readdir(uploadDir, (err, files) => {
    if (err) return res.json([]);
    
    // Word, PDF, 画像など就活で使いそうなファイルをリストに出す
    const targetFiles = files.filter(f => 
      f.endsWith('.docx') || f.endsWith('.doc') || 
      f.endsWith('.pdf') || f.endsWith('.png') || f.endsWith('.jpg')
    );
    
    // HTML側が期待する { name, url } の形式で返す
    res.json(targetFiles.map(f => ({ 
      name: f, 
      url: `/download/${f}` 
    })));
  });
});

// 3. ダウンロード窓口
app.get('/download/:name', (req, res) => {
  const filePath = path.join(uploadDir, req.params.name);
  if (fs.existsSync(filePath)) {
    res.download(filePath);
  } else {
    res.status(404).send('ファイルが見つかりません');
  }
});

// ポート設定（ロリポップ用）
const PORT = process.env.PORT || 80;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});
