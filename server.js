const express = require('express');
const app = express();
const port = process.env.PORT || 3000;

// 画面を表示するだけの基本機能
app.use(express.static(__dirname));

// ボタンを押してもエラーにならないための「空の窓口」
app.post('/upload', (req, res) => {
  res.send('現在はメンテナンス中です');
});

app.get('/api/list', (req, res) => {
  res.json([]);
});

app.listen(port, () => {
  console.log('Server is running');
});