const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// シンプルに現在のフォルダにあるファイルを表示する設定
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log('Server is running');
});
