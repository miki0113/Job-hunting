const express = require('express');
const path = require('path');
const app = express();

// 環境変数PORT（3000）を使用し、設定がない場合は3000をデフォルトにします
const port = process.env.PORT || 3000;

// publicフォルダ（またはプロジェクト直下）にある静的ファイルを表示するように設定
app.use(express.static(path.join(__dirname, '/')));

// どのURLにアクセスしてもindex.htmlを表示するようにします
app.get('*', (req, res) => {
  res.sendFile(path.join(__dirname, 'index.html'));
});

app.listen(port, () => {
  console.log(`Server is running on port ${port}`);
});
