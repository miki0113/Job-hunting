const express = require('express');
const path = require('path');
const app = express();
const port = process.env.PORT || 3000;

// index.htmlがある場所（一番上の階層）を指定するだけ
app.use(express.static(__dirname));

app.listen(port, () => {
  console.log(`Server running`);
});
