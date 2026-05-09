const express = require('express');
const path = require('path');
const app = express();
const PORT = process.env.PORT || 3000;

// 最もシンプルな静的ファイルの提供
app.use(express.static(__dirname));

// 起動確認用のルート
app.get('/health', (req, res) => {
    res.send('Server is alive');
});

// ファイル一覧を返すダミーAPI（まずは起動を優先）
app.get('/api/list', (req, res) => {
    res.json([]);
});

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
