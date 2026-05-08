const express = require('express');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// 【修正】フォルダを新しく作らず、一時的な場所を使います
const upload = multer({ dest: '/tmp/' });

app.use(express.static(__dirname));

// アップロード窓口
app.post('/upload', upload.single('file'), (req, res) => {
  res.send('アップロード完了！');
});

// 一旦エラーを避けるため、リストは空にします
app.get('/api/list', (req, res) => {
  res.json([]);
});

app.listen(port, () => {
  console.log('Server is running');
});