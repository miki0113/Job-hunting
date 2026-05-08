const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

app.use(express.static(__dirname));

// 「404」を消すための窓口
app.get('/api/list', (req, res) => {
  res.json([]); // 今は中身を空にしてエラーを防ぎます
});

app.post('/upload', (req, res) => {
  res.send('メンテナンス中');
});

app.listen(port, () => {
  console.log('Running');
});