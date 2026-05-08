const express = require('express');
const path = require('path');
const multer = require('multer');
const app = express();
const port = process.env.PORT || 3000;

// 保存先を一番単純な指定にします
const upload = multer({ dest: 'uploads/' });

app.use(express.static(__dirname));
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

app.post('/upload', upload.single('file'), (req, res) => {
  res.send('アップロード完了！');
});

app.get('/api/list', (req, res) => {
  res.json([]); // 一旦リストは空で返してエラーを防ぎます
});

app.listen(port, () => {
  console.log('Server is running');
});
