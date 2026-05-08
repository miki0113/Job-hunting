const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// index.htmlを表示するだけの以前のシンプルな設定
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log('Server is running');
});
